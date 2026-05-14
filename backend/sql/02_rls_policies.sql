alter table event_types enable row level security;
alter table locations enable row level security;
alter table disaster_events enable row level security;
alter table admin_users enable row level security;

drop policy if exists "Allow public read event types" on event_types;
create policy "Allow public read event types"
on event_types
for select
to anon
using (true);

drop policy if exists "Allow public insert event types" on event_types;
create policy "Allow public insert event types"
on event_types
for insert
to anon
with check (true);

drop policy if exists "Allow public update event types" on event_types;
create policy "Allow public update event types"
on event_types
for update
to anon
using (true)
with check (true);

drop policy if exists "Allow public read locations" on locations;
create policy "Allow public read locations"
on locations
for select
to anon
using (true);

drop policy if exists "Allow public insert locations" on locations;
create policy "Allow public insert locations"
on locations
for insert
to anon
with check (true);

drop policy if exists "Allow public update locations" on locations;
create policy "Allow public update locations"
on locations
for update
to anon
using (true)
with check (true);

drop policy if exists "Allow public read disaster events" on disaster_events;
create policy "Allow public read disaster events"
on disaster_events
for select
to anon
using (true);

drop policy if exists "Allow public insert disaster events" on disaster_events;
create policy "Allow public insert disaster events"
on disaster_events
for insert
to anon
with check (source_type in ('external', 'manual'));

drop policy if exists "Allow public update disaster events" on disaster_events;
create policy "Allow public update disaster events"
on disaster_events
for update
to anon
using (true)
with check (source_type in ('external', 'manual'));

drop policy if exists "Deny public access to admin users" on admin_users;
create policy "Deny public access to admin users"
on admin_users
for all
to anon
using (false)
with check (false);
