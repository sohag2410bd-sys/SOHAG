import React from 'react';
import { ExternalLink, Navigation, Plus, Minus } from 'lucide-react';

interface InteractiveMapProps {
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
  address?: string;
  isLive?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  accuracy,
  address,
  isLive = false,
}) => {
  const [zoom, setZoom] = React.useState(15);

  const defaultLat = 23.8103;
  const defaultLon = 90.4125;
  const lat = latitude ?? defaultLat;
  const lon = longitude ?? defaultLon;

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.015 * (16 / zoom)}%2C${lat - 0.01 * (16 / zoom)}%2C${lon + 0.015 * (16 / zoom)}%2C${lat + 0.01 * (16 / zoom)}&layer=mapnik&marker=${lat}%2C${lon}`;
  const gmapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

  return (
    <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-950/80 shadow-inner group">
      {/* Real OpenStreetMap Iframe Embed */}
      <iframe
        title="OpenStreetMap Location View"
        src={osmEmbedUrl}
        className="w-full h-full border-0 filter brightness-[0.78] contrast-[1.15] invert-[0.88] hue-rotate-[180deg]"
        loading="lazy"
      />

      {/* Futuristic cyber grid and overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#070913] via-transparent to-transparent opacity-60" />

      {/* Pulsing Target Marker in Center if live */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 bg-cyan-500/20 rounded-full animate-ping" />
          <div className="absolute w-8 h-8 bg-purple-500/30 rounded-full animate-pulse" />
          <div className="relative w-4 h-4 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full border-2 border-white shadow-[0_0_15px_#06b6d4]" />
        </div>
      </div>

      {/* Coordinates / Status Pill Top-Left */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-cyan-300 shadow-md backdrop-blur-md">
        <Navigation className={`w-3 h-3 ${isLive ? 'text-emerald-400 animate-spin' : 'text-cyan-400'}`} />
        <span>
          {lat.toFixed(4)}°, {lon.toFixed(4)}°
        </span>
        {accuracy && (
          <span className="text-[10px] text-slate-400 ml-1">
            (±{Math.round(accuracy)}m)
          </span>
        )}
      </div>

      {/* Zoom buttons top right */}
      <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(z + 1, 18))}
          className="p-1.5 rounded bg-slate-900/90 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(z - 1, 10))}
          className="p-1.5 rounded bg-slate-900/90 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Address banner bottom if available */}
      {address && (
        <div className="absolute bottom-2 left-2 right-14 truncate px-2.5 py-1 rounded bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 font-sans backdrop-blur-sm">
          📍 {address}
        </div>
      )}

      {/* External Map button bottom right */}
      <a
        href={gmapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 p-1.5 rounded-md bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors shadow-md text-xs flex items-center justify-center"
        title="Open in Google Maps"
        aria-label="Open in Google Maps"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
