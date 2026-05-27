-- Keep profile rows in sync with the metadata collected during signup.
create or replace function handle_new_user()
returns trigger as $$
declare
  user_role text := coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'retail');
begin
  insert into public.profiles (id, email, full_name, phone, role, gstin, company_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    case when user_role in ('retail', 'wholesale', 'admin') then user_role else 'retail' end,
    new.raw_user_meta_data->>'gstin',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    role = excluded.role,
    gstin = excluded.gstin,
    company_name = excluded.company_name;
  return new;
end;
$$ language plpgsql security definer set search_path = public;
