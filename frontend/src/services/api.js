const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const sampleEvents = [
  {
    event_id: "sample-1",
    type: "earthquake",
    magnitude: 4.9,
    place: "South of Alaska",
    latitude: 54.823,
    longitude: -159.207,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    event_id: "sample-2",
    type: "earthquake",
    magnitude: 3.2,
    place: "Central California",
    latitude: 36.778,
    longitude: -119.417,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString()
  },
  {
    event_id: "sample-3",
    type: "earthquake",
    magnitude: 5.4,
    place: "Near the coast of Japan",
    latitude: 38.268,
    longitude: 142.533,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString()
  },
  {
    event_id: "sample-fire-1",
    type: "wildfire",
    magnitude: 342.6,
    place: "Unknown",
    latitude: 39.1,
    longitude: -121.3,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    event_id: "sample-fire-2",
    type: "wildfire",
    magnitude: 366.2,
    place: "Unknown",
    latitude: -15.6,
    longitude: 132.4,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString()
  },
  {
    event_id: "sample-flood-1",
    type: "flood",
    magnitude: 58.4,
    severity: "High",
    place: "Jackson County, Missouri",
    latitude: 39.02,
    longitude: -94.36,
    event_time: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    event_id: "sample-flood-2",
    type: "flood",
    magnitude: 27.8,
    severity: "Medium",
    place: "Harris County, Texas",
    latitude: 29.76,
    longitude: -95.36,
    event_time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
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
  const path = normalizedFilters ? `/events/filter?${query}` : "/events";

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

function filterSampleEvents(events, filters = {}) {
  return events.filter((event) => {
    if (filters.type && filters.type !== "all" && event.type !== filters.type) return false;
    if (filters.minMagnitude && Number(event.magnitude) < Number(filters.minMagnitude)) return false;
    if (filters.maxMagnitude && Number(event.magnitude) > Number(filters.maxMagnitude)) return false;
    if (filters.search && !event.place.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.startDate && new Date(event.event_time) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(event.event_time) > new Date(`${filters.endDate}T23:59:59`)) return false;
    return true;
  });
}
