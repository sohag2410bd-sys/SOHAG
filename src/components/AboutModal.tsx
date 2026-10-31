import React from 'react';
import { Info, X, Shield, Terminal, Mail, Github, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-lg bg-[#0c1224] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b16]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">About SOHAG Tracker</h3>
              <p className="text-xs text-slate-400">Track • Locate • Secure</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-[75vh]">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>SOHAG Mobile Number Tracker v1.0.0</span>
            </h4>
            <p className="text-slate-400">
              A dual-engine platform featuring an Android Termux Python CLI and a responsive modern web dashboard for global phone number validation, cellular operator detection, user-authorized GPS location broadcasting, and network IP telemetry.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Ethical & Telecommunications Notice</span>
            </h5>
            <p className="text-slate-400 text-xs">
              This utility is designed for developers, penetration testers, telecom auditors, and cybersecurity researchers. It complies strictly with global privacy standards:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
              <li>Phone number lookups identify national number plan prefixes, allocated cellular carriers, and line formats.</li>
              <li>Handset GPS location is retrieved strictly from the current client device with explicit browser or Termux permission.</li>
              <li>Zero telemetry or search logs are uploaded to any remote server.</li>
            </ul>
          </div>

          {/* Author Details */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/20 space-y-2">
            <span className="text-xs font-bold text-purple-300 block">Lead Developer</span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold text-white">Sohag Ali</span>
                <span className="text-xs text-slate-400 block">Full-Stack & Python Systems Engineer</span>
              </div>
              <a
                href="mailto:sohag2410bd@gmail.com"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 text-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Sohag Ali
            </span>
            <a
              href="https://github.com/sohag2410bd/sohag-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:underline"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
