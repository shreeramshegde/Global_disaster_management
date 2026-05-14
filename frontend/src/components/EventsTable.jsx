import { colorForEvent, formatDate, metricLabelForType, severityForEvent, sourceBadgeLabel } from "../lib/utils";

export default function EventsTable({
  events,
  selectedType = "all",
  adminMode = false,
  onEdit,
  onDelete,
  deletingEventId
}) {
  const metricLabel = metricLabelForType(selectedType);
  const metricColumnLabel = selectedType === "conflict" ? "Fatalities" : metricLabel;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="max-h-[430px] overflow-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Place</th>
              <th className="px-4 py-3">{metricColumnLabel}</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Coordinates</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Updated</th>
              {adminMode && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {events.map((event) => (
              <tr key={event.event_id} className="hover:bg-white/[0.04]">
                <td className="px-4 py-3 capitalize text-slate-300">{event.type}</td>
                <td className="px-4 py-3 text-slate-100">{event.place}</td>
                <td className="px-4 py-3 font-semibold">{Number(event.magnitude).toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2 py-1 text-xs font-semibold text-black" style={{ background: colorForEvent(event) }}>
                    {severityForEvent(event)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${event.source_type === "manual" ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-400/20 text-slate-200"}`}>
                    {event.source_type === "manual" ? "ADMIN" : "READ ONLY"} {sourceBadgeLabel(event.source_type)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {Number(event.latitude).toFixed(2)}, {Number(event.longitude).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-300">{formatDate(event.event_time)}</td>
                <td className="px-4 py-3 text-slate-400">{formatDate(event.updated_at || event.created_at)}</td>
                {adminMode && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-md border border-cyan-300/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={event.source_type !== "manual"}
                        onClick={() => onEdit?.(event)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-rose-300/20 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={event.source_type !== "manual" || deletingEventId === event.id}
                        onClick={() => onDelete?.(event)}
                        type="button"
                      >
                        {deletingEventId === event.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
