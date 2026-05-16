import dotenv from "dotenv";
import { generateDummyEvents } from "../services/dummyEventGenerator.js";
import { upsertNormalizedEvents } from "../services/eventStore.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const requestedCount = Number(process.argv[2]);
const count = Number.isFinite(requestedCount) && requestedCount >= 50 && requestedCount <= 100
  ? requestedCount
  : undefined;

async function run() {
  const events = generateDummyEvents(count);
  const result = await upsertNormalizedEvents(
    events.map((event) => ({
      event_id: event.eventId,
      eventType: event.eventType,
      place: event.place,
      latitude: event.latitude,
      longitude: event.longitude,
      magnitude: event.magnitude,
      severity: event.severity,
      event_time: event.eventTime
    })),
    "manual"
  );

  console.log(`Seeded ${result.upserted} manual dummy events.`);
}

run().catch((error) => {
  console.error("Dummy seed failed:", error.message);
  process.exit(1);
});
