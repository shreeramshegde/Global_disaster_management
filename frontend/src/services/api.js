import { getAdminToken } from "../lib/adminSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const sampleEvents = [
  {
    id: "sample-1",
    event_id: "sample-1",
    type: "earthquake",
    magnitude: 4.9,
    severity: "Medium",
    place: "South of Alaska",
    latitude: 54.823,
    longitude: -159.207,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-2",
    event_id: "sample-2",
    type: "earthquake",
    magnitude: 3.2,
    severity: "Low",
    place: "Central California",
    latitude: 36.778,
    longitude: -119.417,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-3",
    event_id: "sample-3",
    type: "earthquake",
    magnitude: 5.4,
    severity: "High",
    place: "Near the coast of Japan",
    latitude: 38.268,
    longitude: 142.533,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-fire-1",
    event_id: "sample-fire-1",
    type: "wildfire",
    magnitude: 342.6,
    severity: "Medium",
    place: "Unknown",
    latitude: 39.1,
    longitude: -121.3,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-fire-2",
    event_id: "sample-fire-2",
    type: "wildfire",
    magnitude: 366.2,
    severity: "High",
    place: "Unknown",
    latitude: -15.6,
    longitude: 132.4,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-flood-1",
    event_id: "sample-flood-1",
    type: "flood",
    magnitude: 58.4,
    severity: "High",
    place: "Jackson County, Missouri",
    latitude: 39.02,
    longitude: -94.36,
    event_time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-flood-2",
    event_id: "sample-flood-2",
    type: "flood",
    magnitude: 27.8,
    severity: "Medium",
    place: "Harris County, Texas",
    latitude: 29.76,
    longitude: -95.36,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-conflict-1",
    event_id: "sample-conflict-1",
    type: "conflict",
    magnitude: 12,
    severity: "Medium",
    place: "Sudan",
    latitude: 15.5007,
    longitude: 32.5599,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-conflict-2",
    event_id: "sample-conflict-2",
    type: "conflict",
    magnitude: 27,
    severity: "High",
    place: "Ukraine",
    latitude: 48.3794,
    longitude: 31.1656,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    source_type: "external",
    updated_at: new Date().toISOString()
  }
];

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, value);
  });
  return params.toString();
};

export async function fetchEvents(filters) {
  const normalizedFilters = filters?.type === "all" ? { ...filters, type: "" } : filters;
  const query = normalizedFilters ? buildQuery(normalizedFilters) : "";
  const path = query ? `/events?${query}` : "/events";

  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `Backend responded with ${response.status}`);
    }
    const data = await response.json();
    return { events: data.events || [], isFallback: false };
  } catch (error) {
    console.warn("Using sample events because the backend is unavailable:", error.message);
    return { events: filterSampleEvents(sampleEvents, filters), isFallback: true };
  }
}

export async function fetchEventTypes() {
  const response = await fetch(`${API_BASE_URL}/events/meta`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Backend responded with ${response.status}`);
  }

  const data = await response.json();
  return data.eventTypes || [];
}

async function sendEventRequest(path, method, body) {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Backend responded with ${response.status}`);
  }

  return data;
}

export function createEvent(payload) {
  return sendEventRequest("/events", "POST", payload);
}

export function updateEvent(id, payload) {
  return sendEventRequest(`/events/${id}`, "PUT", payload);
}

export function deleteEvent(id) {
  return sendEventRequest(`/events/${id}`, "DELETE");
}

export async function adminRegister(payload) {
  return sendAuthRequest("/admin/register", payload);
}

export async function adminLogin(payload) {
  return sendAuthRequest("/admin/login", payload);
}

async function sendAuthRequest(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Backend responded with ${response.status}`);
  }

  return data;
}

function filterSampleEvents(events, filters = {}) {
  return events.filter((event) => {
    if (filters.type && filters.type !== "all" && event.type !== filters.type) return false;
    if (filters.severity && event.severity !== filters.severity) return false;
    if (filters.sourceType && filters.sourceType !== "all" && event.source_type !== filters.sourceType) return false;
    if (filters.minMagnitude && Number(event.magnitude) < Number(filters.minMagnitude)) return false;
    if (filters.maxMagnitude && Number(event.magnitude) > Number(filters.maxMagnitude)) return false;
    if (filters.search && !event.place.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.startDate && new Date(event.event_time) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(event.event_time) > new Date(`${filters.endDate}T23:59:59`)) return false;
    return true;
  });
}
