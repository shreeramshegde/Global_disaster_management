create table disaster_events (
id uuid primary key default gen_random_uuid(),
event_id text unique,
type text,
magnitude float,
place text,
latitude float,
longitude float,
event_time timestamp,
severity text,
created_at timestamp default now()
);

-- Required when using the anon public key from the backend.
-- Run these policies in Supabase SQL editor if Row Level Security is enabled.
alter table disaster_events enable row level security;

create policy "Allow public read disaster events"
on disaster_events
for select
to anon
using (true);

create policy "Allow public insert disaster events"
on disaster_events
for insert
to anon
with check (true);

create policy "Allow public update disaster events"
on disaster_events
for update
to anon
using (true)
with check (true);
