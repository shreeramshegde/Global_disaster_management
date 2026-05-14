import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const defaultValues = {
  eventType: "earthquake",
  place: "",
  latitude: "",
  longitude: "",
  magnitude: "",
  severity: "Low",
  eventTime: ""
};

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function normalizeInitialValues(initialValues) {
  if (!initialValues) return defaultValues;

  return {
    eventType: initialValues.type || initialValues.event_type || "earthquake",
    place: initialValues.place || "",
    latitude: initialValues.latitude ?? "",
    longitude: initialValues.longitude ?? "",
    magnitude: initialValues.magnitude ?? "",
    severity: initialValues.severity || "Low",
    eventTime: toDateTimeLocal(initialValues.event_time)
  };
}

export default function AdminEventForm({
  eventTypes = [],
  initialValues,
  loading = false,
  onCancel,
  onSubmit
}) {
  const [values, setValues] = useState(() => normalizeInitialValues(initialValues));

  useEffect(() => {
    setValues(normalizeInitialValues(initialValues));
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      eventType: values.eventType,
      place: values.place,
      latitude: values.latitude,
      longitude: values.longitude,
      magnitude: values.magnitude,
      severity: values.severity,
      eventTime: values.eventTime
    });
  };

  const resetToInitialValues = () => setValues(normalizeInitialValues(initialValues));

  return (
    <section className="rounded-2xl border border-cyan-300/15 bg-slate-950/80 p-5 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Admin Form</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            {initialValues ? "Edit Manual Event" : "Create Manual Event"}
          </h2>
        </div>
        {initialValues && (
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel Edit
          </Button>
        )}
      </div>

      <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit}>
        <Select name="eventType" onChange={handleChange} value={values.eventType}>
          {(eventTypes.length ? eventTypes : ["earthquake", "wildfire", "flood", "conflict"]).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </Select>
        <Input name="place" onChange={handleChange} placeholder="Place" value={values.place} />
        <Input name="latitude" type="number" step="0.0001" onChange={handleChange} placeholder="Latitude" value={values.latitude} />
        <Input name="longitude" type="number" step="0.0001" onChange={handleChange} placeholder="Longitude" value={values.longitude} />
        <Input name="magnitude" type="number" step="0.1" onChange={handleChange} placeholder="Magnitude" value={values.magnitude} />
        <Select name="severity" onChange={handleChange} value={values.severity}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
        <Input name="eventTime" type="datetime-local" onChange={handleChange} value={values.eventTime} />
        <div className="flex gap-3">
          <Button className="flex-1" disabled={loading} type="submit">
            {loading ? "Saving..." : initialValues ? "Update Event" : "Create Event"}
          </Button>
          {initialValues && (
            <Button className="flex-1" variant="secondary" onClick={resetToInitialValues} type="button">
              Reset
            </Button>
          )}
        </div>
      </form>
      {initialValues && (
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onCancel} type="button">
            Close
          </Button>
        </div>
      )}
    </section>
  );
}
