import { ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import GlobeLegend from "../components/GlobeLegend";
import GlobeView from "../components/GlobeView";
import { Button } from "../components/ui/button";
import { Select } from "../components/ui/select";
import { fetchEvents } from "../services/api";
import { eventTypeLabel } from "../lib/utils";

export default function GlobePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "all";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState(initialType);

  const loadEvents = async (type = eventType) => {
    setLoading(true);
    const result = await fetchEvents({ type });
    setEvents(result.events);
    setLoading(false);
  };

  useEffect(() => {
    setSearchParams({ type: eventType });
    loadEvents(eventType);
  }, [eventType]);

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <GlobeView events={events} />
      </div>
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 p-4">
        <div className="pointer-events-auto flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/75 p-3 backdrop-blur">
          <Link to="/dashboard">
            <Button variant="secondary">
              <ArrowLeft size={17} />
              Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300">Live Globe</p>
            <h1 className="text-lg font-bold">{eventTypeLabel(eventType)} Map</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select className="w-36" value={eventType} onChange={(event) => setEventType(event.target.value)}>
              <option value="all">All Events</option>
              <option value="earthquake">Earthquake</option>
              <option value="wildfire">Wildfire</option>
              <option value="flood">Flood</option>
            </Select>
            <Button onClick={() => loadEvents()} variant="secondary">
              <RefreshCw size={17} />
              Refresh
            </Button>
          </div>
        </div>
      </header>
      <aside className="pointer-events-none absolute right-4 top-24 z-10 w-72 max-w-[calc(100vw-2rem)]">
        <div className="pointer-events-auto">
          <GlobeLegend />
        </div>
      </aside>
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-black/40">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
        </div>
      )}
    </main>
  );
}
