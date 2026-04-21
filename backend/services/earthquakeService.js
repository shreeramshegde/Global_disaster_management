import axios from "axios";
import { isSupabaseConfigured, supabase } from "../config/supabase.js";

const USGS_ALL_DAY_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export const cleanEarthquakeFeature = (feature) => {
  const [longitude, latitude] = feature.geometry?.coordinates || [];
  const properties = feature.properties || {};

  return {
    event_id: feature.id,
    type: properties.type || "earthquake",
    magnitude: Number(properties.mag),
    place: properties.place || "Unknown location",
    latitude: Number(latitude),
    longitude: Number(longitude),
    event_time: properties.time ? new Date(properties.time).toISOString() : null
  };
};

export const fetchAndCleanEarthquakes = async () => {
  const { data } = await axios.get(USGS_ALL_DAY_URL, { timeout: 15000 });

  if (!Array.isArray(data?.features)) {
    throw new Error("USGS response did not include a features array.");
  }

  return data.features
    .filter((feature) => feature?.properties?.type === "earthquake")
    .map(cleanEarthquakeFeature)
    .filter((event) => (
      event.event_id &&
      Number.isFinite(event.magnitude) &&
      event.magnitude > 2.5 &&
      Number.isFinite(event.latitude) &&
      Number.isFinite(event.longitude) &&
      event.event_time
    ));
};

export const upsertEarthquakes = async (events) => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env.");
  }

  if (!events.length) {
    return { upserted: 0, events: [] };
  }

  const { data, error } = await supabase
    .from("disaster_events")
    .upsert(events, { onConflict: "event_id" })
    .select();

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }

  return { upserted: data?.length || events.length, events: data || [] };
};

export const syncEarthquakes = async () => {
  const events = await fetchAndCleanEarthquakes();
  return upsertEarthquakes(events);
};

export const getAllEvents = async ({ type } = {}) => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env.");
  }

  let query = supabase
    .from("disaster_events")
    .select("*")
    .order("event_time", { ascending: false });

  if (type && type !== "all") query = query.eq("type", type);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data || [];
};

export const getFilteredEvents = async ({ type, startDate, endDate, minMagnitude, maxMagnitude, search }) => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env.");
  }

  let query = supabase
    .from("disaster_events")
    .select("*")
    .order("event_time", { ascending: false });

  if (type && type !== "all") query = query.eq("type", type);
  if (startDate) query = query.gte("event_time", startDate);
  if (endDate) query = query.lte("event_time", endDate);
  if (minMagnitude) query = query.gte("magnitude", Number(minMagnitude));
  if (maxMagnitude) query = query.lte("magnitude", Number(maxMagnitude));
  if (search) query = query.ilike("place", `%${search}%`);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to filter events: ${error.message}`);
  }

  return data || [];
};
