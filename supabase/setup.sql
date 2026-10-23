-- Kilimanjaro Hillside Resort: Supabase setup. Run once in Supabase > SQL Editor.
-- Then: Authentication > Users > Add user (email + password) for each staff member.
-- Then paste your Project URL and anon key into js/config.js (SUPABASE_URL, SUPABASE_ANON_KEY).

-- 1) Catalogue: menu items, rooms, gallery and printed-menu images live in one JSON row. Anyone can read; only signed-in staff can write.
create table if not exists site_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
alter table site_data enable row level security;
drop policy if exists "public read catalogue" on site_data;
drop policy if exists "staff write catalogue" on site_data;
create policy "public read catalogue" on site_data for select using (true);
create policy "staff write catalogue" on site_data for all to authenticated using (true) with check (true);

-- 2) Requests: quote requests, cart orders and enquiries. Guests can only ADD one; only staff can read, reply, change or delete.
create table if not exists requests (
  id text primary key,
  created timestamptz default now(),
  kind text not null,
  status text not null default 'New',
  name text not null,
  phone text not null,
  email text,
  title text,
  details jsonb default '[]'::jsonb,
  message text,
  quote numeric,
  thread jsonb default '[]'::jsonb
);
alter table requests enable row level security;
drop policy if exists "guests can submit" on requests;
drop policy if exists "staff manage requests" on requests;
create policy "guests can submit" on requests for insert to anon, authenticated with check (status = 'New');
create policy "staff manage requests" on requests for all to authenticated using (true) with check (true);

-- 3) Images: a public bucket called "media". Anyone can view; only signed-in staff can upload or delete.
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
drop policy if exists "public view media" on storage.objects;
drop policy if exists "staff upload media" on storage.objects;
drop policy if exists "staff update media" on storage.objects;
drop policy if exists "staff delete media" on storage.objects;
create policy "public view media" on storage.objects for select using (bucket_id = 'media');
create policy "staff upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "staff update media" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "staff delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
