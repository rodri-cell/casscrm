-- ─────────────────────────────────────────────────────────────────────────────
-- Marketing Agency CRM — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type user_role as enum ('agency', 'client');
create type client_status as enum ('active', 'inactive', 'prospect');
create type campaign_status as enum ('active', 'paused', 'completed', 'draft');
create type campaign_type as enum ('social', 'email', 'seo', 'ppc', 'content');

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields.
-- One row per authenticated user.

create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null,
  role        user_role not null default 'client',
  company     text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Clients ─────────────────────────────────────────────────────────────────
-- Represents a client company managed by the agency.
-- profile_id links to a portal account (optional — a client may not have login).

create table clients (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid references profiles(id) on delete set null,
  name            text not null,
  email           text not null,
  company         text not null,
  phone           text,
  status          client_status not null default 'prospect',
  monthly_budget  numeric(10,2) not null default 0,
  joined_at       date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Campaigns ───────────────────────────────────────────────────────────────

create table campaigns (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references clients(id) on delete cascade,
  name         text not null,
  status       campaign_status not null default 'draft',
  type         campaign_type not null,
  start_date   date not null,
  end_date     date,
  budget       numeric(10,2) not null default 0,
  spent        numeric(10,2) not null default 0,
  impressions  integer not null default 0,
  clicks       integer not null default 0,
  conversions  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────

alter table profiles  enable row level security;
alter table clients   enable row level security;
alter table campaigns enable row level security;

-- Profiles: users can read/update their own profile
create policy "profiles: own read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: own update"
  on profiles for update
  using (auth.uid() = id);

-- Agency users can read all profiles
create policy "profiles: agency read all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'agency'
    )
  );

-- Clients: agency can do everything
create policy "clients: agency full access"
  on clients for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'agency'
    )
  );

-- Clients: client users can only read their own record
create policy "clients: client read own"
  on clients for select
  using (profile_id = auth.uid());

-- Campaigns: agency can do everything
create policy "campaigns: agency full access"
  on campaigns for all
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'agency'
    )
  );

-- Campaigns: client users can only read their own campaigns
create policy "campaigns: client read own"
  on campaigns for select
  using (
    exists (
      select 1 from clients c
      where c.id = campaigns.client_id
        and c.profile_id = auth.uid()
    )
  );

-- ─── Updated_at trigger ───────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at  before update on profiles  for each row execute procedure set_updated_at();
create trigger clients_updated_at   before update on clients   for each row execute procedure set_updated_at();
create trigger campaigns_updated_at before update on campaigns for each row execute procedure set_updated_at();

-- ─── Sample data (optional — remove in production) ───────────────────────────
-- NOTE: To insert sample data you must first create users via Supabase Auth
-- (Dashboard → Authentication → Users → Add user), then run:
--
-- insert into clients (name, email, company, status, monthly_budget, joined_at) values
--   ('Ana García',     'ana@empresa.com',    'Empresa García S.L.',    'active',   2500, '2024-01-15'),
--   ('Roberto López',  'roberto@tienda.com', 'Tienda Online López',    'active',   1800, '2024-03-20'),
--   ('María Fernández','maria@restaurante.com','Restaurante El Buen Sabor','prospect', 800, '2024-06-01');
