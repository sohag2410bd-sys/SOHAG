import React from 'react';
import { Zap, ShieldCheck, Globe2, Heart, ArrowRight, Smartphone, Compass } from 'lucide-react';

interface HeroBannerProps {
  onGetStarted: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onGetStarted }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c132c] via-[#090d20] to-[#060814] border border-cyan-500/20 p-6 sm:p-8 md:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.8)]">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 -mb-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Badges & CTA */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          {/* Main Title */}
          <div>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
              SOHAG
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
              Mobile Number Tracker
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Lookup mobile numbers, share your GPS location, and get detailed IP information — all in one powerful tool.
          </p>

          {/* Feature Badges Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs text-slate-200 shadow-sm backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fast & Accurate</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs text-slate-200 shadow-sm backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>100% Secure</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs text-slate-200 shadow-sm backdrop-blur-md">
              <Globe2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Worldwide Support</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs text-slate-200 shadow-sm backdrop-blur-md">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500" />
              <span>Open Source</span>
            </span>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>🚀 Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Holographic Smartphone & Neon Globe Visual */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          {/* Subtle Tagline cursive text */}
          <div className="absolute -top-3 left-6 sm:left-12 text-slate-300 font-serif italic text-xs tracking-wider opacity-80 pointer-events-none transform -rotate-6">
            Know More... Stay Safe...
          </div>

          <div className="relative w-72 h-64 sm:w-80 sm:h-72 flex items-center justify-center">
            {/* Holographic orbital rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="absolute w-60 h-60 rounded-full border border-purple-500/25 border-dashed animate-spin" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />

            {/* Glowing Globe background sphere */}
            <div className="absolute right-0 top-6 w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-950 via-purple-900 to-blue-600 p-[1.5px] opacity-90 shadow-[0_0_40px_rgba(6,182,212,0.35)]">
              <div className="w-full h-full rounded-full bg-[#0a1128] overflow-hidden relative flex items-center justify-center">
                {/* Globe grid lines */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
                <Globe2 className="w-32 h-32 text-cyan-400/60 drop-shadow-[0_0_15px_#06b6d4]" />
              </div>
            </div>

            {/* Smartphone Mockup */}
            <div className="relative z-10 w-36 h-60 rounded-3xl bg-slate-900 border-2 border-cyan-400/60 p-2 shadow-[0_0_35px_rgba(168,85,247,0.3)] transform -rotate-12 hover:rotate-0 transition-transform duration-500">
              {/* Screen Content */}
              <div className="w-full h-full rounded-2xl bg-[#070b19] border border-cyan-500/30 overflow-hidden flex flex-col justify-between p-3 relative">
                {/* Phone Speaker Notch */}
                <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />

                {/* Big Glowing Pin inside phone */}
                <div className="my-auto flex flex-col items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-cyan-400/20 animate-ping absolute inset-0 m-auto" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
                      <Compass className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-cyan-300 font-bold tracking-wider">
                    SOHAG LIVE
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono">
                    23.8103° N, 90.4125° E
                  </div>
                </div>

                {/* Bottom home indicator */}
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
