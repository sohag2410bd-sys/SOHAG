import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { QuickCards } from './components/QuickCards';
import { PhoneLookupCard } from './components/PhoneLookupCard';
import { GpsLocationCard } from './components/GpsLocationCard';
import { IpLookupCard } from './components/IpLookupCard';
import { TerminalModal } from './components/TerminalModal';
import { TermuxDownloadModal } from './components/TermuxDownloadModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AboutModal } from './components/AboutModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { HistoryRecord, PhoneLookupResult, IpLookupResult } from './types';

const STORAGE_KEY = 'sohag_lookup_history_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // References for scrolling into specific panels
  const phoneSectionRef = useRef<HTMLDivElement | null>(null);
  const gpsSectionRef = useRef<HTMLDivElement | null>(null);
  const ipSectionRef = useRef<HTMLDivElement | null>(null);

  // Search History State (persisted in localStorage)
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore parse error
    }
    return [
      {
        id: 'seed-1',
        type: 'PHONE',
        query: '+8801712345678',
        summary: '+880 1712-345678 (Bangladesh - Grameenphone)',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        details: {
          rawInput: '+8801712345678',
          isValid: true,
          isPossible: true,
          e164: '+8801712345678',
          international: '+880 1712-345678',
          national: '01712-345678',
          rfc3966: 'tel:+8801712345678',
          countryCode: '+880',
          countryName: 'Bangladesh',
          countryIso: 'BD',
          flag: '🇧🇩',
          carrier: 'Grameenphone (Telenor Group)',
          lineType: 'MOBILE',
          timezones: ['Asia/Dhaka (UTC+6)'],
          disclaimer: 'Standard regulatory carrier allocation.',
          timestamp: new Date().toISOString(),
        },
      },
      {
        id: 'seed-2',
        type: 'IP',
        query: '8.8.8.8',
        summary: '8.8.8.8 - Mountain View, United States (Google LLC)',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        details: {
          ip: '8.8.8.8',
          city: 'Mountain View',
          region: 'California',
          country: 'United States',
          countryCode: 'US',
          flag: '🇺🇸',
          postal: '94043',
          latitude: 37.422,
          longitude: -122.084,
          timezone: 'America/Los_Angeles',
          isp: 'Google LLC',
          org: 'Google DNS',
          asn: 'AS15169',
          timestamp: new Date().toISOString(),
        },
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  const handleSavePhoneHistory = (data: PhoneLookupResult) => {
    const entry: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'PHONE',
      query: data.e164,
      summary: `${data.international} (${data.countryName} - ${data.carrier})`,
      timestamp: new Date().toISOString(),
      details: data,
    };
    setHistory((prev) => [entry, ...prev.slice(0, 99)]);
  };

  const handleSaveIpHistory = (data: IpLookupResult) => {
    const entry: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'IP',
      query: data.ip,
      summary: `${data.ip} - ${data.city}, ${data.country} (${data.isp})`,
      timestamp: new Date().toISOString(),
      details: data,
    };
    setHistory((prev) => [entry, ...prev.slice(0, 99)]);
  };

  const handleSaveGpsHistory = (data: { latitude: number; longitude: number; accuracy: number; address?: string }) => {
    const entry: HistoryRecord = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'GPS',
      query: `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`,
      summary: data.address || `GPS Fix (±${data.accuracy}m)`,
      timestamp: new Date().toISOString(),
      details: data,
    };
    setHistory((prev) => [entry, ...prev.slice(0, 99)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleNavSelect = (tab: NavTab) => {
    setCurrentTab(tab);
    if (tab === 'termux') {
      setIsTerminalOpen(true);
    } else if (tab === 'history') {
      setIsHistoryOpen(true);
    } else if (tab === 'about') {
      setIsAboutOpen(true);
    } else if (tab === 'privacy') {
      setIsPrivacyOpen(true);
    } else if (tab === 'phone') {
      phoneSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'gps') {
      gpsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'ip') {
      ipSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavSelect}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          historyCount={history.length}
        />

        {/* Dashboard Main Workspace */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 space-y-7 max-w-7xl mx-auto w-full">
          {/* Hero Banner with Futuristic Holographic Smartphone Globe */}
          <HeroBanner
            onGetStarted={() => {
              phoneSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 4 Action Cards Matching Reference */}
          <QuickCards
            onSelectPhone={() => phoneSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            onSelectGps={() => gpsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            onSelectIp={() => ipSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            onSelectSecurity={() => setIsPrivacyOpen(true)}
          />

          {/* 3 Main Interactive Features Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Phone Number Lookup Card */}
            <div ref={phoneSectionRef} className="h-full">
              <PhoneLookupCard onSaveHistory={handleSavePhoneHistory} />
            </div>

            {/* 2. GPS Location Sharing Card */}
            <div ref={gpsSectionRef} className="h-full">
              <GpsLocationCard onSaveHistory={handleSaveGpsHistory} />
            </div>

            {/* 3. IP Information Lookup Card */}
            <div ref={ipSectionRef} className="h-full">
              <IpLookupCard onSaveHistory={handleSaveIpHistory} />
            </div>
          </div>
        </main>

        {/* Footer Matching Reference Layout */}
        <footer className="mt-auto px-4 sm:px-8 py-5 border-t border-slate-800/80 bg-[#070b16] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 <strong className="text-slate-200">SOHAG Mobile Number Tracker</strong>. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setIsTerminalOpen(true)}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Termux Help
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <span className="text-rose-500">❤️</span>
            <span>by</span>
            <a
              href="mailto:sohag2410bd@gmail.com"
              className="text-slate-200 font-semibold hover:text-cyan-400 transition-colors"
            >
              Sohag Ali
            </a>
          </div>
        </footer>
      </div>

      {/* Modals & Drawers */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        history={history}
        onOpenDownload={() => {
          setIsTerminalOpen(false);
          setIsDownloadOpen(true);
        }}
      />

      <TermuxDownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
