import { colorForEvent, formatDate, metricLabelForType, severityForEvent } from "../lib/utils";

export default function EventsTable({ events, selectedType = "all" }) {
  const metricLabel = metricLabelForType(selectedType);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="max-h-[430px] overflow-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Event ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Place</th>
              <th className="px-4 py-3">{metricLabel}</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Coordinates</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {events.map((event) => (
              <tr key={event.event_id} className="hover:bg-white/[0.04]">
                <td className="px-4 py-3 font-mono text-xs text-blue-200">{event.event_id}</td>
                <td className="px-4 py-3 capitalize text-slate-300">{event.type}</td>
                <td className="px-4 py-3 text-slate-100">{event.place}</td>
                <td className="px-4 py-3 font-semibold">{Number(event.magnitude).toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2 py-1 text-xs font-semibold text-black" style={{ background: colorForEvent(event) }}>
                    {severityForEvent(event)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {Number(event.latitude).toFixed(2)}, {Number(event.longitude).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-slate-300">{formatDate(event.event_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
