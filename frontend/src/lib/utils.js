import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(value) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function severityForMagnitude(magnitude) {
  if (magnitude > 6) return "High";
  if (magnitude >= 3) return "Medium";
  return "Low";
}

export function severityForEvent(event) {
  const explicitSeverity = String(event?.severity || "");
  if (explicitSeverity === "Low" || explicitSeverity === "Medium" || explicitSeverity === "High") {
    return explicitSeverity;
  }

  return severityForMagnitude(Number(event?.magnitude));
}

export function colorForMagnitude(magnitude) {
  if (magnitude > 6) return "#ef4444";
  if (magnitude >= 3) return "#f97316";
  return "#fde047";
}

export function colorForEvent(event) {
  const severity = severityForEvent(event);

  if (event?.type === "conflict") {
    if (severity === "High") return "#b91c1c";
    if (severity === "Medium") return "#dc2626";
    return "#f87171";
  }

  if (event?.type === "wildfire") {
    if (severity === "High") return "#fb923c";
    if (severity === "Medium") return "#f59e0b";
    return "#fde047";
  }

  if (event?.type === "flood") {
    if (severity === "High") return "#38bdf8";
    if (severity === "Medium") return "#2563eb";
    return "#93c5fd";
  }

  if (severity === "High") return "#ff2d55";
  if (severity === "Medium") return "#f97316";
  return "#fde047";
}

export function metricLabelForType(type) {
  if (type === "wildfire") return "Brightness";
  if (type === "flood") return "Rainfall";
  if (type === "conflict") return "Fatalities";
  if (type === "all") return "Value";
  return "Magnitude";
}

export function eventTypeLabel(type) {
  if (type === "wildfire") return "Wildfire";
  if (type === "flood") return "Flood";
  if (type === "conflict") return "Conflict";
  if (type === "earthquake") return "Earthquake";
  return "All Events";
}

export function sourceBadgeLabel(sourceType) {
  return sourceType === "manual" ? "manual" : "external";
}
