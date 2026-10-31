import React, { useState } from 'react';
import { PhoneCall, Search, Copy, Check, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { POPULAR_COUNTRIES, parseNumberDetails } from '../utils/phoneTracker';
import { PhoneLookupResult } from '../types';

interface PhoneLookupCardProps {
  onSaveHistory: (result: PhoneLookupResult) => void;
}

export const PhoneLookupCard: React.FC<PhoneLookupCardProps> = ({ onSaveHistory }) => {
  const [selectedCountry, setSelectedCountry] = useState(POPULAR_COUNTRIES[0]);
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<PhoneLookupResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleLookup = (numberToQuery?: string) => {
    const raw = numberToQuery !== undefined ? numberToQuery : phoneInput;
    setErrorMsg(null);

    if (!raw.trim()) {
      setErrorMsg('Please enter a phone number to lookup');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // If user typed without +, prepend selected dialCode
      let query = raw.trim();
      if (!query.startsWith('+')) {
        if (query.startsWith('0')) {
          query = selectedCountry.dialCode + query.slice(1);
        } else {
          query = selectedCountry.dialCode + query;
        }
      }

      const res = parseNumberDetails(query, selectedCountry.iso as any);
      setIsLoading(false);

      if (res.success && res.data) {
        setLookupResult(res.data);
        onSaveHistory(res.data);
      } else {
        setErrorMsg(res.error || 'Failed to parse number');
      }
    }, 350);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExampleClick = (example: string) => {
    setPhoneInput(example);
    handleLookup(example);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1430] to-[#080c1f] border border-purple-500/25 p-5 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      <div>
        {/* Header matching reference */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Phone Number Lookup
              </h3>
              <p className="text-xs text-slate-400">
                Enter any international phone number
              </p>
            </div>
          </div>

          {/* Live Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Input Form with Country Flag Dropdown */}
        <div className="space-y-3">
          <div className="flex items-center rounded-xl bg-slate-950/90 border border-slate-700/80 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 p-1 transition-all">
            {/* Country Selector */}
            <div className="relative flex items-center border-r border-slate-800 pr-2 pl-2.5">
              <span className="text-lg mr-1.5">{selectedCountry.flag}</span>
              <select
                aria-label="Select country dial code"
                value={selectedCountry.iso}
                onChange={(e) => {
                  const found = POPULAR_COUNTRIES.find((c) => c.iso === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                className="bg-transparent text-slate-200 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer pr-4 py-1.5 appearance-none"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.iso} value={c.iso} className="bg-slate-900 text-white">
                    {c.dialCode} ({c.name})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Phone Number Input */}
            <input
              type="tel"
              placeholder={`e.g. ${selectedCountry.formatPlaceholder}`}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              aria-label="Enter phone number"
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          {/* Lookup Now Button (Gradient purple) */}
          <button
            type="button"
            onClick={() => handleLookup()}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Telecom Data...
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Lookup Now →</span>
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Panel */}
        {lookupResult && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{lookupResult.flag}</span>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    {lookupResult.international}
                    {lookupResult.isValid && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-400 font-mono">
                        Valid
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {lookupResult.countryName} ({lookupResult.countryCode})
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-label="Copy phone number"
                onClick={() => copyToClipboard(lookupResult.e164, 'e164')}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white transition-colors"
                title="Copy E.164"
              >
                {copiedField === 'e164' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Telecom metadata table */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Operator / Carrier</span>
                <span className="text-purple-300 font-medium truncate block" title={lookupResult.carrier}>
                  {lookupResult.carrier}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Line Type</span>
                <span className="text-cyan-300 font-medium">{lookupResult.lineType}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">E.164 Format</span>
                <span className="text-slate-200 font-mono">{lookupResult.e164}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Timezone</span>
                <span className="text-slate-200 font-mono truncate block">{lookupResult.timezones[0]}</span>
              </div>
            </div>

            {/* Ethical Disclaimer */}
            <div className="flex items-start gap-1.5 text-[10px] text-slate-400 pt-1 leading-snug">
              <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{lookupResult.disclaimer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Example Quick Click Pills matching screenshot */}
      <div className="mt-5 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 font-medium block mb-2">
          Example Numbers:
        </span>
        <div className="flex flex-wrap gap-2">
          {['+8801712345678', '+1 555 123 4567', '+44 7700 900123'].map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleExampleClick(ex)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-xs font-mono text-purple-300 hover:text-white transition-all cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
