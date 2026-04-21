import express from "express";
import { getAllEvents, getFilteredEvents, syncEarthquakes } from "../services/earthquakeService.js";
import { syncFloods } from "../services/fetchFloods.js";
import { syncWildfires } from "../services/fetchWildfires.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await getAllEvents(req.query);
    res.json({ count: events.length, events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const events = await getFilteredEvents(req.query);
    res.json({ count: events.length, events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sync", async (_req, res) => {
  try {
    const [earthquakeResult, wildfireResult, floodResult] = await Promise.allSettled([
      syncEarthquakes(),
      syncWildfires(),
      syncFloods()
    ]);
    res.json({
      message: "Disaster data sync completed.",
      earthquake: earthquakeResult.status === "fulfilled" ? earthquakeResult.value : { error: earthquakeResult.reason.message },
      wildfire: wildfireResult.status === "fulfilled" ? wildfireResult.value : { error: wildfireResult.reason.message },
      flood: floodResult.status === "fulfilled" ? floodResult.value : { error: floodResult.reason.message }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sync", async (_req, res) => {
  try {
    const [earthquakeResult, wildfireResult, floodResult] = await Promise.allSettled([
      syncEarthquakes(),
      syncWildfires(),
      syncFloods()
    ]);
    res.json({
      message: "Disaster data sync completed.",
      earthquake: earthquakeResult.status === "fulfilled" ? earthquakeResult.value : { error: earthquakeResult.reason.message },
      wildfire: wildfireResult.status === "fulfilled" ? wildfireResult.value : { error: wildfireResult.reason.message },
      flood: floodResult.status === "fulfilled" ? floodResult.value : { error: floodResult.reason.message }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sync/earthquakes", async (_req, res) => {
  try {
    const result = await syncEarthquakes();
    res.json({ message: "Earthquake data synced successfully.", ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sync/wildfires", async (_req, res) => {
  try {
    const result = await syncWildfires();
    res.json({ message: "Wildfire data synced successfully.", ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sync/floods", async (_req, res) => {
  try {
    const result = await syncFloods();
    res.json({ message: "Flood data synced successfully.", ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
