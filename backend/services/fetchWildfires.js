import axios from "axios";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { upsertNormalizedEvents } from "./eventStore.js";

const FIRMS_SOURCE = process.env.NASA_FIRMS_SOURCE || "VIIRS_SNPP_NRT";
const FIRMS_DAYS = process.env.NASA_FIRMS_DAYS || "1";

const parseCsv = (csvText) => new Promise((resolve, reject) => {
  const rows = [];

  Readable.from([csvText])
    .pipe(csvParser())
    .on("data", (row) => rows.push(row))
    .on("end", () => resolve(rows))
    .on("error", reject);
});

const normalizeFireTime = (date, time) => {
  if (!date) return null;
  const paddedTime = String(time || "0000").padStart(4, "0");
  const hours = paddedTime.slice(0, 2);
  const minutes = paddedTime.slice(2, 4);
  return new Date(`${date}T${hours}:${minutes}:00Z`).toISOString();
};

const getBrightness = (row) => Number(row.brightness || row.bright_ti4 || row.bright_ti5 || row.frp);

const cleanWildfireRow = (row) => {
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  const brightness = getBrightness(row);
  const eventTime = normalizeFireTime(row.acq_date, row.acq_time);
  const eventId = `wildfire-${latitude.toFixed(4)}-${longitude.toFixed(4)}-${row.acq_date}-${String(row.acq_time || "0000").padStart(4, "0")}`;

  return {
    event_id: eventId,
    eventType: "wildfire",
    magnitude: brightness,
    place: row.country || row.country_id || "Unknown",
    latitude,
    longitude,
    event_time: eventTime
  };
};

export const fetchAndCleanWildfires = async () => {
  const mapKey = process.env.NASA_FIRMS_MAP_KEY;

  if (!mapKey || mapKey === "your_firms_map_key_here") {
    throw new Error("NASA_FIRMS_MAP_KEY is not configured in backend/.env.");
  }

  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${FIRMS_SOURCE}/world/${FIRMS_DAYS}`;
  const { data } = await axios.get(url, { timeout: 20000, responseType: "text" });
  const rows = await parseCsv(data);

  const events = rows
    .map(cleanWildfireRow)
    .filter((event) => (
      event.event_id &&
      Number.isFinite(event.magnitude) &&
      Number.isFinite(event.latitude) &&
      Number.isFinite(event.longitude) &&
      event.event_time
    ));

  return Array.from(new Map(events.map((event) => [event.event_id, event])).values());
};

export const upsertWildfires = async (events) => {
  return upsertNormalizedEvents(events, "external");
};

export const syncWildfires = async () => {
  const events = await fetchAndCleanWildfires();
  return upsertWildfires(events);
};
