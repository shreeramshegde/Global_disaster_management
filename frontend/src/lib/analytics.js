import { severityForEvent } from "./utils";

export function getSeverityData(events) {
  const floodOnly = events.length > 0 && events.every((event) => event.type === "flood");
  const order = floodOnly
    ? ["Low", "Medium", "High"]
    : ["Low", "Medium", "High"];
  const counts = events.reduce((acc, event) => {
    const severity = severityForEvent(event);
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {});

  return order.map((name) => ({ name, value: counts[name] || 0 }));
}

export function getDailyTrendData(events) {
  const grouped = events.reduce((acc, event) => {
    const date = new Date(event.event_time).toISOString().slice(0, 10);
    acc[date] = acc[date] || { date, events: 0, magnitudeTotal: 0 };
    acc[date].events += 1;
    acc[date].magnitudeTotal += Number(event.magnitude) || 0;
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
      events: item.events,
      avgMagnitude: Number((item.magnitudeTotal / item.events).toFixed(2))
    }));
}

export function getTrendSummary(events) {
  const sorted = [...events].sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
  if (sorted.length < 2) {
    return {
      percent: 0,
      direction: "stable",
      text: "Not enough data to compare recent activity yet."
    };
  }

  const midpoint = Math.ceil(sorted.length / 2);
  const previous = sorted.slice(0, midpoint);
  const recent = sorted.slice(midpoint);
  const previousCount = previous.length || 1;
  const recentCount = recent.length;
  const percent = Math.round(((recentCount - previousCount) / previousCount) * 100);
  const direction = percent > 0 ? "increase" : percent < 0 ? "decrease" : "stable";

  return {
    percent,
    direction,
    text: direction === "stable"
      ? "0% change compared to the previous period"
      : `${percent > 0 ? "+" : ""}${percent}% ${direction} compared to the previous period`
  };
}

export function getAutoInsight(events) {
  if (!events.length) return "No disaster records are available for the selected filters.";

  const severityData = getSeverityData(events);
  const dominantSeverity = [...severityData].sort((a, b) => b.value - a.value)[0]?.name || "Low";
  const trend = getTrendSummary(events);
  const hasOnlyWildfires = events.every((event) => event.type === "wildfire");
  const hasOnlyFloods = events.every((event) => event.type === "flood");
  const subject = hasOnlyWildfires ? "Wildfire activity" : hasOnlyFloods ? "Flood risk" : "Disaster activity";

  if (trend.direction === "increase") {
    if (hasOnlyFloods) return `Increasing rainfall trend observed, with most forecast windows at ${dominantSeverity.toLowerCase()} flood risk.`;
    return `${subject} is increasing in the recent period, and most events are ${dominantSeverity.toLowerCase()} severity.`;
  }

  if (trend.direction === "decrease") {
    if (hasOnlyFloods) return `Rainfall risk is decreasing in the forecast period, with ${dominantSeverity.toLowerCase()} risk appearing most often.`;
    return `${subject} is decreasing in the recent period, with ${dominantSeverity.toLowerCase()} severity events appearing most often.`;
  }

  if (hasOnlyFloods && dominantSeverity === "High") {
    return "High rainfall detected, flood risk should be monitored closely.";
  }

  return `${subject} is stable for the selected range, and most events are ${dominantSeverity.toLowerCase()} severity.`;
}
