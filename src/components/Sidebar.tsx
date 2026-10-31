import React from 'react';
import {
  LayoutDashboard,
  PhoneCall,
  MapPin,
  Globe,
  Terminal,
  Shield,
  Info,
  Mail,
  Lock,
  Github,
  ArrowRight,
  X,
  History,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'phone'
  | 'gps'
  | 'ip'
  | 'termux'
  | 'history'
  | 'privacy'
  | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen = false,
  onClose,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'phone' as NavTab, label: 'Phone Lookup', icon: PhoneCall },
    { id: 'gps' as NavTab, label: 'GPS Location', icon: MapPin },
    { id: 'ip' as NavTab, label: 'IP Lookup', icon: Globe },
    { id: 'termux' as NavTab, label: 'Termux CLI', icon: Terminal, badge: 'Python' },
    { id: 'history' as NavTab, label: 'Lookup History', icon: History },
    { id: 'privacy' as NavTab, label: 'Privacy Policy', icon: Shield },
    { id: 'about' as NavTab, label: 'About', icon: Info },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-[#0a0e20] border-r border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand Logo */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              {/* Glowing Shield Logo Icon */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                <div className="w-full h-full bg-[#0a0e20] rounded-[10px] flex items-center justify-center">
                  <div className="relative">
                    <Shield className="w-6 h-6 text-purple-400 fill-purple-950/40" />
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute inset-0 m-auto" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  SOHAG
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Track • Locate • Secure
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onClose && (
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-transparent text-white border-l-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Email Contact link */}
            <a
              href="mailto:sohag2410bd@gmail.com"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 transition-all group"
            >
              <Mail className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              <span>Contact</span>
            </a>
          </nav>
        </div>

        {/* Bottom Cards: Privacy Card + Star on GitHub */}
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          {/* Privacy Card Matching Reference Image */}
          <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-purple-950/20 to-slate-950 border border-cyan-500/20 shadow-lg group">
            {/* Ambient glow behind lock */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-100">Your Privacy Our Priority</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                No data is stored on our server.
              </p>
            </div>
          </div>

          {/* Star on GitHub Card Matching Reference */}
          <a
            href="https://github.com/sohag2410bd/sohag-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Github className="w-4 h-4 text-white" />
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">Star on GitHub</div>
                <div className="text-[10px] text-slate-400">3.2k+ Stars</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </aside>
    </>
  );
};
