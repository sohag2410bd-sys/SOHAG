import React, { useState } from 'react';
import { Download, X, Copy, Check, Terminal, Github, Code, ExternalLink, ShieldCheck } from 'lucide-react';
import { exportTermuxProjectZip, triggerDownload } from '../utils/zipExporter';

interface TermuxDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermuxDownloadModal: React.FC<TermuxDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const blob = await exportTermuxProjectZip();
      triggerDownload(blob, 'sohag-mobile-number-tracker-termux.zip');
    } catch (err) {
      console.error('ZIP generation failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const termuxCommand = `pkg update -y && pkg install git python termux-api -y
git clone https://github.com/sohag2410bd/sohag-tracker.git
cd sohag-tracker
pip install -r requirements.txt
python main.py`;

  const githubPublishCmds = `# Initialize and push to your GitHub
git init
git add .
git commit -m "Initial release of SOHAG Mobile Number Tracker v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sohag-tracker.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-[#0c1224] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b16]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Download & Termux Installation
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-run Python CLI project for Android Termux & GitHub
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* 1. Download ZIP CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Complete Termux Project Archive</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Includes <code className="text-cyan-300">main.py</code>, <code className="text-cyan-300">requirements.txt</code>, <code className="text-cyan-300">app/</code>, <code className="text-cyan-300">scripts/</code>, and <code className="text-cyan-300">README.md</code>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-900/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .ZIP</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Termux Installation Guide */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>One-Click Android Termux Install Commands</span>
              </span>
              <button
                type="button"
                onClick={() => copyCode(termuxCommand, 'termux')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                {copiedKey === 'termux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'termux' ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed select-all">
              {termuxCommand}
            </pre>
          </div>

          {/* 3. GitHub Publication Instructions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Github className="w-4 h-4 text-white" />
                <span>Publish to GitHub (Steps for Developers)</span>
              </span>
              <button
                type="button"
                onClick={() => copyCode(githubPublishCmds, 'github')}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                {copiedKey === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'github' ? 'Copied!' : 'Copy Git Flow'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
              {githubPublishCmds}
            </pre>
          </div>

          {/* 4. Troubleshooting Guide */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <span className="font-bold text-amber-400 block">Termux Troubleshooting Tips:</span>
            <p>• If Termux says <code className="text-cyan-300">pip: command not found</code>, run: <code className="text-slate-100">pkg install python -y</code></p>
            <p>• For GPS sensor in Android, install <strong className="text-white">Termux:API</strong> from F-Droid and run <code className="text-slate-100">pkg install termux-api</code>.</p>
            <p>• In case of network errors in Termux, change repository mirror by executing <code className="text-slate-100">termux-change-repo</code>.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#070b16] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Open Source & Secure • No Root Required</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
