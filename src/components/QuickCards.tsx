import React from 'react';
import { PhoneCall, MapPin, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

interface QuickCardsProps {
  onSelectPhone: () => void;
  onSelectGps: () => void;
  onSelectIp: () => void;
  onSelectSecurity: () => void;
}

export const QuickCards: React.FC<QuickCardsProps> = ({
  onSelectPhone,
  onSelectGps,
  onSelectIp,
  onSelectSecurity,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Phone Lookup Card */}
      <button
        type="button"
        onClick={onSelectPhone}
        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-purple-900/30 to-[#0e122b] border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all group text-left cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform">
            <PhoneCall className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Phone Lookup</h4>
            <p className="text-xs text-purple-300/80">Get number info</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-900/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* 2. GPS Location Card */}
      <button
        type="button"
        onClick={onSelectGps}
        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-emerald-900/30 to-[#0e122b] border border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all group text-left cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">GPS Location</h4>
            <p className="text-xs text-emerald-300/80">Share your location</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* 3. IP Lookup Card */}
      <button
        type="button"
        onClick={onSelectIp}
        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-cyan-900/30 to-[#0e122b] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all group text-left cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">IP Lookup</h4>
            <p className="text-xs text-cyan-300/80">Know your IP</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-cyan-900/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* 4. 100% Secure Card */}
      <button
        type="button"
        onClick={onSelectSecurity}
        className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-amber-900/30 to-[#0e122b] border border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all group text-left cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">100% Secure</h4>
            <p className="text-xs text-amber-300/80">Your data is safe</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
