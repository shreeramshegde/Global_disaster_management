import dotenv from "dotenv";
import { syncFloods } from "../services/fetchFloods.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

try {
  const result = await syncFloods();
  console.log(`Synced ${result.upserted} flood events.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
