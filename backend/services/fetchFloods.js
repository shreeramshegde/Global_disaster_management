import axios from "axios";
import { isSupabaseConfigured, supabase } from "../config/supabase.js";

const OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const DEFAULT_FLOOD_LOCATIONS = [
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Houston", lat: 29.7604, lon: -95.3698 },
  { name: "Jakarta", lat: -6.2088, lon: 106.8456 },
  { name: "Manila", lat: 14.5995, lon: 120.9842 }
];

const getFloodLocations = () => {
  if (!process.env.FLOOD_LOCATIONS) return DEFAULT_FLOOD_LOCATIONS;

  return process.env.FLOOD_LOCATIONS.split(";")
    .map((item) => {
      const [name, lat, lon] = item.split(",").map((value) => value.trim());
      return { name, lat: Number(lat), lon: Number(lon) };
    })
    .filter((location) => location.name && Number.isFinite(location.lat) && Number.isFinite(location.lon));
};

const rainAmount = (forecast) => Number(forecast.rain?.["3h"] || forecast.rain?.["1h"] || 0);

const getSeverity = (rainfall, humidity, continuousRainWindows) => {
  if (rainfall > 50 || (rainfall >= 35 && humidity >= 85) || continuousRainWindows >= 4) return "High";
  if (rainfall >= 20 || (rainfall >= 12 && humidity >= 80) || continuousRainWindows >= 3) return "Medium";
  return "Low";
};

const cleanForecastItem = (forecast, location, continuousRainWindows) => {
  const rainfall = rainAmount(forecast);
  const humidity = Number(forecast.main?.humidity || 0);
  const severity = getSeverity(rainfall, humidity, continuousRainWindows);
  const time = forecast.dt_txt ? new Date(`${forecast.dt_txt}Z`) : new Date(Number(forecast.dt) * 1000);
  const roundedLat = location.lat.toFixed(3);
  const roundedLon = location.lon.toFixed(3);
  const compactTime = time.toISOString().replace(/[-:]/g, "").slice(0, 13);

  return {
    event_id: `flood-${location.name.toLowerCase().replace(/\s+/g, "-")}-${roundedLat}-${roundedLon}-${compactTime}`,
    type: "flood",
    magnitude: Number(rainfall.toFixed(2)),
    severity,
    place: location.name,
    latitude: location.lat,
    longitude: location.lon,
    event_time: time.toISOString()
  };
};

const fetchForecastForLocation = async (location, apiKey) => {
  const { data } = await axios.get(OPENWEATHER_FORECAST_URL, {
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: apiKey,
      units: "metric"
    },
    timeout: 20000
  });

  if (!Array.isArray(data?.list)) {
    throw new Error(`OpenWeather forecast response was invalid for ${location.name}.`);
  }

  const cityName = data.city?.name || location.name;
  let continuousRainWindows = 0;

  return data.list
    .map((forecast) => {
      const rainfall = rainAmount(forecast);
      continuousRainWindows = rainfall > 0 ? continuousRainWindows + 1 : 0;
      return cleanForecastItem(forecast, { ...location, name: cityName }, continuousRainWindows);
    })
    .filter((event) => event.magnitude > 0 || event.severity !== "Low");
};

export const fetchAndCleanFloods = async () => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_openweather_key_here") {
    throw new Error("OPENWEATHER_API_KEY is not configured in backend/.env.");
  }

  const settled = await Promise.allSettled(
    getFloodLocations().map((location) => fetchForecastForLocation(location, apiKey))
  );

  const errors = settled
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason.message);

  if (errors.length === settled.length) {
    throw new Error(`OpenWeather flood fetch failed: ${errors.join("; ")}`);
  }

  const events = settled
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value)
    .filter((event) => (
      event.event_id &&
      Number.isFinite(event.magnitude) &&
      Number.isFinite(event.latitude) &&
      Number.isFinite(event.longitude) &&
      event.event_time
    ));

  return Array.from(new Map(events.map((event) => [event.event_id, event])).values());
};

export const upsertFloods = async (events) => {
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
    throw new Error(`Supabase flood upsert failed: ${error.message}`);
  }

  return { upserted: data?.length || events.length, events: data || [] };
};

export const syncFloods = async () => {
  const events = await fetchAndCleanFloods();
  return upsertFloods(events);
};
