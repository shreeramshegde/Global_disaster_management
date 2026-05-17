import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useState } from "react";
import { getDailyTrendData, getSeverityData } from "../lib/stats";
import { eventTypeLabel } from "../lib/utils";

const severityColors = {
  Low: "#fde047",
  Medium: "#fb923c",
  High: "#ff2d55",
  Minor: "#93c5fd",
  Moderate: "#2563eb",
  Severe: "#38bdf8"
};

const tooltipStyle = {
  background: "#020617",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  boxShadow: "0 16px 40px rgba(0,0,0,0.35)"
};

export default function Charts({ events, selectedType = "all" }) {
  const [activeSeverityIndex, setActiveSeverityIndex] = useState(null);
  const trendData = getDailyTrendData(events);
  const severityData = getSeverityData(events);
  const severityTotal = severityData.reduce((sum, item) => sum + item.value, 0);
  const isConflict = selectedType === "conflict" && events.every((event) => event.type === "conflict");
  const areaTitle = isConflict ? "Conflict Fatalities Area Graph" : `${eventTypeLabel(selectedType)} Activity Area Graph`;
  const areaDataKey = isConflict ? "value" : "events";
  const areaName = isConflict ? "Fatalities" : "Events";
  const areaValueSuffix = isConflict ? "fatalities" : "events";
  const gradientTop = isConflict ? "#ef4444" : "#22d3ee";
  const gradientMid = isConflict ? "#991b1b" : "#2563eb";
  const lineColor = isConflict ? "#ef4444" : "#22d3ee";
  const activeDotColor = isConflict ? "#fca5a5" : "#22d3ee";
  const cursorColor = isConflict ? "rgba(239,68,68,0.38)" : "rgba(56,189,248,0.38)";

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartPanel title={areaTitle} className="xl:col-span-2">
        <ResponsiveContainer width="100%" height={330}>
          <AreaChart data={trendData} margin={{ top: 18, right: 24, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="eventAreaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={gradientTop} stopOpacity={0.42} />
                <stop offset="55%" stopColor={gradientMid} stopOpacity={0.16} />
                <stop offset="100%" stopColor={gradientTop} stopOpacity={0} />
              </linearGradient>
              <filter id="areaLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip
              content={<AreaTooltip suffix={areaValueSuffix} dataKey={areaDataKey} />}
              cursor={{ stroke: cursorColor, strokeWidth: 1 }}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={areaDataKey}
              name={areaName}
              stroke={lineColor}
              strokeWidth={4}
              fill="url(#eventAreaFill)"
              filter="url(#areaLineGlow)"
              dot={{ r: 4, fill: "#020617", stroke: lineColor, strokeWidth: 2 }}
              activeDot={{ r: 8, fill: activeDotColor, stroke: "#ffffff", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title={isConflict ? "Fatality Breakdown" : "Severity Breakdown"}>
        <ResponsiveContainer width="100%" height={330}>
          <PieChart>
            <Pie
              data={severityData}
              dataKey="value"
              nameKey="name"
              activeIndex={activeSeverityIndex}
              activeShape={renderActiveSeverityShape}
              innerRadius={58}
              outerRadius={104}
              paddingAngle={4}
              label
              animationDuration={1100}
              onMouseEnter={(_, index) => setActiveSeverityIndex(index)}
              onMouseLeave={() => setActiveSeverityIndex(null)}
            >
              {severityData.map((entry) => (
                <Cell key={entry.name} fill={severityColors[entry.name]} stroke="rgba(0,0,0,0.4)" />
              ))}
            </Pie>
            <Tooltip
              content={<PieTooltip total={severityTotal} />}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}

function AreaTooltip({ active, payload, label, suffix = "events", dataKey = "events" }) {
  if (!active || !payload?.length) return null;

  const value = payload.find((item) => item.dataKey === dataKey)?.value ?? 0;

  return (
    <div style={tooltipStyle}>
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{label}</p>
      <p className="mt-2 text-sm text-white">
        Value: <span className="font-bold text-cyan-200">{value}</span> {suffix}
      </p>
    </div>
  );
}

function PieTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const name = item.name || item.payload?.name;
  const value = Number(item.value || 0);
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div style={tooltipStyle}>
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="mt-1 text-sm text-slate-200">
        {value} events <span className="text-cyan-200">({percentage}%)</span>
      </p>
    </div>
  );
}

function renderActiveSeverityShape(props) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.95}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 13}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.45}
      />
    </g>
  );
}

function ChartPanel({ title, className = "", children }) {
  return (
    <section className={`rounded-lg border border-cyan-300/10 bg-white/[0.045] p-4 shadow-[0_0_35px_rgba(14,165,233,0.08)] backdrop-blur ${className}`}>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">{title}</h2>
      {children}
    </section>
  );
}
