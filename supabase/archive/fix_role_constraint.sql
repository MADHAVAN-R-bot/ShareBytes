-- =============================================================================
-- ShareBytes — Role Constraint Fix + NGO Priority Window Migration
-- Run this in Supabase SQL Editor on your EXISTING database.
-- Safe to run multiple times (idempotent).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Fix the profiles_role_check constraint (Issues 8 & 9)
-- The old constraint was rejecting valid canonical role values.
-- Canonical set: customer | restaurant | food_donor | ngo | admin
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'restaurant', 'food_donor', 'ngo', 'admin'));

-- -----------------------------------------------------------------------------
-- STEP 2: Add ngo_priority_until to listings table (Issue 6)
-- Listings created before this migration will have NULL (no priority window).
-- New listings will have this set to created_at + 1 hour by the application.
-- -----------------------------------------------------------------------------
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS ngo_priority_until TIMESTAMPTZ;

-- -----------------------------------------------------------------------------
-- STEP 3: Update handle_new_user() trigger to use canonical role values
-- This ensures signup via Supabase Auth always produces a valid profiles row.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role TEXT;
BEGIN
  -- Validate and sanitize incoming role from signup metadata
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');

  -- Enforce canonical role set — reject anything invalid, default to customer
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
    verified_status
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
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Reattach trigger (DROP IF EXISTS to avoid duplicate trigger error)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- STEP 4: Add NGO priority RLS policy for listings claims
-- During the priority window, only NGO-role users can claim a listing.
-- (The app enforces this client-side too; this is the DB-level safety net.)
-- -----------------------------------------------------------------------------

-- Note: The actual NGO priority enforcement is handled in the application layer.
-- If you want a database-level check, add it to your claims RLS policies
-- by updating the INSERT policy to check ngo_priority_until:

-- Drop existing INSERT policy for claims to recreate with priority check:
DROP POLICY IF EXISTS "Claims creatable by authenticated users" ON public.claims;

CREATE POLICY "Claims creatable by authenticated users"
  ON public.claims FOR INSERT
  WITH CHECK (
    auth.uid() = claimed_by
    AND (
      -- Allow if: no priority window set, or window has expired, or claimer is an NGO
      (SELECT ngo_priority_until FROM public.listings WHERE id = listing_id) IS NULL
      OR NOW() > (SELECT ngo_priority_until FROM public.listings WHERE id = listing_id)
      OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ngo'
    )
  );

-- =============================================================================
-- END OF PATCH
-- =============================================================================
