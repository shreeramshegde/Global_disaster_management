import express from "express";
import { requireAdminAuth } from "../middleware/authMiddleware.js";
import { getAllEvents, getFilteredEvents, syncEarthquakes } from "../services/earthquakeService.js";
import { syncFloods } from "../services/fetchFloods.js";
import { syncWildfires } from "../services/fetchWildfires.js";
import {
  createManualEvent,
  getEventTypes,
  softDeleteManualEvent,
  updateManualEvent
} from "../services/eventStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filters = Object.keys(req.query).length ? req.query : {};
    const events = Object.keys(filters).length ? await getFilteredEvents(filters) : await getAllEvents(filters);
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

router.get("/meta", async (_req, res) => {
  try {
    const eventTypes = await getEventTypes();
    res.json({ eventTypes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", requireAdminAuth, async (req, res) => {
  try {
    const event = await createManualEvent(req.body);
    res.status(201).json({ message: "Manual event created successfully.", event });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const event = await updateManualEvent(req.params.id, req.body);
    res.json({ message: "Manual event updated successfully.", event });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const result = await softDeleteManualEvent(req.params.id);
    res.json({ message: "Manual event deleted successfully.", ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
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
