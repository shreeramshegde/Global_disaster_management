insert into event_types (name)
values ('earthquake'), ('wildfire'), ('flood'), ('conflict')
on conflict (name) do nothing;

with base_regions as (
  select *
  from (
    values
      (1, 'San Francisco, USA', 37.7749::double precision, -122.4194::double precision),
      (2, 'Tokyo, Japan', 35.6762::double precision, 139.6503::double precision),
      (3, 'Santiago, Chile', -33.4489::double precision, -70.6693::double precision),
      (4, 'Jakarta, Indonesia', -6.2088::double precision, 106.8456::double precision),
      (5, 'Nairobi, Kenya', -1.2921::double precision, 36.8219::double precision),
      (6, 'Athens, Greece', 37.9838::double precision, 23.7275::double precision),
      (7, 'Istanbul, Turkey', 41.0082::double precision, 28.9784::double precision),
      (8, 'Manila, Philippines', 14.5995::double precision, 120.9842::double precision),
      (9, 'Khartoum, Sudan', 15.5007::double precision, 32.5599::double precision),
      (10, 'Kyiv, Ukraine', 50.4501::double precision, 30.5234::double precision),
      (11, 'Houston, USA', 29.7604::double precision, -95.3698::double precision),
      (12, 'Brisbane, Australia', -27.4698::double precision, 153.0251::double precision)
  ) as regions(region_id, place, latitude, longitude)
),
seed_rows as (
  select
    gs as seq,
    case ((gs - 1) % 4)
      when 0 then 'earthquake'
      when 1 then 'wildfire'
      when 2 then 'flood'
      else 'conflict'
    end as type_name,
    br.place,
    round((br.latitude + (((gs % 5) - 2) * 0.71))::numeric, 4)::double precision as latitude,
    round((br.longitude + (((gs % 7) - 3) * 0.67))::numeric, 4)::double precision as longitude,
    case ((gs - 1) % 4)
      when 0 then round((2.8 + ((gs * 11) % 48) / 10.0)::numeric, 1)::double precision
      when 1 then round((300 + ((gs * 17) % 105))::numeric, 1)::double precision
      when 2 then round((10 + ((gs * 13) % 60))::numeric, 1)::double precision
      else round((1 + ((gs * 7) % 35))::numeric, 1)::double precision
    end as magnitude,
    (now() - ((gs * 19) || ' hours')::interval) as event_time
  from generate_series(1, 80) as gs
  join base_regions br on br.region_id = ((gs - 1) % 12) + 1
),
seed_locations as (
  insert into locations (place, latitude, longitude)
  select distinct place, latitude, longitude
  from seed_rows
  on conflict (place, latitude, longitude) do nothing
  returning id, place, latitude, longitude
),
all_locations as (
  select id, place, latitude, longitude from seed_locations
  union
  select l.id, l.place, l.latitude, l.longitude
  from locations l
  join seed_rows s
    on s.place = l.place
   and s.latitude = l.latitude
   and s.longitude = l.longitude
),
prepared_events as (
  select
    'manual_sql_' || lpad(seq::text, 3, '0') as event_id,
    et.id as event_type_id,
    al.id as location_id,
    sr.magnitude,
    case
      when sr.magnitude > 6 then 'High'
      when sr.magnitude >= 3 then 'Medium'
      else 'Low'
    end as severity,
    sr.event_time,
    'manual' as source_type
  from seed_rows sr
  join event_types et on et.name = sr.type_name
  join all_locations al
    on al.place = sr.place
   and al.latitude = sr.latitude
   and al.longitude = sr.longitude
)
insert into disaster_events (
  event_id,
  event_type_id,
  location_id,
  magnitude,
  severity,
  event_time,
  source_type
)
select
  event_id,
  event_type_id,
  location_id,
  magnitude,
  severity,
  event_time,
  source_type
from prepared_events
on conflict (event_id) do update
set
  event_type_id = excluded.event_type_id,
  location_id = excluded.location_id,
  magnitude = excluded.magnitude,
  -- Severity and updated_at are ultimately enforced by triggers. Keeping them in
  -- the UPSERT makes seed reruns readable while the trigger remains authoritative.
  severity = excluded.severity,
  event_time = excluded.event_time,
  source_type = excluded.source_type,
  is_deleted = false,
  updated_at = now();
