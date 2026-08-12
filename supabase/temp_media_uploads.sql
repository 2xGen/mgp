-- Ephemeral image bytes for Google Media.Create sourceUrl (NOT Supabase Storage).
-- Rows are deleted right after Google fetches / within ~10 minutes.
create table if not exists public.temp_media_uploads (
  id text primary key,
  content_type text not null,
  data_base64 text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists temp_media_uploads_expires_at_idx
  on public.temp_media_uploads (expires_at);

alter table public.temp_media_uploads enable row level security;
-- Service role only (no policies for anon/authenticated).
