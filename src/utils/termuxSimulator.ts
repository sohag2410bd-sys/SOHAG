import { parseNumberDetails } from './phoneTracker';
import { lookupIp } from './ipTracker';
import { HistoryRecord } from '../types';

export interface TerminalLine {
  id: string;
  type: 'output' | 'input' | 'banner' | 'system' | 'error' | 'success';
  text: string;
  color?: string;
}

export type MenuState =
  | 'MENU'
  | 'PHONE_INPUT'
  | 'IP_INPUT'
  | 'GPS_VIEW'
  | 'HISTORY_VIEW'
  | 'SETTINGS_VIEW'
  | 'ABOUT_VIEW';

export class TermuxEngine {
  private state: MenuState = 'MENU';
  private lines: TerminalLine[] = [];
  private history: HistoryRecord[] = [];
  private onUpdate: (lines: TerminalLine[], state: MenuState) => void;

  constructor(
    initialHistory: HistoryRecord[],
    onUpdate: (lines: TerminalLine[], state: MenuState) => void
  ) {
    this.history = initialHistory;
    this.onUpdate = onUpdate;
    this.reset();
  }

  public updateHistory(newHistory: HistoryRecord[]) {
    this.history = newHistory;
  }

  public reset() {
    this.state = 'MENU';
    this.lines = [
      {
        id: 'b1',
        type: 'banner',
        text: `  ███████╗ ██████╗ ██╗  ██╗ █████╗  ██████╗ 
  ██╔════╝██╔═══██╗██║  ██║██╔══██╗██╔════╝ 
  ███████╗██║   ██║███████║███████║██║  ███╗
  ╚════██║██║   ██║██╔══██║██╔══██║██║   ██║
  ███████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ `,
        color: '#22d3ee',
      },
      {
        id: 'b2',
        type: 'system',
        text: '▶ MOBILE NUMBER TRACKER ◀',
        color: '#c084fc',
      },
      {
        id: 'b3',
        type: 'system',
        text: 'Track • Locate • Secure • Termux CLI Edition v1.0.0',
        color: '#34d399',
      },
      {
        id: 'b4',
        type: 'system',
        text: 'Author: Sohag Ali | sohag2410bd@gmail.com',
        color: '#94a3b8',
      },
      {
        id: 'b5',
        type: 'system',
        text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        color: '#334155',
      },
      {
        id: 'm0',
        type: 'output',
        text: 'Select an option from the menu:',
        color: '#f8fafc',
      },
      { id: 'm1', type: 'output', text: '  [1] Phone Number Lookup      (Carrier, Country, Validity)', color: '#c084fc' },
      { id: 'm2', type: 'output', text: '  [2] IP Information Lookup    (City, Country, ISP, ASN)', color: '#38bdf8' },
      { id: 'm3', type: 'output', text: '  [3] GPS Location             (Device Coordinates & Map)', color: '#34d399' },
      { id: 'm4', type: 'output', text: '  [4] Lookup History           (View saved results)', color: '#f1f5f9' },
      { id: 'm5', type: 'output', text: '  [5] Settings                 (Environment & Status)', color: '#facc15' },
      { id: 'm6', type: 'output', text: '  [6] About & Ethics           (Author & Documentation)', color: '#f472b6' },
      { id: 'm7', type: 'output', text: '  [0] Exit / Clear', color: '#f87171' },
    ];
    this.notify();
  }

  private addLine(line: Omit<TerminalLine, 'id'>) {
    this.lines.push({
      ...line,
      id: Math.random().toString(36).substring(2, 9),
    });
    // Keep max 200 lines
    if (this.lines.length > 200) {
      this.lines = this.lines.slice(this.lines.length - 200);
    }
  }

  private notify() {
    this.onUpdate([...this.lines], this.state);
  }

  public async handleInput(rawCommand: string) {
    const input = rawCommand.trim();
    this.addLine({ type: 'input', text: `sohag@tracker:~# ${input}`, color: '#22d3ee' });

    if (this.state === 'MENU') {
      switch (input) {
        case '1':
          this.state = 'PHONE_INPUT';
          this.addLine({ type: 'system', text: '\n▶ PHONE NUMBER LOOKUP', color: '#c084fc' });
          this.addLine({ type: 'output', text: 'Enter international phone number with country code:', color: '#f8fafc' });
          this.addLine({ type: 'system', text: 'Examples: +8801712345678, +15551234567, +447700900123', color: '#94a3b8' });
          break;
        case '2':
          this.state = 'IP_INPUT';
          this.addLine({ type: 'system', text: '\n▶ IP INFORMATION LOOKUP', color: '#38bdf8' });
          this.addLine({ type: 'output', text: 'Enter target IP address (or press ENTER to auto-detect your public IP):', color: '#f8fafc' });
          this.addLine({ type: 'system', text: 'Examples: 8.8.8.8, 1.1.1.1, 103.145.118.1', color: '#94a3b8' });
          break;
        case '3':
          this.state = 'GPS_VIEW';
          this.addLine({ type: 'system', text: '\n▶ GPS LOCATION (USER-AUTHORIZED)', color: '#34d399' });
          this.addLine({ type: 'output', text: 'Checking Termux / browser hardware location sensor...', color: '#f8fafc' });
          this.executeGps();
          break;
        case '4':
          this.showHistory();
          break;
        case '5':
          this.showSettings();
          break;
        case '6':
          this.showAbout();
          break;
        case '0':
          this.addLine({ type: 'success', text: 'Resetting session terminal...', color: '#34d399' });
          setTimeout(() => this.reset(), 400);
          return;
        case 'clear':
        case 'cls':
          this.lines = [];
          this.notify();
          return;
        case 'help':
          this.addLine({ type: 'system', text: 'Commands: 1 (Phone), 2 (IP), 3 (GPS), 4 (History), 5 (Settings), 6 (About), 0 (Exit), clear', color: '#facc15' });
          break;
        default:
          this.addLine({ type: 'error', text: `Unknown option "${input}". Select 1-6 or 0 to exit.`, color: '#f87171' });
          break;
      }
      this.notify();
      return;
    }

    if (this.state === 'PHONE_INPUT') {
      if (!input) {
        this.addLine({ type: 'error', text: 'No number entered. Returning to main menu.', color: '#f87171' });
        this.state = 'MENU';
        this.promptMenuReturn();
        return;
      }

      this.addLine({ type: 'system', text: '⏳ Analyzing number format and telecom carrier...', color: '#facc15' });
      const parsed = parseNumberDetails(input);

      if (!parsed.success || !parsed.data) {
        this.addLine({ type: 'error', text: `❌ ${parsed.error || 'Lookup failed'}`, color: '#f87171' });
      } else {
        const d = parsed.data;
        this.addLine({ type: 'success', text: '✓ Lookup Successful!', color: '#34d399' });
        this.addLine({ type: 'output', text: '┌────────────────────────────────────────────────────────────┐', color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ International:  ${d.international}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ National:       ${d.national}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ E.164 Standard: ${d.e164}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ Country:        ${d.countryName} (${d.countryCode}) ${d.flag}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ Carrier:        ${d.carrier}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ Line Type:      ${d.lineType}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ Validity:       ${d.isValid ? 'Valid Active Format' : 'Possible Number'}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: `│ Timezone:       ${d.timezones.join(', ')}`, color: '#c084fc' });
        this.addLine({ type: 'output', text: '└────────────────────────────────────────────────────────────┘', color: '#c084fc' });
        this.addLine({ type: 'system', text: `🔒 ${d.disclaimer}`, color: '#94a3b8' });
      }
      this.state = 'MENU';
      this.promptMenuReturn();
      return;
    }

    if (this.state === 'IP_INPUT') {
      this.addLine({ type: 'system', text: '⏳ Querying global IP routing registry...', color: '#facc15' });
      const res = await lookupIp(input);
      if (!res.success || !res.data) {
        this.addLine({ type: 'error', text: `❌ ${res.error || 'IP lookup failed'}`, color: '#f87171' });
      } else {
        const d = res.data;
        this.addLine({ type: 'success', text: '✓ IP Information Retrieved!', color: '#34d399' });
        this.addLine({ type: 'output', text: '┌────────────────────────────────────────────────────────────┐', color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ Target IP:    ${d.ip}`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ City/Region:  ${d.city}, ${d.region}`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ Country:      ${d.country} ${d.flag}`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ ISP Provider: ${d.isp}`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ Autonomous:   ${d.asn} (${d.org})`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ Coordinates:  Lat ${d.latitude}, Lon ${d.longitude}`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: `│ Timezone:     ${d.timezone}`, color: '#38bdf8' });
        this.addLine({ type: 'output', text: '└────────────────────────────────────────────────────────────┘', color: '#38bdf8' });
        this.addLine({ type: 'system', text: `📍 Maps: https://www.google.com/maps?q=${d.latitude},${d.longitude}`, color: '#94a3b8' });
      }
      this.state = 'MENU';
      this.promptMenuReturn();
      return;
    }

    if (['GPS_VIEW', 'HISTORY_VIEW', 'SETTINGS_VIEW', 'ABOUT_VIEW'].includes(this.state)) {
      this.state = 'MENU';
      this.promptMenuReturn();
    }
  }

  private executeGps() {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          const acc = Math.round(pos.coords.accuracy);
          this.addLine({ type: 'success', text: '✓ GPS Hardware Sensor Signal Locked!', color: '#34d399' });
          this.addLine({ type: 'output', text: `  Latitude:   ${lat}`, color: '#34d399' });
          this.addLine({ type: 'output', text: `  Longitude:  ${lon}`, color: '#34d399' });
          this.addLine({ type: 'output', text: `  Accuracy:   ±${acc} meters`, color: '#34d399' });
          this.addLine({ type: 'system', text: `  Map Link:   https://www.google.com/maps?q=${lat},${lon}`, color: '#38bdf8' });
          this.promptMenuReturn();
        },
        (err) => {
          this.addLine({ type: 'error', text: `GPS notice: ${err.message}`, color: '#facc15' });
          this.addLine({ type: 'system', text: 'Termux note: Run "pkg install termux-api" for Android hardware GPS sensor access.', color: '#94a3b8' });
          this.promptMenuReturn();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      this.addLine({ type: 'error', text: 'Geolocation is not supported in this environment.', color: '#f87171' });
      this.promptMenuReturn();
    }
  }

  private showHistory() {
    this.addLine({ type: 'system', text: '\n▶ LOOKUP HISTORY', color: '#f1f5f9' });
    if (!this.history || this.history.length === 0) {
      this.addLine({ type: 'output', text: 'No lookups recorded yet. Perform a Phone or IP lookup to see history.', color: '#94a3b8' });
    } else {
      this.addLine({ type: 'output', text: `Found ${this.history.length} saved entries:`, color: '#f8fafc' });
      this.history.slice(0, 10).forEach((item, idx) => {
        const color = item.type === 'PHONE' ? '#c084fc' : item.type === 'IP' ? '#38bdf8' : '#34d399';
        this.addLine({
          type: 'output',
          text: `[${(idx + 1).toString().padStart(2, '0')}] [${item.type}] ${item.query} — ${item.summary}`,
          color,
        });
      });
    }
    this.promptMenuReturn();
  }

  private showSettings() {
    this.addLine({ type: 'system', text: '\n▶ ENVIRONMENT & SETTINGS', color: '#facc15' });
    this.addLine({ type: 'output', text: '• Engine: SOHAG Mobile Number Tracker v1.0.0', color: '#f8fafc' });
    this.addLine({ type: 'output', text: '• Python Core: 3.10+ / Termux API compliant', color: '#f8fafc' });
    this.addLine({ type: 'output', text: '• Storage: Local client storage (Zero server telemetry)', color: '#34d399' });
    this.addLine({ type: 'output', text: '• Security Policy: Non-intrusive / Ethical telecom analysis', color: '#38bdf8' });
    this.promptMenuReturn();
  }

  private showAbout() {
    this.addLine({ type: 'system', text: '\n▶ ABOUT SOHAG TRACKER', color: '#f472b6' });
    this.addLine({ type: 'output', text: 'Developer: Sohag Ali', color: '#f8fafc' });
    this.addLine({ type: 'output', text: 'Email:     sohag2410bd@gmail.com', color: '#f8fafc' });
    this.addLine({ type: 'output', text: 'Tagline:   Track • Locate • Secure', color: '#34d399' });
    this.addLine({ type: 'system', text: 'Notice: Phone number queries resolve cellular carrier prefix allocations. Real-time GPS location requires user authorization.', color: '#94a3b8' });
    this.promptMenuReturn();
  }

  private promptMenuReturn() {
    this.addLine({ type: 'system', text: '\nPress [ENTER] or choose 1-6 / 0 to continue...', color: '#64748b' });
    this.notify();
  }
}
