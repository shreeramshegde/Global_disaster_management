import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GlobeView from "../components/GlobeView";
import { Button } from "../components/ui/button";

const previewEvents = [
  { event_id: "preview-1", magnitude: 4.2, place: "Pacific Rim", latitude: 35, longitude: 142, event_time: new Date().toISOString() },
  { event_id: "preview-2", magnitude: 5.6, place: "South America", latitude: -20, longitude: -70, event_time: new Date().toISOString() },
  { event_id: "preview-3", magnitude: 3.4, place: "Alaska", latitude: 61, longitude: -150, event_time: new Date().toISOString() }
];

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_42%,rgba(14,165,233,0.22),transparent_35%),linear-gradient(135deg,#020617_0%,#000_48%,#031b2d_100%)]" />
      <div className="absolute inset-0 opacity-55 mix-blend-screen">
        <GlobeView events={previewEvents} interactive={false} variant="hero" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      <section className="relative z-10 flex min-h-screen items-center px-6 py-14">
        <div className="max-w-4xl animate-fadeIn">
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">GLOBAL DISASTER MANAGEMENT SYSTEM</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Real-time earthquake, wildfire, and flood ingestion, cleaned PostgreSQL records, visual analytics, and a live 3D globe for global disaster awareness.
          </p>
          <Link to="/dashboard" className="mt-8 inline-block">
            <Button className="animate-pulseGlow transition-transform duration-300 hover:scale-105">
              Explore Data
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
