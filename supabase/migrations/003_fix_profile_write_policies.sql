-- Allow a signed-in user to create or update only their own profile.
drop policy if exists "Insert own profile" on public.profiles;
drop policy if exists "Update own profile" on public.profiles;

create policy "Insert own profile" on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Update own profile" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
