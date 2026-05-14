create extension if not exists pgcrypto;

do $$
declare
  has_legacy_type boolean;
  has_normalized_fk boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'disaster_events'
      and column_name = 'type'
  ) into has_legacy_type;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'disaster_events'
      and column_name = 'event_type_id'
  ) into has_normalized_fk;

  if has_legacy_type and not has_normalized_fk then
    execute 'alter table disaster_events rename to disaster_events_legacy';
  end if;
end $$;

create table if not exists event_types (
  id serial primary key,
  name text not null unique
);

create table if not exists locations (
  id serial primary key,
  place text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  unique (place, latitude, longitude)
);

create table if not exists disaster_events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type_id integer not null references event_types(id),
  location_id integer not null references locations(id),
  magnitude double precision check (magnitude >= 0),
  severity text check (severity in ('Low', 'Medium', 'High')),
  event_time timestamp not null,
  source_type text not null check (source_type in ('external', 'manual')),
  is_deleted boolean not null default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamp not null default now()
);

-- Trigger 1: keep updated_at authoritative in the database so every writer
-- (backend CRUD, scripts, or SQL editor changes) gets consistent timestamps.
create or replace function set_disaster_event_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger 2: make severity derive from magnitude at the database layer.
-- This avoids drift between backend code paths and keeps INSERT/UPDATE behavior
-- identical even if rows are changed outside the Express API.
create or replace function set_disaster_event_severity()
returns trigger
language plpgsql
as $$
begin
  if new.magnitude is null or new.magnitude < 3 then
    new.severity = 'Low';
  elsif new.magnitude <= 6 then
    new.severity = 'Medium';
  else
    new.severity = 'High';
  end if;

  return new;
end;
$$;

-- Trigger 3: block hard deletes for external rows.
-- The project treats third-party data as read-only, so the database rejects any
-- accidental DELETE even if someone bypasses the application layer.
create or replace function prevent_external_event_delete()
returns trigger
language plpgsql
as $$
begin
  if old.source_type = 'external' then
    raise exception 'External disaster events are read-only and cannot be deleted.'
      using errcode = '42501';
  end if;

  return old;
end;
$$;

drop trigger if exists trg_disaster_events_updated_at on disaster_events;
drop trigger if exists trg_disaster_events_set_severity on disaster_events;
drop trigger if exists trg_disaster_events_prevent_external_delete on disaster_events;

create trigger trg_disaster_events_updated_at
before update on disaster_events
for each row
execute function set_disaster_event_updated_at();

create trigger trg_disaster_events_set_severity
before insert or update on disaster_events
for each row
execute function set_disaster_event_severity();

create trigger trg_disaster_events_prevent_external_delete
before delete on disaster_events
for each row
execute function prevent_external_event_delete();

create index if not exists idx_disaster_events_event_time on disaster_events(event_time);
create index if not exists idx_disaster_events_event_type_id on disaster_events(event_type_id);
create index if not exists idx_disaster_events_source_type on disaster_events(source_type);
create index if not exists idx_admin_users_username on admin_users(username);
create index if not exists idx_admin_users_email on admin_users(email);

insert into event_types (name)
values ('earthquake'), ('wildfire'), ('flood'), ('conflict')
on conflict (name) do nothing;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'disaster_events_legacy'
  ) then
    insert into event_types (name)
    select distinct lower(trim(type))
    from disaster_events_legacy
    where trim(coalesce(type, '')) <> ''
    on conflict (name) do nothing;

    insert into locations (place, latitude, longitude)
    select distinct
      coalesce(nullif(trim(place), ''), 'Unknown'),
      latitude,
      longitude
    from disaster_events_legacy
    where latitude between -90 and 90
      and longitude between -180 and 180
    on conflict (place, latitude, longitude) do nothing;

    insert into disaster_events (
      id,
      event_id,
      event_type_id,
      location_id,
      magnitude,
      severity,
      event_time,
      source_type,
      is_deleted,
      created_at,
      updated_at
    )
    select
      coalesce(dl.id, gen_random_uuid()),
      dl.event_id,
      et.id,
      l.id,
      greatest(coalesce(dl.magnitude, 0), 0),
      case
        when coalesce(dl.magnitude, 0) > 6 then 'High'
        when coalesce(dl.magnitude, 0) >= 3 then 'Medium'
        else 'Low'
      end,
      coalesce(dl.event_time, now()),
      case
        when lower(coalesce(dl.event_id, '')) like 'manual_%' then 'manual'
        else 'external'
      end,
      false,
      coalesce(dl.created_at, now()),
      coalesce(dl.created_at, now())
    from disaster_events_legacy dl
    join event_types et
      on et.name = lower(trim(coalesce(dl.type, 'earthquake')))
    join locations l
      on l.place = coalesce(nullif(trim(dl.place), ''), 'Unknown')
     and l.latitude = dl.latitude
     and l.longitude = dl.longitude
    where dl.event_id is not null
      and dl.latitude between -90 and 90
      and dl.longitude between -180 and 180
    on conflict (event_id) do nothing;
  end if;
end $$;
