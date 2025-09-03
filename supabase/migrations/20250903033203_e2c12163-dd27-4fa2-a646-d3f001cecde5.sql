-- 1) Trigger to auto-create profile on signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

-- 2) Allow public (including anon) read access to specialties
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'specialties'
      AND policyname = 'Specialties are viewable by everyone'
  ) THEN
    CREATE POLICY "Specialties are viewable by everyone"
      ON public.specialties
      FOR SELECT
      USING (true);
  END IF;
END
$$;

-- 3) Public doctors listing via SECURITY DEFINER function (exposes limited columns only)
CREATE OR REPLACE FUNCTION public.get_public_doctors()
RETURNS TABLE (
  id uuid,
  first_name text,
  last_name text,
  specialty text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, first_name, last_name, specialty
  FROM public.profiles
  WHERE role = 'doctor'::user_role
$$;

-- Grant execute to web roles
GRANT EXECUTE ON FUNCTION public.get_public_doctors() TO anon, authenticated;
