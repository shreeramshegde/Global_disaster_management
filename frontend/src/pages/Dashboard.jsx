import { Globe2, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Charts from "../components/Charts";
import EventsTable from "../components/EventsTable";
import Filters from "../components/Filters";
import Insights from "../components/Insights";
import TrendAnalysis from "../components/TrendAnalysis";
import { Button } from "../components/ui/button";
import { fetchEvents } from "../services/api";

const initialFilters = {
  type: "all",
  startDate: "",
  endDate: "",
  minMagnitude: "2.5",
  maxMagnitude: "",
  search: ""
};

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const loadEvents = async (activeFilters) => {
    setLoading(true);
    const result = await fetchEvents(activeFilters);
    setEvents(result.events);
    setIsFallback(result.isFallback);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents(initialFilters);
  }, []);

  const handleFilterChange = (nextFilters) => {
    const typeChanged = nextFilters.type !== filters.type;
    setFilters(nextFilters);
    if (typeChanged) loadEvents(nextFilters);
  };

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.event_time) - new Date(a.event_time)),
    [events]
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-slate-950/80 px-4 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Global Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Disaster Monitoring</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => loadEvents()}>
              <RefreshCw size={17} />
              Refresh
            </Button>
            <Link to={`/globe?type=${filters.type}`}>
              <Button>
                <Globe2 size={17} />
                View Globe
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Filters filters={filters} onChange={handleFilterChange} onApply={() => loadEvents(filters)} />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6">
        {isFallback && (
          <div className="rounded-md border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
            Showing sample data because the backend is not reachable or Supabase credentials are not configured yet.
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
          </div>
        ) : (
          <>
            <Insights events={sortedEvents} selectedType={filters.type} />
            <Charts events={sortedEvents} selectedType={filters.type} />
            <TrendAnalysis events={sortedEvents} selectedType={filters.type} />
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Events List</h2>
              <EventsTable events={sortedEvents} selectedType={filters.type} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
