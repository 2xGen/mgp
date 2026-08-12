-- Activity log for team transparency / GBP policy accountability.
-- Run in Supabase SQL Editor after schema.sql.

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  location_name text,
  action text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_owner_created_idx
  on public.activity_log (owner_id, created_at desc);

alter table public.activity_log enable row level security;

create policy "Owners and team can read activity"
  on public.activity_log for select
  using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.team_owner_id = activity_log.owner_id
    )
  );

-- Writes via service role only (no insert policy for clients).
