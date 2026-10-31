import React from 'react';
import { ShieldCheck, Terminal, Download, History, Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenTerminal: () => void;
  onOpenDownload: () => void;
  onOpenHistory: () => void;
  onToggleSidebar?: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTerminal,
  onOpenDownload,
  onOpenHistory,
  onToggleSidebar,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-[#070913]/90 backdrop-blur-xl flex items-center justify-between">
      {/* Left: Mobile hamburger & Online status */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 text-xs font-medium">
          {/* Green Pulsing System Online */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>System Online</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Secure & Encrypted */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secure & Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Termux Terminal Trigger */}
        <button
          type="button"
          aria-label="Open Termux CLI Terminal emulator"
          onClick={onOpenTerminal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-medium shadow-sm transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Termux CLI</span>
        </button>

        {/* History drawer trigger */}
        <button
          type="button"
          aria-label="View search history"
          onClick={onOpenHistory}
          className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs font-medium transition-all"
        >
          <History className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">History</span>
          {historyCount > 0 && (
            <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-purple-500 text-[10px] font-bold text-white">
              {historyCount}
            </span>
          )}
        </button>

        {/* Download Termux Project ZIP */}
        <button
          type="button"
          aria-label="Download Termux Python Project ZIP package"
          onClick={onOpenDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-purple-900/30 transition-all hover:shadow-purple-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Download Termux Code</span>
        </button>

        {/* Version Pill */}
        <div className="flex items-center px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
          v1.0.0
        </div>
      </div>
    </header>
  );
};
