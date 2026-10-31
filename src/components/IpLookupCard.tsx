import React, { useState } from 'react';
import { Globe, Search, Check, Copy, Server, Sparkles, MapPin, AlertCircle, Wifi } from 'lucide-react';
import { lookupIp, isValidIp } from '../utils/ipTracker';
import { IpLookupResult } from '../types';

interface IpLookupCardProps {
  onSaveHistory: (result: IpLookupResult) => void;
}

export const IpLookupCard: React.FC<IpLookupCardProps> = ({ onSaveHistory }) => {
  const [ipInput, setIpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<IpLookupResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLookup = async (overrideIp?: string) => {
    const target = overrideIp !== undefined ? overrideIp : ipInput;
    setErrorMsg(null);

    if (target.trim() && !isValidIp(target.trim())) {
      setErrorMsg('Please enter a valid IP address format (e.g. 8.8.8.8)');
      return;
    }

    setIsLoading(true);
    const res = await lookupIp(target);
    setIsLoading(false);

    if (res.success && res.data) {
      setLookupResult(res.data);
      onSaveHistory(res.data);
    } else {
      setErrorMsg(res.error || 'Failed to lookup IP address');
    }
  };

  const handleDetectSelfIp = () => {
    setIpInput('');
    handleLookup('');
  };

  const copyIpDetails = () => {
    if (!lookupResult) return;
    const text = `IP: ${lookupResult.ip}\nLocation: ${lookupResult.city}, ${lookupResult.country}\nISP: ${lookupResult.isp}\nASN: ${lookupResult.asn}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#131032] to-[#090b20] border border-cyan-500/25 p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      <div>
        {/* Header matching reference */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              IP Information Lookup
            </h3>
            <p className="text-xs text-slate-400">
              Find information about any IP address
            </p>
          </div>
        </div>

        {/* Input group with search button */}
        <div className="space-y-3">
          <div className="flex items-center rounded-xl bg-slate-950/90 border border-slate-700/80 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/50 p-1 transition-all">
            <input
              type="text"
              placeholder="Enter IP Address (e.g. 8.8.8.8)..."
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              aria-label="Enter IP address"
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
            />
            <button
              type="button"
              aria-label="Search IP address"
              onClick={() => handleLookup()}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Quick button to detect own IP */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDetectSelfIp}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Detect My Public IP</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">IPv4 / IPv6</span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* What You'll Get Card + Isometric Server Rack Art matching reference */}
        {!lookupResult ? (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-12 gap-3 items-center">
            {/* Checklist */}
            <div className="col-span-7 space-y-2">
              <span className="text-xs font-semibold text-slate-200 block">
                What You'll Get:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-300 text-[11px]">Country & Region</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-300 text-[11px]">ISP Information</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-300 text-[11px]">Location Details</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-slate-300 text-[11px]">More Information</span>
                </li>
              </ul>
            </div>

            {/* Isometric 3D Server Rack Illustration */}
            <div className="col-span-5 flex items-center justify-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Neon Cyan Glow behind servers */}
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
                
                {/* Isometric Server Stack SVG matching reference */}
                <svg className="w-20 h-20" viewBox="0 0 120 120" fill="none">
                  {/* Top Server Unit */}
                  <path d="M60 15 L105 37 L60 59 L15 37 Z" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
                  <path d="M15 37 L60 59 L60 72 L15 50 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <path d="M60 59 L105 37 L105 50 L60 72 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="28" cy="45" r="2.5" fill="#38bdf8" className="animate-ping" />
                  <circle cx="36" cy="49" r="2.5" fill="#a855f7" />

                  {/* Middle Server Unit */}
                  <path d="M15 54 L60 76 L60 89 L15 67 Z" fill="#0f172a" stroke="#818cf8" strokeWidth="2" />
                  <path d="M60 76 L105 54 L105 67 L60 89 Z" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
                  <circle cx="28" cy="62" r="2.5" fill="#34d399" />
                  <circle cx="36" cy="66" r="2.5" fill="#38bdf8" />

                  {/* Bottom Server Unit */}
                  <path d="M15 71 L60 93 L60 106 L15 84 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  <path d="M60 93 L105 71 L105 84 L60 106 Z" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                  <circle cx="28" cy="79" r="2.5" fill="#facc15" />
                  <circle cx="36" cy="83" r="2.5" fill="#a855f7" />

                  {/* Holographic Location Pin on top of server */}
                  <path d="M60 5 C54 5 50 9 50 15 C50 22 60 30 60 30 C60 30 70 22 70 15 C70 9 66 5 60 5 Z" fill="#06b6d4" />
                  <circle cx="60" cy="14" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          /* Retrieved Results View */
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {lookupResult.ip}
                </span>
                <p className="text-xs text-slate-300">
                  {lookupResult.city}, {lookupResult.country} {lookupResult.flag}
                </p>
              </div>
              <button
                type="button"
                aria-label="Copy IP lookup result"
                onClick={copyIpDetails}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white transition-colors"
                title="Copy IP details"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">ISP / Telecom</span>
                <span className="text-purple-300 font-medium truncate block" title={lookupResult.isp}>
                  {lookupResult.isp}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">ASN Code</span>
                <span className="text-cyan-300 font-medium truncate block">{lookupResult.asn}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Region / Postal</span>
                <span className="text-slate-200 truncate block">
                  {lookupResult.region} ({lookupResult.postal})
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Timezone</span>
                <span className="text-slate-200 truncate block">{lookupResult.timezone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Coords: {lookupResult.latitude.toFixed(4)}, {lookupResult.longitude.toFixed(4)}</span>
              <a
                href={`https://www.google.com/maps?q=${lookupResult.latitude},${lookupResult.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                <span>View Map</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button matching screenshot: Lookup IP Address -> */}
      <div className="mt-5 pt-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => handleLookup()}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              Fetching Registry...
            </span>
          ) : (
            <span>Lookup IP Address →</span>
          )}
        </button>
      </div>
    </div>
  );
};
