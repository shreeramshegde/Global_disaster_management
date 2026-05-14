const VALID_SEVERITIES = ["Low", "Medium", "High"];
const VALID_SOURCE_TYPES = ["external", "manual"];

export function normalizeEventTypeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function normalizeSeverity(value, fallbackMagnitude, eventType) {
  const severity = String(value || "").trim();
  if (VALID_SEVERITIES.includes(severity)) return severity;
  return deriveSeverity(eventType, fallbackMagnitude);
}

export function deriveSeverity(eventType, magnitude) {
  const value = Number(magnitude);

  if (!Number.isFinite(value) || value < 0) return "Low";
  if (value > 6) return "High";
  if (value >= 3) return "Medium";
  return "Low";
}

export function validateEventPayload(payload, { partial = false } = {}) {
  const errors = [];
  const requiredFields = [
    "eventType",
    "place",
    "latitude",
    "longitude",
    "magnitude",
    "eventTime"
  ];

  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
        errors.push(`${field} is required.`);
      }
    });
  }

  if (payload.latitude !== undefined) {
    const latitude = Number(payload.latitude);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.push("latitude must be between -90 and 90.");
    }
  }

  if (payload.longitude !== undefined) {
    const longitude = Number(payload.longitude);
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errors.push("longitude must be between -180 and 180.");
    }
  }

  if (payload.magnitude !== undefined) {
    const magnitude = Number(payload.magnitude);
    if (!Number.isFinite(magnitude) || magnitude < 0) {
      errors.push("magnitude must be a number greater than or equal to 0.");
    }
  }

  if (payload.eventTime !== undefined) {
    const timestamp = new Date(payload.eventTime);
    if (Number.isNaN(timestamp.getTime())) {
      errors.push("eventTime must be a valid date.");
    }
  }

  if (payload.severity !== undefined && payload.severity !== null && payload.severity !== "") {
    if (!VALID_SEVERITIES.includes(String(payload.severity).trim())) {
      errors.push("severity must be Low, Medium, or High.");
    }
  }

  if (payload.sourceType !== undefined) {
    if (!VALID_SOURCE_TYPES.includes(payload.sourceType)) {
      errors.push("sourceType must be external or manual.");
    }
  }

  return errors;
}

export function normalizeEventPayload(payload, { sourceType = "manual" } = {}) {
  const eventType = normalizeEventTypeName(payload.eventType || payload.type);
  const magnitude = Number(payload.magnitude);

  return {
    eventId: String(payload.eventId || payload.event_id || "").trim(),
    eventType,
    place: String(payload.place || "").trim(),
    latitude: Number(payload.latitude),
    longitude: Number(payload.longitude),
    magnitude,
    severity: normalizeSeverity(payload.severity, magnitude, eventType),
    eventTime: new Date(payload.eventTime || payload.event_time).toISOString(),
    sourceType
  };
}
