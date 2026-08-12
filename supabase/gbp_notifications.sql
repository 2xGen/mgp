-- Dedupe + tracking for GBP Pub/Sub → email (new reviews MVP)
create table if not exists public.review_notification_emails (
  review_name text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  location_name text,
  sent_at timestamptz not null default now()
);

create index if not exists review_notification_emails_user_id_idx
  on public.review_notification_emails (user_id);

create index if not exists review_notification_emails_sent_at_idx
  on public.review_notification_emails (sent_at);

alter table public.review_notification_emails enable row level security;
-- Service role only (no anon/auth policies).

-- Helpful for resolving Pub/Sub → owner
create index if not exists managed_locations_account_id_idx
  on public.managed_locations (account_id);

create index if not exists managed_locations_location_name_idx
  on public.managed_locations (location_name);
