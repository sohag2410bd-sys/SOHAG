import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Info, ShieldCheck, Square, Share2, Check, AlertTriangle } from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { GpsLocationState } from '../types';

interface GpsLocationCardProps {
  onSaveHistory: (data: { latitude: number; longitude: number; accuracy: number; address?: string }) => void;
}

export const GpsLocationCard: React.FC<GpsLocationCardProps> = ({ onSaveHistory }) => {
  const [gpsState, setGpsState] = useState<GpsLocationState>({
    isActive: false,
    latitude: 23.8103, // Default Dhaka coordinates for aesthetic preview
    longitude: 90.4125,
    accuracy: null,
    altitude: null,
    speed: null,
    heading: null,
    address: 'Dhaka, Bangladesh (Preview)',
    trackingMode: 'idle',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Stop tracking on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
      }
    } catch {
      // Ignore network errors
    }
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  };

  const handleStartSharing = () => {
    if (!navigator.geolocation) {
      setGpsState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setIsLoading(true);
    setGpsState((prev) => ({ ...prev, error: null }));

    // Request high-accuracy position
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        const address = await reverseGeocode(lat, lon);

        setGpsState({
          isActive: true,
          latitude: lat,
          longitude: lon,
          accuracy: acc,
          altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
          speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : null,
          heading: pos.coords.heading,
          address,
          trackingMode: 'single',
          lastUpdated: new Date().toLocaleTimeString(),
        });

        setIsLoading(false);
        onSaveHistory({ latitude: lat, longitude: lon, accuracy: acc, address });

        // Start live watch
        try {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (updatedPos) => {
              setGpsState((prev) => ({
                ...prev,
                latitude: updatedPos.coords.latitude,
                longitude: updatedPos.coords.longitude,
                accuracy: Math.round(updatedPos.coords.accuracy),
                lastUpdated: new Date().toLocaleTimeString(),
              }));
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000 }
          );
        } catch {
          // Ignore watchPosition errors
        }
      },
      (err) => {
        setIsLoading(false);
        let msg = 'Location request was declined or timed out.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Permission denied. Please grant location access in your browser settings to share GPS.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'GPS signal unavailable. Ensure location services are toggled on.';
        }
        setGpsState((prev) => ({
          ...prev,
          error: msg,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleStopSharing = () => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGpsState((prev) => ({
      ...prev,
      isActive: false,
      trackingMode: 'idle',
    }));
  };

  const handleCopyShareLink = () => {
    if (gpsState.latitude && gpsState.longitude) {
      const shareUrl = `https://www.google.com/maps?q=${gpsState.latitude},${gpsState.longitude}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#0a1824] to-[#070e17] border border-emerald-500/25 p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              GPS Location Sharing
            </h3>
            <p className="text-xs text-slate-400">
              Share your real-time location
            </p>
          </div>
        </div>

        {/* Info notice box matching screenshot */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs mb-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <p className="text-[11px] sm:text-xs leading-snug">
            Your location will only be shared when you allow permission.
          </p>
        </div>

        {/* Map Preview Component */}
        <div className="mb-4">
          <InteractiveMap
            latitude={gpsState.latitude}
            longitude={gpsState.longitude}
            accuracy={gpsState.accuracy}
            address={gpsState.address}
            isLive={gpsState.isActive}
          />
        </div>

        {/* Error notice if permission declined */}
        {gpsState.error && (
          <div className="mb-3 flex items-start gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{gpsState.error}</span>
          </div>
        )}

        {/* Active GPS Details Bar */}
        {gpsState.isActive && gpsState.latitude && gpsState.longitude && (
          <div className="mb-4 p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Sensor Broadcasting
              </span>
              {gpsState.lastUpdated && (
                <span className="text-[10px] text-slate-400 font-mono">
                  Updated: {gpsState.lastUpdated}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[9px]">LATITUDE</span>
                <span className="text-white">{gpsState.latitude.toFixed(6)}°</span>
              </div>
              <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[9px]">LONGITUDE</span>
                <span className="text-white">{gpsState.longitude.toFixed(6)}°</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Accuracy: ±{gpsState.accuracy ?? 10}m
              </span>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-slate-700 hover:border-cyan-500 text-[11px] transition-colors"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Big Action Button (Share My Location / Stop Sharing) */}
        {!gpsState.isActive ? (
          <button
            type="button"
            onClick={handleStartSharing}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-semibold text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Requesting Sensor Access...
              </span>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Share My Location</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStopSharing}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Square className="w-4 h-4" />
            <span>Stop Sharing Location</span>
          </button>
        )}
      </div>

      {/* Footer text matching screenshot */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>You can stop sharing anytime</span>
        </span>
      </div>
    </div>
  );
};
