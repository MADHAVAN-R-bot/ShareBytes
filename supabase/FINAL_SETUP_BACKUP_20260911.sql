-- =============================================================================
-- ShareBytes — Backup of FINAL_SETUP.sql (Created 2026-09-11)
-- File: supabase/FINAL_SETUP_BACKUP_20260911.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Core Tables
-- -----------------------------------------------------------------------------

-- 1a. Profiles Table (must come FIRST — all other custom tables FK-reference it)
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
  is_suspended          BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo               BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure profiles_role_check constraint allows all 5 canonical roles
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'restaurant', 'food_donor', 'ngo', 'admin'));

-- Ensure is_suspended column exists on profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE;

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
  ngo_priority_until TIMESTAMPTZ,
  delivery_available BOOLEAN NOT NULL DEFAULT FALSE,
  pickup_location    TEXT NOT NULL DEFAULT '',
  image_url          TEXT DEFAULT '',
  status             TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'cancelled')),
  created_by         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_type          TEXT NOT NULL CHECK (role_type IN ('restaurant', 'food_donor')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure ngo_priority_until column exists on listings table
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS ngo_priority_until TIMESTAMPTZ;

-- 1c. Claims Table (references listings and profiles)
CREATE TABLE IF NOT EXISTS public.claims (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id         UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  claimed_by         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  portion_count      INT NOT NULL DEFAULT 1,
  status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  payment_method     TEXT NOT NULL DEFAULT 'cash_on_pickup' CHECK (payment_method IN ('cash_on_pickup', 'cash_on_delivery', 'online')),
  delivery_requested BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure claims_payment_method_check constraint allows 'online'
ALTER TABLE public.claims
  DROP CONSTRAINT IF EXISTS claims_payment_method_check;

ALTER TABLE public.claims
  ADD CONSTRAINT claims_payment_method_check
  CHECK (payment_method IN ('cash_on_pickup', 'cash_on_delivery', 'online'));

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

-- 1e. Audit Logs Table (references profiles, nullable actor)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  target     TEXT DEFAULT '',
  details    JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- STEP 2: Functions & Triggers
-- -----------------------------------------------------------------------------

-- 2a. is_admin() — Admin-check helper function used in RLS policies.
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

-- 2b. handle_new_user() — Trigger function to auto-create a profiles row on auth signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role TEXT;
BEGIN
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  IF _role NOT IN ('customer', 'restaurant', 'food_donor', 'ngo', 'admin') THEN
    _role := 'customer';
  END IF;

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
    is_suspended,
    is_demo
  )
  VALUES (
    NEW.id,
    NEW.email,
    _role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    COALESCE(NEW.raw_user_meta_data->>'fssai_cert_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'registration_cert_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'entity_photo_url', ''),
    CASE
      WHEN _role IN ('restaurant', 'ngo') THEN 'pending'
      ELSE 'verified'
    END,
    FALSE,
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

-- 2c. handle_updated_at() — Updates updated_at timestamp.
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
-- STEP 3: Enable Row Level Security (RLS) on all tables
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs    ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- STEP 4: Row Level Security (RLS) Policies
-- -----------------------------------------------------------------------------

-- 4a. Profiles Policies
DROP POLICY IF EXISTS "Profiles viewable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles viewable by owner or admin"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id
    OR public.is_admin()
    OR role IN ('restaurant', 'ngo', 'food_donor')
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

-- 4b. Listings Policies
DROP POLICY IF EXISTS "Public listings viewable by authenticated users" ON public.listings;
CREATE POLICY "Public listings viewable by authenticated users"
  ON public.listings FOR SELECT
  USING (
    status = 'available'
    OR created_by = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Listings manageable by owner or admin" ON public.listings;
DROP POLICY IF EXISTS "Listings creatable by verified active owners" ON public.listings;
CREATE POLICY "Listings creatable by verified active owners"
  ON public.listings FOR INSERT
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Listings updatable by active owner or admin" ON public.listings;
CREATE POLICY "Listings updatable by active owner or admin"
  ON public.listings FOR UPDATE
  USING (created_by = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Listings deletable by active owner or admin" ON public.listings;
CREATE POLICY "Listings deletable by active owner or admin"
  ON public.listings FOR DELETE
  USING (created_by = auth.uid() OR public.is_admin());

-- 4c. Claims Policies
DROP POLICY IF EXISTS "Claims viewable by claimer, listing owner, or admin" ON public.claims;
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

DROP POLICY IF EXISTS "Claims creatable by authenticated users" ON public.claims;
CREATE POLICY "Claims creatable by authenticated users"
  ON public.claims FOR INSERT
  WITH CHECK (
    auth.uid() = claimed_by
    AND (
      (SELECT ngo_priority_until FROM public.listings WHERE id = listing_id) IS NULL
      OR NOW() > (SELECT ngo_priority_until FROM public.listings WHERE id = listing_id)
      OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ngo'
    )
  );

DROP POLICY IF EXISTS "Claims updatable by listing owner or admin" ON public.claims;
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

-- 4d. Notifications Policies
DROP POLICY IF EXISTS "Notifications viewable by owner" ON public.notifications;
CREATE POLICY "Notifications viewable by owner"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Notifications updatable by owner" ON public.notifications;
CREATE POLICY "Notifications updatable by owner"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- 4e. Audit Logs Policy
DROP POLICY IF EXISTS "Audit logs viewable by admin" ON public.audit_logs;
CREATE POLICY "Audit logs viewable by admin"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- STEP 5: Storage Bucket & Storage Object Policies
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('sharebytes-uploads', 'sharebytes-uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Uploads accessible to public" ON storage.objects;
CREATE POLICY "Uploads accessible to public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sharebytes-uploads');

DROP POLICY IF EXISTS "Uploads insertable by authenticated users" ON storage.objects;
CREATE POLICY "Uploads insertable by authenticated users"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'sharebytes-uploads'
    AND auth.role() = 'authenticated'
  );
