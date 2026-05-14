import crypto from "crypto";
import { deriveSeverity } from "./eventValidation.js";

const EVENT_TYPES = ["earthquake", "wildfire", "flood", "conflict"];
const REGIONS = [
  { place: "San Francisco, USA", latitude: 37.7749, longitude: -122.4194 },
  { place: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
  { place: "Santiago, Chile", latitude: -33.4489, longitude: -70.6693 },
  { place: "Jakarta, Indonesia", latitude: -6.2088, longitude: 106.8456 },
  { place: "Nairobi, Kenya", latitude: -1.2921, longitude: 36.8219 },
  { place: "Athens, Greece", latitude: 37.9838, longitude: 23.7275 },
  { place: "Istanbul, Turkey", latitude: 41.0082, longitude: 28.9784 },
  { place: "Manila, Philippines", latitude: 14.5995, longitude: 120.9842 },
  { place: "Khartoum, Sudan", latitude: 15.5007, longitude: 32.5599 },
  { place: "Kyiv, Ukraine", latitude: 50.4501, longitude: 30.5234 },
  { place: "Houston, USA", latitude: 29.7604, longitude: -95.3698 },
  { place: "Brisbane, Australia", latitude: -27.4698, longitude: 153.0251 }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumber(min, max, precision = 1) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
}

function jitter(base, spread, limitMin, limitMax, precision = 4) {
  const value = base + (Math.random() * spread * 2 - spread);
  return Number(Math.min(limitMax, Math.max(limitMin, value)).toFixed(precision));
}

function magnitudeForType(type) {
  if (type === "earthquake") return randomNumber(2.6, 7.8, 1);
  if (type === "wildfire") return randomNumber(295, 410, 1);
  if (type === "flood") return randomNumber(8, 75, 1);
  return randomNumber(1, 36, 0);
}

function eventTimeWithinDays(days = 90) {
  const now = Date.now();
  const offset = randomInt(0, days * 24 * 60 * 60 * 1000);
  return new Date(now - offset).toISOString();
}

export function generateDummyEvents(count = randomInt(50, 100)) {
  return Array.from({ length: count }, (_, index) => {
    const type = EVENT_TYPES[index % EVENT_TYPES.length];
    const baseRegion = REGIONS[index % REGIONS.length];
    const latitude = jitter(baseRegion.latitude, 2.75, -90, 90);
    const longitude = jitter(baseRegion.longitude, 3.25, -180, 180);
    const magnitude = magnitudeForType(type);
    const severity = deriveSeverity(type, magnitude);
    const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 10);

    return {
      eventId: `manual_${suffix}`,
      eventType: type,
      place: baseRegion.place,
      latitude,
      longitude,
      magnitude,
      severity,
      eventTime: eventTimeWithinDays()
    };
  });
}
