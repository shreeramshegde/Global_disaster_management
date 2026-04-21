import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

export default function Filters({ filters, onChange, onApply }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <section className="border-y border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-7">
        <Select value={filters.type} onChange={(event) => update("type", event.target.value)}>
          <option value="all">All Events</option>
          <option value="earthquake">Earthquake</option>
          <option value="wildfire">Wildfire</option>
          <option value="flood">Flood</option>
        </Select>
        <Input type="date" value={filters.startDate} onChange={(event) => update("startDate", event.target.value)} />
        <Input type="date" value={filters.endDate} onChange={(event) => update("endDate", event.target.value)} />
        <Input type="number" step="0.1" placeholder="Min value" value={filters.minMagnitude} onChange={(event) => update("minMagnitude", event.target.value)} />
        <Input type="number" step="0.1" placeholder="Max value" value={filters.maxMagnitude} onChange={(event) => update("maxMagnitude", event.target.value)} />
        <Input placeholder="Search place" value={filters.search} onChange={(event) => update("search", event.target.value)} />
        <Button onClick={onApply} className="w-full">
          <Search size={17} />
          Apply
        </Button>
      </div>
    </section>
  );
}
