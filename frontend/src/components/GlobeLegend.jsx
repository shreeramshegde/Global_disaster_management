export default function GlobeLegend() {
  const items = [
    { label: "Earthquake (High severity)", color: "#ff2d55" },
    { label: "Wildfire (High intensity)", color: "#fb923c" },
    { label: "Flood (High rainfall risk)", color: "#38bdf8" }
  ];

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/75 p-4 text-sm shadow-[0_0_35px_rgba(14,165,233,0.14)] backdrop-blur">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-200">Legend</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-slate-200">
            <span className="h-3 w-3 rounded-full shadow-[0_0_14px_currentColor]" style={{ background: item.color, color: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
