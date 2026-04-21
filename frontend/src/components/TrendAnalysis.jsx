import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { getAutoInsight, getTrendSummary } from "../lib/analytics";
import { eventTypeLabel } from "../lib/utils";

export default function TrendAnalysis({ events, selectedType = "all" }) {
  const trend = getTrendSummary(events);
  const insight = getAutoInsight(events);
  const isUp = trend.direction === "increase";
  const isDown = trend.direction === "decrease";
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Activity;
  const color = isUp ? "text-red-300" : isDown ? "text-emerald-300" : "text-cyan-300";

  return (
    <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md border border-cyan-300/20 bg-cyan-400/10">
            <Icon className={color} size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Trend Analysis</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{trend.text}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.22em] text-blue-200">{eventTypeLabel(selectedType)} Insight</p>
        <p className="mt-3 text-base leading-7 text-slate-100">{insight}</p>
      </div>
    </section>
  );
}
