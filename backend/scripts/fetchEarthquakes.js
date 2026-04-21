import dotenv from "dotenv";
import { syncEarthquakes } from "../services/earthquakeService.js";

dotenv.config();

try {
  const result = await syncEarthquakes();
  console.log(`Synced ${result.upserted} earthquake events.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
