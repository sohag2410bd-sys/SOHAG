import React, { useState } from 'react';
import { History, X, Trash2, Download, PhoneCall, Globe, MapPin, Copy, Check } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PHONE' | 'IP' | 'GPS'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = history.filter((item) => filter === 'ALL' || item.type === filter);

  const exportHistoryAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sohag-lookup-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyItemQuery = (query: string, id: string) => {
    navigator.clipboard.writeText(query);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0a0f20] border-l border-slate-800 flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#070b16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Search History</h3>
              <p className="text-[11px] text-slate-400">
                {history.length} lookups stored locally on your device
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close history drawer"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['ALL', 'PHONE', 'IP', 'GPS'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500">
              <History className="w-8 h-8 stroke-1 mb-2 text-slate-600" />
              <p className="text-xs">No records found for this filter.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isPhone = item.type === 'PHONE';
              const isIp = item.type === 'IP';
              const Icon = isPhone ? PhoneCall : isIp ? Globe : MapPin;
              const badgeBg = isPhone ? 'bg-purple-950 text-purple-400 border-purple-500/30' : isIp ? 'bg-cyan-950 text-cyan-400 border-cyan-500/30' : 'bg-emerald-950 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${badgeBg}`}>
                          {item.type}
                        </span>
                        <span className="text-xs font-mono font-bold text-white truncate">
                          {item.query}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.summary}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Copy query"
                    onClick={() => copyItemQuery(item.query, item.id)}
                    className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white shrink-0 opacity-80 group-hover:opacity-100"
                    title="Copy query text"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-[#070b16] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={exportHistoryAsJson}
            disabled={history.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-medium transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
