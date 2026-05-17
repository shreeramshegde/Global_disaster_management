import { severityForEvent } from "../lib/utils";
import { getAutoInsight, getTrendSummary } from "../lib/stats";
import { metricLabelForType } from "../lib/utils";

export default function Insights({ events, selectedType = "all" }) {
  const total = events.length;
  const high = events.filter((event) => severityForEvent(event) === "High").length;
  const average = total ? events.reduce((sum, event) => sum + Number(event.magnitude), 0) / total : 0;
  const trend = getTrendSummary(events);
  const insight = getAutoInsight(events);
  const metricLabel = metricLabelForType(selectedType).toLowerCase();
  const highLabel = selectedType === "conflict" ? "High Fatality Events" : "High Severity Events";

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <InsightCard label="Total Events" value={total} />
      <InsightCard label={highLabel} value={high} />
      <InsightCard label="Trend Summary" value={trend.direction} small />
      <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-4 md:col-span-3">
        <p className="text-sm text-slate-300">
          Average {metricLabel} is <span className="font-semibold text-white">{average.toFixed(2)}</span>. {insight}
        </p>
      </div>
    </section>
  );
}

function InsightCard({ label, value, small }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={small ? "mt-3 text-lg font-semibold text-white" : "mt-3 text-4xl font-bold text-white"}>{value}</p>
    </div>
  );
}
