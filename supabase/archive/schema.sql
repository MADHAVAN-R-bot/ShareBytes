-- =============================================================================
-- ShareBytes Supabase Database Schema
-- Dependency order: Tables → Functions/Triggers → RLS Policies → Storage
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Core Tables (profiles must come FIRST — all others FK-reference it)
-- -----------------------------------------------------------------------------

-- 1a. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT NOT NULL,
  role                  TEXT NOT NULL CHECK (role IN ('customer', 'restaurant', 'food_donor', 'ngo', 'admin')),
  full_name             TEXT NOT NULL DEFAULT '',
  phone                 TEXT DEFAULT '',
  business_name         TEXT DEFAULT '',
  address               TEXT DEFAULT '',
  fssai_cert_url        TEXT DEFAULT '',
  registration_cert_url TEXT DEFAULT '',
  entity_photo_url      TEXT DEFAULT '',
  verified_status       TEXT NOT NULL DEFAULT 'pending' CHECK (verified_status IN ('pending', 'verified', 'rejected')),
  rejection_reason      TEXT DEFAULT '',
  is_demo               BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1b. Listings Table (references profiles)
CREATE TABLE IF NOT EXISTS public.listings (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title              TEXT NOT NULL,
  description        TEXT DEFAULT '',
  food_type          TEXT NOT NULL DEFAULT 'veg' CHECK (food_type IN ('veg', 'non_veg')),
  portion_count      INT NOT NULL DEFAULT 1,
  original_price     NUMERIC(10,2) DEFAULT 0.00,
  discounted_price   NUMERIC(10,2) DEFAULT 0.00,
  is_donation_only   BOOLEAN NOT NULL DEFAULT FALSE,
  expiry_time        TIMESTAMPTZ NOT NULL,
  ngo_priority_until TIMESTAMPTZ,  -- NGO-only claim window: NULL after first hour
  delivery_available BOOLEAN NOT NULL DEFAULT FALSE,
  pickup_location    TEXT NOT NULL DEFAULT '',
  image_url          TEXT DEFAULT '',
  status             TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'cancelled')),
  created_by         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_type          TEXT NOT NULL CHECK (role_type IN ('restaurant', 'food_donor')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1c. Claims Table (references listings and profiles)
CREATE TABLE IF NOT EXISTS public.claims (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id         UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  claimed_by         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  portion_count      INT NOT NULL DEFAULT 1,
  status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  payment_method     TEXT NOT NULL DEFAULT 'cash_on_pickup' CHECK (payment_method IN ('cash_on_pickup', 'cash_on_delivery')),
  delivery_requested BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1d. Notifications Table (references profiles)
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  link       TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1e. Audit Logs Table (nullable FK to profiles)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  target     TEXT DEFAULT '',
  details    JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- STEP 2: Functions & Triggers (profiles table now exists — safe to reference)
-- -----------------------------------------------------------------------------

-- 2a. is_admin() — Admin-check helper used in all RLS policies.
--     SECURITY DEFINER: bypasses RLS when called inside a policy (prevents recursion).
--     Defined AFTER profiles table exists — this is the critical fix.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2b. handle_new_user() — Auto-creates a profiles row when a new auth.users row is inserted.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    phone,
    business_name,
    address,
    fssai_cert_url,
    registration_cert_url,
    entity_photo_url,
    verified_status,
    is_demo
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'fssai_cert_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'registration_cert_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'entity_photo_url', ''),
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'customer') IN ('restaurant', 'ngo') THEN 'pending'
      ELSE 'verified'
    END,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2c. handle_updated_at() — Keeps updated_at current on any profile edit.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- STEP 3: Enable Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs    ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- STEP 4: RLS Policies (is_admin() function now exists — safe to call)
-- -----------------------------------------------------------------------------

-- Profiles
CREATE POLICY "Profiles viewable by owner or admin"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
    OR role IN ('restaurant', 'ngo', 'food_donor')
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- Listings
CREATE POLICY "Public listings viewable by authenticated users"
  ON public.listings FOR SELECT
  USING (
    status = 'available'
    OR created_by = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "Listings manageable by owner or admin"
  ON public.listings FOR ALL
  USING (created_by = auth.uid() OR public.is_admin());

-- Claims
CREATE POLICY "Claims viewable by claimer, listing owner, or admin"
  ON public.claims FOR SELECT
  USING (
    claimed_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = claims.listing_id AND created_by = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "Claims creatable by authenticated users"
  ON public.claims FOR INSERT
  WITH CHECK (auth.uid() = claimed_by);

CREATE POLICY "Claims updatable by listing owner or admin"
  ON public.claims FOR UPDATE
  USING (
    claimed_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = claims.listing_id AND created_by = auth.uid()
    )
    OR public.is_admin()
  );

-- Notifications
CREATE POLICY "Notifications viewable by owner"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Notifications updatable by owner"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Audit Logs
CREATE POLICY "Audit logs viewable by admin"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- STEP 5: Storage Bucket & Object Policies
-- (No dependency on profiles — pure bucket_id check)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('sharebytes-uploads', 'sharebytes-uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Uploads accessible to public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sharebytes-uploads');

CREATE POLICY "Uploads insertable by authenticated users"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sharebytes-uploads');

-- =============================================================================
-- END OF SCHEMA — ShareBytes is fully configured.
-- =============================================================================
