-- Track welcome email so we don't re-send on every login.
-- Run once in Supabase SQL Editor.

alter table public.profiles
  add column if not exists welcome_email_sent_at timestamptz;
