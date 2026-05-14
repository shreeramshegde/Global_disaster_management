import axios from "axios";
import { listEvents, upsertNormalizedEvents } from "./eventStore.js";

const USGS_ALL_DAY_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export const cleanEarthquakeFeature = (feature) => {
  const [longitude, latitude] = feature.geometry?.coordinates || [];
  const properties = feature.properties || {};

  return {
    event_id: feature.id,
    eventType: properties.type || "earthquake",
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
  return upsertNormalizedEvents(events, "external");
};

export const syncEarthquakes = async () => {
  const events = await fetchAndCleanEarthquakes();
  return upsertEarthquakes(events);
};

export const getAllEvents = async ({ type } = {}) => {
  return listEvents({ type });
};

export const getFilteredEvents = async (filters = {}) => {
  return listEvents(filters);
};
