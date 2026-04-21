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
      .pointAltitude(0.004)
      .pointRadius((d) => {
        const value = Number(d.magnitude);
        if (d.type === "flood") return Math.max(0.22, Math.min(0.85, value / 70));
        return d.type === "wildfire" ? Math.max(0.2, Math.min(0.8, value / 520)) : Math.max(0.18, value * 0.085);
      })
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
      .ringMaxRadius((d) => {
        if (d.type === "flood") return Math.max(1.4, Math.min(4.5, Number(d.magnitude) / 12));
        return d.type === "wildfire" ? Math.max(1.3, Math.min(4, Number(d.magnitude) / 110)) : Math.max(1.4, Number(d.magnitude) * 0.8);
      })
      .ringPropagationSpeed(1.2)
      .ringRepeatPeriod(1800)
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
