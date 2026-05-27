-- Fix infinite recursion caused by policies that query profiles from profiles RLS.
create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

drop policy if exists "Admin all profiles" on public.profiles;
drop policy if exists "Admin products" on public.products;
drop policy if exists "Admin all orders" on public.orders;
drop policy if exists "Admin discount settings" on public.discount_settings;
drop policy if exists "Admin contact" on public.contact_inquiries;

create policy "Admin all profiles" on public.profiles
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin products" on public.products
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin all orders" on public.orders
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin discount settings" on public.discount_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin contact" on public.contact_inquiries
  for select
  using (public.is_admin());
