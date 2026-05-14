import axios from "axios";
import { upsertNormalizedEvents } from "./eventStore.js";

const OPENWEATHER_CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
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

const rainAmount = (weather) => Number(weather.rain?.["1h"] || weather.rain?.["3h"] || 0);

const getSeverity = (rainfall, humidity, continuousRainWindows) => {
  if (rainfall > 50 || (rainfall >= 35 && humidity >= 85) || continuousRainWindows >= 4) return "High";
  if (rainfall >= 20 || (rainfall >= 12 && humidity >= 80) || continuousRainWindows >= 3) return "Medium";
  return "Low";
};

const cleanWeatherItem = (weather, location) => {
  const rainfall = rainAmount(weather);
  const humidity = Number(weather.main?.humidity || 0);
  const severity = getSeverity(rainfall, humidity, rainfall > 0 ? 1 : 0);
  const time = weather.dt ? new Date(Number(weather.dt) * 1000) : new Date();
  const roundedLat = location.lat.toFixed(3);
  const roundedLon = location.lon.toFixed(3);
  const compactTime = time.toISOString().replace(/[-:]/g, "").slice(0, 13);

  return {
    event_id: `flood-${location.name.toLowerCase().replace(/\s+/g, "-")}-${roundedLat}-${roundedLon}-${compactTime}`,
    eventType: "flood",
    magnitude: Number(rainfall.toFixed(2)),
    severity,
    place: location.name,
    latitude: location.lat,
    longitude: location.lon,
    event_time: time.toISOString()
  };
};

const fetchCurrentWeatherForLocation = async (location, apiKey) => {
  const { data } = await axios.get(OPENWEATHER_CURRENT_URL, {
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: apiKey,
      units: "metric"
    },
    timeout: 20000
  });

  if (!data || !data.main || !data.coord) {
    throw new Error(`OpenWeather current weather response was invalid for ${location.name}.`);
  }

  const cityName = data.name || location.name;
  const event = cleanWeatherItem(data, { ...location, name: cityName });
  return event.magnitude > 0 || event.severity !== "Low" ? [event] : [];
};

export const fetchAndCleanFloods = async () => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_openweather_key_here") {
    throw new Error("OPENWEATHER_API_KEY is not configured in backend/.env.");
  }

  const settled = await Promise.allSettled(
    getFloodLocations().map((location) => fetchCurrentWeatherForLocation(location, apiKey))
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
  return upsertNormalizedEvents(events, "external");
};

export const syncFloods = async () => {
  const events = await fetchAndCleanFloods();
  return upsertFloods(events);
};
