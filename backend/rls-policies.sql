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
