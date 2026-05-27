create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────
create table profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  full_name    text,
  phone        text,
  email        text,
  role         text check (role in ('admin','retail','wholesale')) default 'retail',
  gstin        text,
  company_name text,
  created_at   timestamptz default now()
);

-- ── Products ──────────────────────────────────────────────
create table products (
  id                  uuid default uuid_generate_v4() primary key,
  code                text unique not null,
  name                text not null,
  description         text,
  category            text not null,
  sub_category        text,
  price_mrp           numeric not null check (price_mrp >= 0),
  price_retail        numeric not null check (price_retail >= 0),
  price_wholesale     numeric not null check (price_wholesale >= 0),
  images              text[] default '{}',
  in_stock            boolean default true,
  min_qty_wholesale   integer default 5,
  specs               jsonb default '{}',
  featured            boolean default false,
  created_at          timestamptz default now()
);

-- ── Orders ────────────────────────────────────────────────
create table orders (
  id               uuid default uuid_generate_v4() primary key,
  user_id          uuid references profiles(id),
  order_type       text check (order_type in ('retail','wholesale')) not null,
  status           text check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')) default 'pending',
  items            jsonb not null,
  subtotal         numeric not null,
  discount_pct     numeric default 0,
  discount_amount  numeric default 0,
  total            numeric not null,
  shipping_address jsonb not null,
  billing_address  jsonb,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  gstin            text,
  notes            text,
  whatsapp_sent    boolean default false,
  created_at       timestamptz default now()
);

-- ── Discount Settings ──────────────────────────────────────
create table discount_settings (
  id              uuid default uuid_generate_v4() primary key,
  type            text check (type in ('retail','wholesale')) unique not null,
  discount_pct    numeric default 0,
  min_order_qty   integer default 1,
  min_order_value numeric default 0,
  updated_at      timestamptz default now()
);

insert into discount_settings (type, discount_pct, min_order_qty, min_order_value)
values ('retail', 5, 1, 0), ('wholesale', 15, 5, 10000);

-- ── Contact Inquiries ──────────────────────────────────────
create table contact_inquiries (
  id         uuid default uuid_generate_v4() primary key,
  name       text not null,
  email      text,
  phone      text,
  message    text not null,
  created_at timestamptz default now()
);

-- ── Auto-create profile on signup ─────────────────────────
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$ language sql stable security definer set search_path = public;

-- ── Row Level Security ────────────────────────────────────
alter table profiles          enable row level security;
alter table products          enable row level security;
alter table orders            enable row level security;
alter table discount_settings enable row level security;
alter table contact_inquiries enable row level security;

-- profiles
create policy "Own profile" on profiles for select using (auth.uid() = id);
create policy "Insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Update own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admin all profiles" on profiles for all using (public.is_admin()) with check (public.is_admin());

-- products
create policy "Public products" on products for select using (true);
create policy "Admin products" on products for all using (public.is_admin()) with check (public.is_admin());

-- orders
create policy "Own orders" on orders for select using (auth.uid() = user_id);
create policy "Insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin all orders" on orders for all using (public.is_admin()) with check (public.is_admin());

-- discount_settings
create policy "Public discount settings" on discount_settings for select using (true);
create policy "Admin discount settings" on discount_settings for all using (public.is_admin()) with check (public.is_admin());

-- contact_inquiries
create policy "Insert contact" on contact_inquiries for insert with check (true);
create policy "Admin contact" on contact_inquiries for select using (public.is_admin());
