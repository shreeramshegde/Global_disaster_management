import { Globe2, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminEventForm from "../components/AdminEventForm";
import Charts from "../components/Charts";
import EventsTable from "../components/EventsTable";
import Filters from "../components/Filters";
import Insights from "../components/Insights";
import TrendAnalysis from "../components/TrendAnalysis";
import { Button } from "../components/ui/button";
import { broadcastEventsUpdated, clearAdminSession, loadAdminSession } from "../lib/adminSession";
import { createEvent, deleteEvent, fetchEvents, fetchEventTypes, updateEvent } from "../services/api";

const initialFilters = {
  type: "all",
  severity: "",
  sourceType: "all",
  startDate: "",
  endDate: "",
  minMagnitude: "",
  maxMagnitude: "",
  search: ""
};

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminSession, setAdminSession] = useState(() => loadAdminSession());
  const [eventTypes, setEventTypes] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const isAdminAuthenticated = Boolean(adminSession?.token);

  const loadEvents = async (activeFilters) => {
    setLoading(true);
    const result = await fetchEvents(activeFilters);
    setEvents(result.events);
    setIsFallback(result.isFallback);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents(initialFilters);
    fetchEventTypes().then(setEventTypes).catch(() => setEventTypes([]));
  }, []);

  useEffect(() => {
    setAdminSession(loadAdminSession());
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      setAdminMode(false);
      setEditingEvent(null);
    } else {
      setAdminMode(true);
    }
  }, [isAdminAuthenticated]);

  const handleFilterChange = (nextFilters) => {
    const typeChanged = nextFilters.type !== filters.type;
    setFilters(nextFilters);
    if (typeChanged) loadEvents(nextFilters);
  };

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.event_time) - new Date(a.event_time)),
    [events]
  );

  const handleSave = async (payload) => {
    setSaving(true);
    setNotice("");

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        setNotice("Manual event updated successfully.");
      } else {
        await createEvent(payload);
        setNotice("Manual event created successfully.");
      }

      broadcastEventsUpdated();
      setEditingEvent(null);
      await loadEvents(filters);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    setDeletingEventId(event.id);
    setNotice("");

    try {
      await deleteEvent(event.id);
      if (editingEvent?.id === event.id) setEditingEvent(null);
      if (confirmDeleteEvent?.id === event.id) setConfirmDeleteEvent(null);
      setNotice("Manual event soft deleted successfully.");
      broadcastEventsUpdated();
      await loadEvents(filters);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setDeletingEventId("");
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminSession(null);
    setNotice("Admin session ended.");
    setAdminMode(false);
    setEditingEvent(null);
    setConfirmDeleteEvent(null);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-slate-950/80 px-4 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Global Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Disaster Monitoring</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdminAuthenticated ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                  <ShieldCheck size={16} />
                  Admin: {adminSession?.admin?.username || "Authenticated"}
                </div>
                <Button variant={adminMode ? "primary" : "secondary"} onClick={() => setAdminMode((current) => !current)}>
                  {adminMode ? "Admin Mode On" : "Admin Mode Off"}
                </Button>
                <Button onClick={handleLogout} variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/admin/login")} variant="secondary">
                Admin Login
              </Button>
            )}
            <Button variant="secondary" onClick={() => loadEvents(filters)}>
              <RefreshCw size={17} />
              Refresh
            </Button>
            <Link to={`/globe?type=${filters.type}&sourceType=${filters.sourceType}`}>
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

        {notice && (
          <div className="rounded-md border border-cyan-300/20 bg-cyan-400/10 p-3 text-sm text-cyan-100">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[420px] place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
          </div>
        ) : (
          <>
            {adminMode && isAdminAuthenticated && !isFallback && (
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Admin Mode</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">Create manual events</h2>
                  </div>
                  <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Manual CRUD only
                  </div>
                </div>
              <AdminEventForm
                eventTypes={eventTypes}
                loading={saving}
                onSubmit={handleSave}
              />
              </section>
            )}
            <Insights events={sortedEvents} selectedType={filters.type} />
            <Charts events={sortedEvents} selectedType={filters.type} />
            <TrendAnalysis events={sortedEvents} selectedType={filters.type} />
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Events List</h2>
              <EventsTable
                adminMode={adminMode && isAdminAuthenticated && !isFallback}
                deletingEventId={deletingEventId}
                events={sortedEvents}
                onDelete={setConfirmDeleteEvent}
                onEdit={setEditingEvent}
                selectedType={filters.type}
              />
            </section>
          </>
        )}
      </div>

      {editingEvent && adminMode && isAdminAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-5xl">
            <AdminEventForm
              eventTypes={eventTypes}
              initialValues={editingEvent}
              loading={saving}
              onCancel={() => setEditingEvent(null)}
              onSubmit={handleSave}
            />
          </div>
        </div>
      )}

      {confirmDeleteEvent && (
        <DeleteDialog
          event={confirmDeleteEvent}
          loading={deletingEventId === confirmDeleteEvent.id}
          onCancel={() => setConfirmDeleteEvent(null)}
          onConfirm={() => handleDelete(confirmDeleteEvent)}
        />
      )}
    </main>
  );
}

function DeleteDialog({ event, loading, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-rose-300/15 bg-slate-950 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.55)]">
        <p className="text-xs uppercase tracking-[0.24em] text-rose-200">Delete Manual Event</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Confirm soft delete</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This will hide <span className="font-semibold text-white">{event?.place}</span> from normal reads by setting the row as soft deleted. External events remain protected and hard delete is blocked in the database.
        </p>
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" disabled={loading} onClick={onConfirm} variant="primary">
            {loading ? "Deleting..." : "Confirm Delete"}
          </Button>
          <Button className="flex-1" disabled={loading} onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
