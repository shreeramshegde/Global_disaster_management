import dotenv from "dotenv";
import { syncWildfires } from "../services/fetchWildfires.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

try {
  const result = await syncWildfires();
  console.log(`Synced ${result.upserted} wildfire events.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
