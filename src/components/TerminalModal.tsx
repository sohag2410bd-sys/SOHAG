import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Maximize2, Minimize2, Copy, Check, Download, RefreshCw, Sparkles, Send } from 'lucide-react';
import { TermuxEngine, TerminalLine, MenuState } from '../utils/termuxSimulator';
import { HistoryRecord } from '../types';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onOpenDownload: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenDownload,
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [menuState, setMenuState] = useState<MenuState>('MENU');
  const [inputValue, setInputValue] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const engineRef = useRef<TermuxEngine | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new TermuxEngine(history, (newLines, state) => {
        setLines(newLines);
        setMenuState(state);
      });
    } else {
      engineRef.current.updateHistory(history);
    }
  }, [history]);

  // Auto-scroll on output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!engineRef.current) return;
    const cmd = inputValue;
    setInputValue('');
    engineRef.current.handleInput(cmd);
  };

  const handleQuickCommand = (cmd: string) => {
    if (!engineRef.current) return;
    engineRef.current.handleInput(cmd);
  };

  const termuxInstallCmd = 'pkg update -y && pkg install git python termux-api -y && git clone https://github.com/sohag2410bd/sohag-tracker.git && cd sohag-tracker && pip install -r requirements.txt && python main.py';

  const copyTermuxCmd = () => {
    navigator.clipboard.writeText(termuxInstallCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`relative flex flex-col w-full bg-[#070b16] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'h-full max-w-full' : 'max-w-4xl h-[85vh]'
        }`}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d1424] border-b border-cyan-500/20 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer" onClick={() => engineRef.current?.reset()} />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer" onClick={() => setIsFullScreen(!isFullScreen)} />
            </div>

            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200">
              Android Termux CLI — python main.py
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick copy termux one-liner */}
            <button
              type="button"
              onClick={copyTermuxCmd}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700"
              title="Copy Android Termux 1-line installation command"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Copied Command!' : 'Copy Termux Run Cmd'}</span>
            </button>

            {/* Download Zip */}
            <button
              type="button"
              onClick={onOpenDownload}
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors"
              title="Download Source Code (.ZIP)"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              type="button"
              aria-label="Restart terminal"
              onClick={() => engineRef.current?.reset()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              title="Restart Terminal Session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              aria-label="Toggle fullscreen"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              type="button"
              aria-label="Close terminal modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Access Function Buttons */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto text-xs font-mono">
          <span className="text-slate-500 mr-1 text-[11px]">Quick:</span>
          <button
            type="button"
            onClick={() => handleQuickCommand('1')}
            className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300 hover:bg-purple-900"
          >
            [1] Phone
          </button>
          <button
            type="button"
            onClick={() => handleQuickCommand('2')}
            className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
          >
            [2] IP
          </button>
          <button
            type="button"
            onClick={() => handleQuickCommand('3')}
            className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900"
          >
            [3] GPS
          </button>
          <button
            type="button"
            onClick={() => handleQuickCommand('4')}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            [4] History
          </button>
          <button
            type="button"
            onClick={() => handleQuickCommand('5')}
            className="px-2 py-0.5 rounded bg-yellow-950/70 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-900"
          >
            [5] Settings
          </button>
          <button
            type="button"
            onClick={() => handleQuickCommand('6')}
            className="px-2 py-0.5 rounded bg-pink-950/70 border border-pink-500/40 text-pink-300 hover:bg-pink-900"
          >
            [6] About
          </button>
          <button
            type="button"
            onClick={() => handleQuickCommand('clear')}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>

        {/* Scrollable Terminal Screen */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs sm:text-sm space-y-1 scanlines select-text"
          style={{ backgroundColor: '#050811' }}
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap leading-relaxed ${
                line.type === 'banner' ? 'font-bold' : ''
              }`}
              style={{ color: line.color || '#e2e8f0' }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-3 bg-[#0a101d] border-t border-cyan-500/20"
        >
          <div className="flex items-center text-cyan-400 font-mono text-xs sm:text-sm font-bold pl-2 select-none">
            sohag@tracker:~#
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              menuState === 'PHONE_INPUT'
                ? 'Type phone number with country code...'
                : menuState === 'IP_INPUT'
                ? 'Type IP address or leave empty for public IP...'
                : 'Enter 1-6 or 0...'
            }
            aria-label="Termux terminal command input"
            className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-cyan-200 font-mono focus:outline-none placeholder-slate-600"
          />

          <button
            type="submit"
            aria-label="Send command"
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <span>Execute</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
