import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cron from "node-cron";
import adminRouter from "./routes/admin.js";
import eventsRouter from "./routes/events.js";
import { syncEarthquakes } from "./services/earthquakeService.js";
import { syncFloods } from "./services/fetchFloods.js";
import { syncWildfires } from "./services/fetchWildfires.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    app: "GLOBAL DISASTER MANAGEMENT SYSTEM",
    status: "running",
    endpoints: [
      "/events",
      "/events?type=earthquake",
      "/events?sourceType=manual",
      "/events/meta",
      "/events/filter",
      "/events/sync",
      "/admin/register",
      "/admin/login"
    ]
  });
});

app.use("/admin", adminRouter);
app.use("/events", eventsRouter);

cron.schedule("*/10 * * * *", async () => {
  const [earthquakeResult, wildfireResult, floodResult] = await Promise.allSettled([
    syncEarthquakes(),
    syncWildfires(),
    syncFloods()
  ]);

  if (earthquakeResult.status === "fulfilled") {
    console.log(`[cron] Synced ${earthquakeResult.value.upserted} earthquake events.`);
  } else {
    console.error("[cron] Earthquake sync failed:", earthquakeResult.reason.message);
  }

  if (wildfireResult.status === "fulfilled") {
    console.log(`[cron] Synced ${wildfireResult.value.upserted} wildfire events.`);
  } else {
    console.error("[cron] Wildfire sync skipped:", wildfireResult.reason.message);
  }

  if (floodResult.status === "fulfilled") {
    console.log(`[cron] Synced ${floodResult.value.upserted} flood events.`);
  } else {
    console.error("[cron] Flood sync skipped:", floodResult.reason.message);
  }
});

const server = app.listen(PORT, async () => {
  console.log(`Base1 backend running on http://localhost:${PORT}`);
  const [earthquakeResult, wildfireResult, floodResult] = await Promise.allSettled([
    syncEarthquakes(),
    syncWildfires(),
    syncFloods()
  ]);

  if (earthquakeResult.status === "fulfilled") {
    console.log(`Initial earthquake sync complete: ${earthquakeResult.value.upserted} events stored.`);
  } else {
    console.error("Initial earthquake sync skipped:", earthquakeResult.reason.message);
  }

  if (wildfireResult.status === "fulfilled") {
    console.log(`Initial wildfire sync complete: ${wildfireResult.value.upserted} events stored.`);
  } else {
    console.error("Initial wildfire sync skipped:", wildfireResult.reason.message);
  }

  if (floodResult.status === "fulfilled") {
    console.log(`Initial flood sync complete: ${floodResult.value.upserted} events stored.`);
  } else {
    console.error("Initial flood sync skipped:", floodResult.reason.message);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the old backend process or change PORT in backend/.env.`);
    process.exit(1);
  }

  console.error("Backend server failed:", error.message);
  process.exit(1);
});
