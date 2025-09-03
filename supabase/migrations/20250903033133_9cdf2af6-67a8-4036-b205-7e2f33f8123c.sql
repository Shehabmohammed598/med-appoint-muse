-- 1) Trigger to auto-create profile on signup (uses existing SECURITY DEFINER function)
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Allow public (including anon) read access to specialties
create policy if not exists "Specialties are viewable by everyone"
  on public.specialties
  for select
  using (true);

-- 3) Public doctors listing via SECURITY DEFINER function (exposes limited columns only)
create or replace function public.get_public_doctors()
returns table (
  id uuid,
  first_name text,
  last_name text,
  specialty text
)
language sql
stable
security definer
set search_path = public
as $$
  select id, first_name, last_name, specialty
  from public.profiles
  where role = 'doctor'::user_role
$$;

-- Grant execute to web roles
grant execute on function public.get_public_doctors() to anon, authenticated;
