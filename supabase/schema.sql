-- MyGoProfile — Supabase schema
-- Run in Supabase SQL Editor (or via supabase db push).
-- Auth identity lives in auth.users; app data lives here.

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  team_owner_id uuid references public.profiles (id) on delete set null,
  welcome_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_team_owner_id_idx on public.profiles (team_owner_id);

-- ---------------------------------------------------------------------------
-- google_connections — GBP OAuth tokens (encrypted refresh token)
-- Separate from Supabase Auth: login ≠ vs Business Profile API access.
-- ---------------------------------------------------------------------------
create table if not exists public.google_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  google_account_email text,
  -- AES-GCM ciphertext of the refresh token (never store plaintext)
  refresh_token_encrypted text not null,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- managed_locations
-- ---------------------------------------------------------------------------
create table if not exists public.managed_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Google resource names, e.g. accounts/123/locations/456
  location_name text not null,
  account_id text,
  title text,
  emoji text,
  date_added timestamptz not null default now(),
  unique (user_id, location_name)
);

-- Idempotent add for existing DBs that already created managed_locations without emoji
alter table public.managed_locations add column if not exists emoji text;

create index if not exists managed_locations_user_id_idx on public.managed_locations (user_id);

-- ---------------------------------------------------------------------------
-- ai_summaries
-- ---------------------------------------------------------------------------
create table if not exists public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  location_name text not null,
  summary text not null,
  generated_at timestamptz not null default now(),
  unique (user_id, location_name)
);

-- ---------------------------------------------------------------------------
-- subscriptions — Stripe state (server / webhook writes only)
-- ---------------------------------------------------------------------------
create type public.plan_id as enum ('starter', 'growth', 'enterprise');
create type public.subscription_status as enum (
  'trialing', 'active', 'cancelled', 'incomplete', 'past_due', 'unpaid'
);

create table if not exists public.subscriptions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  plan_id public.plan_id not null,
  status public.subscription_status not null default 'trialing',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- invites — team access
-- ---------------------------------------------------------------------------
create type public.invite_status as enum ('pending', 'claimed', 'revoked');

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text,
  invite_code text not null unique,
  location_names text[] not null default '{}',
  status public.invite_status not null default 'pending',
  claimed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists invites_owner_id_idx on public.invites (owner_id);
create index if not exists invites_invite_code_idx on public.invites (invite_code);

-- ---------------------------------------------------------------------------
-- waitlist (optional — keep until signup is fully open)
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_idx on public.waitlist (lower(email));

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists google_connections_updated_at on public.google_connections;
create trigger google_connections_updated_at
  before update on public.google_connections
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.google_connections enable row level security;
alter table public.managed_locations enable row level security;
alter table public.ai_summaries enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invites enable row level security;
alter table public.waitlist enable row level security;

-- profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Team members can read their owner's profile (limited)
create policy "Team members can read owner profile"
  on public.profiles for select
  using (auth.uid() = team_owner_id or id = auth.uid());

-- google_connections: owner only; writes via service role preferred
create policy "Users can read own google connection"
  on public.google_connections for select
  using (auth.uid() = user_id);

create policy "Users can delete own google connection"
  on public.google_connections for delete
  using (auth.uid() = user_id);

-- managed_locations
create policy "Users can manage own locations"
  on public.managed_locations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ai_summaries
create policy "Users can manage own summaries"
  on public.ai_summaries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- subscriptions: read own; writes only via service role (no insert/update/delete policies for clients)
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- invites
create policy "Owners can manage their invites"
  on public.invites for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Authenticated users can read invites to claim"
  on public.invites for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can claim invite"
  on public.invites for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- waitlist: public insert only (anon)
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);
