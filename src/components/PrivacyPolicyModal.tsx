import React from 'react';
import { Shield, X, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-lg bg-[#0c1224] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b16]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Privacy Policy</h3>
              <p className="text-xs text-slate-400">Your Privacy Our Priority</p>
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
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3">
            <Lock className="w-6 h-6 text-cyan-400 shrink-0" />
            <span className="text-xs text-cyan-200">
              No personal data or lookup queries are uploaded or logged to external servers. All operations happen client-side and locally.
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">1. Phone Lookup Analysis</span>
                <span className="text-xs text-slate-400">
                  Phone numbers entered into SOHAG Tracker are analyzed strictly according to the ITU-T E.164 recommendation using national numbering plan registries. The application reveals carrier allocation and area jurisdiction without tracking or eavesdropping on handset conversations.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">2. User-Authorized GPS Sharing</span>
                <span className="text-xs text-slate-400">
                  Geolocation is never requested secretly. Coordinates are accessed strictly from your browser or device through the W3C Geolocation API or Android Termux API upon explicit permission. You can stop sharing at any instant.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">3. Local Storage Only</span>
                <span className="text-xs text-slate-400">
                  Search history and preferences are saved exclusively in your browser's <code className="text-cyan-300">localStorage</code> or the Termux CLI <code className="text-cyan-300">lookup_history.json</code> file. You maintain 100% control to export or erase your history.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">4. No Malicious Payloads</span>
                <span className="text-xs text-slate-400">
                  SOHAG Tracker is 100% open-source under the MIT license with complete transparent Python and TypeScript code.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#070b16] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
