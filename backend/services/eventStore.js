import crypto from "crypto";
import { isSupabaseConfigured, supabase } from "../config/supabase.js";
import {
  normalizeEventPayload,
  normalizeEventTypeName,
  validateEventPayload
} from "./eventValidation.js";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Add backend credentials in backend/.env before running the API.");
  }
}

function locationKey({ place, latitude, longitude }) {
  return `${String(place).trim().toLowerCase()}|${Number(latitude).toFixed(4)}|${Number(longitude).toFixed(4)}`;
}

function flattenEventRow(row) {
  const eventType = Array.isArray(row.event_types) ? row.event_types[0] : row.event_types;
  const location = Array.isArray(row.locations) ? row.locations[0] : row.locations;

  return {
    id: row.id,
    event_id: row.event_id,
    type: eventType?.name || null,
    event_type: eventType?.name || null,
    magnitude: row.magnitude,
    severity: row.severity,
    place: location?.place || null,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    event_time: row.event_time,
    source_type: row.source_type,
    is_deleted: row.is_deleted,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

async function fetchEventTypeMap() {
  requireSupabase();

  const { data, error } = await supabase
    .from("event_types")
    .select("id, name");

  if (error) {
    throw new Error(`Failed to load event types: ${error.message}`);
  }

  return new Map((data || []).map((item) => [item.name, item.id]));
}

async function ensureEventTypes(eventTypeNames) {
  const uniqueNames = Array.from(
    new Set(eventTypeNames.map(normalizeEventTypeName).filter(Boolean))
  );

  if (!uniqueNames.length) {
    throw new Error("At least one valid event type is required.");
  }

  let eventTypeMap = await fetchEventTypeMap();
  const missingNames = uniqueNames.filter((name) => !eventTypeMap.has(name));

  if (missingNames.length) {
    const { error } = await supabase
      .from("event_types")
      .upsert(
        missingNames.map((name) => ({ name })),
        { onConflict: "name" }
      );

    if (error) {
      throw new Error(`Failed to create missing event types: ${error.message}`);
    }

    eventTypeMap = await fetchEventTypeMap();
  }

  return eventTypeMap;
}

async function ensureLocations(locations) {
  const uniqueLocations = Array.from(
    new Map(
      locations
        .filter((item) => item.place && Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
        .map((item) => [
          locationKey(item),
          {
            place: item.place,
            latitude: item.latitude,
            longitude: item.longitude
          }
        ])
    ).values()
  );

  if (!uniqueLocations.length) {
    throw new Error("At least one valid location is required.");
  }

  const { data, error } = await supabase
    .from("locations")
    .upsert(uniqueLocations, { onConflict: "place,latitude,longitude" })
    .select("id, place, latitude, longitude");

  if (error) {
    throw new Error(`Failed to upsert locations: ${error.message}`);
  }

  const returnedMap = new Map((data || []).map((item) => [locationKey(item), item.id]));
  const missingLocations = uniqueLocations.filter((location) => !returnedMap.has(locationKey(location)));

  if (!missingLocations.length) {
    return returnedMap;
  }

  const fallbackEntries = await Promise.all(
    missingLocations.map(async (location) => {
      const { data: match, error: matchError } = await supabase
        .from("locations")
        .select("id, place, latitude, longitude")
        .eq("place", location.place)
        .gte("latitude", location.latitude - 0.000001)
        .lte("latitude", location.latitude + 0.000001)
        .gte("longitude", location.longitude - 0.000001)
        .lte("longitude", location.longitude + 0.000001)
        .limit(1)
        .maybeSingle();

      if (matchError || !match) {
        throw new Error(`Failed to resolve location id for ${location.place}.`);
      }

      return [locationKey(location), match.id];
    })
  );

  return new Map([...returnedMap.entries(), ...fallbackEntries]);
}

async function fetchJoinedEvents(baseQuery) {
  const { data, error } = await baseQuery;

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return (data || []).map(flattenEventRow);
}

export async function getEventTypes() {
  const typeMap = await fetchEventTypeMap();
  return Array.from(typeMap.keys()).sort();
}

export async function listEvents(filters = {}) {
  requireSupabase();

  const {
    type,
    startDate,
    endDate,
    minMagnitude,
    maxMagnitude,
    severity,
    search,
    sourceType
  } = filters;

  const typeMap = type && type !== "all" ? await fetchEventTypeMap() : null;
  let query = supabase
    .from("disaster_events")
    .select(`
      id,
      event_id,
      magnitude,
      severity,
      event_time,
      source_type,
      is_deleted,
      created_at,
      updated_at,
      event_types:event_type_id ( name ),
      locations:location_id ( place, latitude, longitude )
    `)
    .eq("is_deleted", false)
    .order("event_time", { ascending: false });

  if (type && type !== "all") {
    const eventTypeId = typeMap?.get(normalizeEventTypeName(type));
    if (!eventTypeId) return [];
    query = query.eq("event_type_id", eventTypeId);
  }
  if (startDate) query = query.gte("event_time", startDate);
  if (endDate) {
    const normalizedEndDate = /^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ? `${endDate}T23:59:59.999Z`
      : endDate;
    query = query.lte("event_time", normalizedEndDate);
  }
  if (minMagnitude !== undefined && minMagnitude !== "") query = query.gte("magnitude", Number(minMagnitude));
  if (maxMagnitude !== undefined && maxMagnitude !== "") query = query.lte("magnitude", Number(maxMagnitude));
  if (severity) query = query.eq("severity", severity);
  if (sourceType && sourceType !== "all") query = query.eq("source_type", sourceType);

  const rows = await fetchJoinedEvents(query);

  if (!search) return rows;

  return rows.filter((event) => String(event.place || "").toLowerCase().includes(String(search).toLowerCase()));
}

export async function createManualEvent(payload) {
  requireSupabase();

  const errors = validateEventPayload(payload);
  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const normalized = normalizeEventPayload(payload, { sourceType: "manual" });
  const typeMap = await ensureEventTypes([normalized.eventType]);
  const locationMap = await ensureLocations([normalized]);
  const eventId = normalized.eventId || `manual_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

  const { data, error } = await supabase
    .from("disaster_events")
    .insert({
      event_id: eventId,
      event_type_id: typeMap.get(normalized.eventType),
      location_id: locationMap.get(locationKey(normalized)),
      magnitude: normalized.magnitude,
      // Severity is still passed for client compatibility, but the DB trigger remains
      // the final authority so inserts and updates stay consistent from any caller.
      severity: normalized.severity,
      event_time: normalized.eventTime,
      source_type: "manual"
    })
    .select(`
      id,
      event_id,
      magnitude,
      severity,
      event_time,
      source_type,
      is_deleted,
      created_at,
      updated_at,
      event_types:event_type_id ( name ),
      locations:location_id ( place, latitude, longitude )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create manual event: ${error.message}`);
  }

  return flattenEventRow(data);
}

export async function updateManualEvent(id, payload) {
  requireSupabase();

  const errors = validateEventPayload(payload);
  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.statusCode = 400;
    throw error;
  }

  const { data: existing, error: existingError } = await supabase
    .from("disaster_events")
    .select("id, source_type")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    const error = new Error("Event not found.");
    error.statusCode = 404;
    throw error;
  }

  if (existing.source_type !== "manual") {
    const error = new Error("External events are read-only and cannot be updated.");
    error.statusCode = 403;
    throw error;
  }

  const normalized = normalizeEventPayload(payload, { sourceType: "manual" });
  const typeMap = await ensureEventTypes([normalized.eventType]);
  const locationMap = await ensureLocations([normalized]);

  const { data, error } = await supabase
    .from("disaster_events")
    .update({
      event_type_id: typeMap.get(normalized.eventType),
      location_id: locationMap.get(locationKey(normalized)),
      magnitude: normalized.magnitude,
      severity: normalized.severity,
      event_time: normalized.eventTime
    })
    .eq("id", id)
    .eq("source_type", "manual")
    .select(`
      id,
      event_id,
      magnitude,
      severity,
      event_time,
      source_type,
      is_deleted,
      created_at,
      updated_at,
      event_types:event_type_id ( name ),
      locations:location_id ( place, latitude, longitude )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to update manual event: ${error.message}`);
  }

  return flattenEventRow(data);
}

export async function softDeleteManualEvent(id) {
  requireSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("disaster_events")
    .select("id, source_type")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    const error = new Error("Event not found.");
    error.statusCode = 404;
    throw error;
  }

  if (existing.source_type !== "manual") {
    const error = new Error("External events are read-only and cannot be deleted.");
    error.statusCode = 403;
    throw error;
  }

  const { error } = await supabase
    .from("disaster_events")
    .update({
      is_deleted: true
    })
    .eq("id", id)
    .eq("source_type", "manual");

  if (error) {
    throw new Error(`Failed to delete manual event: ${error.message}`);
  }

  return { id, deleted: true };
}

export async function upsertNormalizedEvents(events, sourceType = "external") {
  requireSupabase();

  if (!events.length) {
    return { upserted: 0, events: [] };
  }

  const normalizedEvents = events.map((event) => normalizeEventPayload(event, { sourceType }));
  const typeMap = await ensureEventTypes(normalizedEvents.map((event) => event.eventType));
  const locationMap = await ensureLocations(normalizedEvents);
  const rows = normalizedEvents.map((event) => ({
    event_id: event.eventId,
    event_type_id: typeMap.get(event.eventType),
    location_id: locationMap.get(locationKey(event)),
    magnitude: event.magnitude,
    severity: event.severity,
    event_time: event.eventTime,
    source_type: sourceType,
    is_deleted: false
  }));

  const { data, error } = await supabase
    .from("disaster_events")
    .upsert(rows, { onConflict: "event_id" })
    .select(`
      id,
      event_id,
      magnitude,
      severity,
      event_time,
      source_type,
      is_deleted,
      created_at,
      updated_at,
      event_types:event_type_id ( name ),
      locations:location_id ( place, latitude, longitude )
    `);

  if (error) {
    throw new Error(`Failed to upsert events: ${error.message}`);
  }

  return { upserted: data?.length || rows.length, events: (data || []).map(flattenEventRow) };
}
