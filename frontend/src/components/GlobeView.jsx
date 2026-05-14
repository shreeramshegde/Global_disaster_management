import Globe from "globe.gl";
import { useEffect, useMemo, useRef } from "react";
import { colorForEvent, formatDate, metricLabelForType } from "../lib/utils";

const EARTH_IMAGE = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg";
const EARTH_BUMP = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png";

export default function GlobeView({ events = [], interactive = true, variant = "default" }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const safeEvents = useMemo(
    () => events.filter((event) => Number.isFinite(Number(event.latitude)) && Number.isFinite(Number(event.longitude))),
    [events]
  );

  const pointRadiusForEvent = (event) => {
    const value = Number(event.magnitude);
    if (event.type === "flood") return Math.max(0.22, Math.min(0.85, value / 70));
    if (event.type === "wildfire") return Math.max(0.2, Math.min(0.8, value / 520));
    if (event.type === "conflict") return Math.max(0.24, Math.min(1.15, 0.26 + value / 32));
    return Math.max(0.18, value * 0.085);
  };

  const ringRadiusForEvent = (event) => {
    const value = Number(event.magnitude);
    if (event.type === "flood") return Math.max(1.4, Math.min(4.5, value / 12));
    if (event.type === "wildfire") return Math.max(1.3, Math.min(4, value / 110));
    if (event.type === "conflict") return Math.max(1.5, Math.min(5.2, 1.4 + value / 8));
    return Math.max(1.4, value * 0.8);
  };

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const container = containerRef.current;
    const isHero = variant === "hero";
    const globe = Globe()(containerRef.current)
      .backgroundColor("rgba(0,0,0,0)")
      .globeImageUrl(EARTH_IMAGE)
      .bumpImageUrl(EARTH_BUMP)
      .showAtmosphere(true)
      .atmosphereColor(isHero ? "#38bdf8" : "#2563eb")
      .atmosphereAltitude(isHero ? 0.18 : 0.12)
      .pointsData(safeEvents)
      .pointLat((d) => d.latitude)
      .pointLng((d) => d.longitude)
      .pointAltitude((d) => (d.type === "conflict" ? 0.0015 : 0.004))
      .pointRadius((d) => pointRadiusForEvent(d))
      .pointColor((d) => colorForEvent(d))
      .pointLabel((d) => `
        <div class="globe-tooltip">
          <strong>${d.place}</strong><br />
          Type: ${d.type}<br />
          ${metricLabelForType(d.type)}: ${Number(d.magnitude).toFixed(1)}<br />
          Time: ${formatDate(d.event_time)}
        </div>
      `)
      .ringsData(safeEvents)
      .ringLat((d) => d.latitude)
      .ringLng((d) => d.longitude)
      .ringColor((d) => colorForEvent(d))
      .ringMaxRadius((d) => ringRadiusForEvent(d))
      .ringPropagationSpeed((d) => (d.type === "conflict" ? 1.45 : 1.2))
      .ringRepeatPeriod((d) => (d.type === "conflict" ? 1200 : 1800))
      .enablePointerInteraction(interactive);

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = isHero ? 0.45 : 0.75;
    globeRef.current = globe;

    const resize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      globe.width(width).height(height);
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      globeRef.current = null;
      if (container) container.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointsData(safeEvents).ringsData(safeEvents);
    }
  }, [safeEvents]);

  return <div ref={containerRef} className="h-full w-full" />;
}
