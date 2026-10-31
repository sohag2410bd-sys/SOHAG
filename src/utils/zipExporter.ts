import JSZip from 'jszip';

export async function exportTermuxProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'main.py',
    `#!/usr/bin/env python3
"""
SOHAG Mobile Number Tracker — Termux & Linux CLI Edition
Track • Locate • Secure
Author: Sohag Ali (sohag2410bd@gmail.com)
"""
import os, sys, time
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from app.colors import Colors
from app.banner import print_banner, print_section
from app.tracker import lookup_phone_number
from app.ip_lookup import lookup_ip_address
from app.gps import get_termux_gps
from app.history import load_history, save_history_entry, clear_history
from app.config import APP_NAME, TAGLINE, VERSION, AUTHOR, CONTACT_EMAIL, GITHUB_REPO

def clear_screen():
    os.system("clear" if os.name != "nt" else "cls")

def wait_for_enter():
    print(f"\\n{Colors.GRAY}Press Enter to return to main menu...{Colors.RESET}", end="")
    try: input()
    except: pass

def handle_phone_lookup():
    clear_screen()
    print_banner()
    print_section("1. Phone Number Lookup", Colors.NEON_PURPLE)
    print(f"{Colors.WHITE}Enter international phone number with country code:{Colors.RESET}")
    print(f"{Colors.GRAY}Examples: +8801712345678, +15551234567, +447700900123{Colors.RESET}")
    try:
        raw_number = input(f"\\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip()
    except: return
    if not raw_number:
        print(f"{Colors.RED}❌ No number entered.{Colors.RESET}")
        wait_for_enter(); return
    print(f"\\n{Colors.YELLOW}⏳ Analyzing number format and carrier allocation...{Colors.RESET}")
    time.sleep(0.4)
    result = lookup_phone_number(raw_number)
    if not result.get("success"):
        print(f"\\n{Colors.RED}❌ Error: {result.get('error', 'Lookup failed')}{Colors.RESET}")
    else:
        print(f"\\n{Colors.NEON_GREEN}✓ Lookup Successful!{Colors.RESET}\\n")
        print(f"{Colors.PURPLE}╔══════════════════════════════════════════════════════════════╗{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.BOLD} {Colors.WHITE}PHONE NUMBER ANALYSIS RESULT{Colors.RESET}{' ' * 32}{Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}╠══════════════════════════════════════════════════════════════╣{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}International:{Colors.RESET} {result.get('international', 'N/A'):<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}National:{Colors.RESET}      {result.get('national', 'N/A'):<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}E.164 Standard:{Colors.RESET}{result.get('e164', 'N/A'):<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}Country:{Colors.RESET}       {result.get('country_name', 'N/A')} ({result.get('country_code', '')}) {result.get('flag', ''):<25} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}Carrier/Telco:{Colors.RESET} {result.get('carrier', 'N/A'):<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}Line Type:{Colors.RESET}     {result.get('line_type', 'N/A'):<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}Validity:{Colors.RESET}      {'Valid Number (Active Scheme)' if result.get('is_valid') else 'Possible / Unassigned':<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}║{Colors.RESET} {Colors.CYAN}Timezone(s):{Colors.RESET}   {', '.join(result.get('timezones', ['UTC']))[:43]:<43} {Colors.PURPLE}║{Colors.RESET}")
        print(f"{Colors.PURPLE}╚══════════════════════════════════════════════════════════════╝{Colors.RESET}")
        print(f"\\n{Colors.GRAY}🔒 Disclaimer: {result.get('disclaimer')}{Colors.RESET}")
        save_history_entry("PHONE", result.get("e164", raw_number), result)
    wait_for_enter()

def handle_ip_lookup():
    clear_screen()
    print_banner()
    print_section("2. IP Information Lookup", Colors.CYAN)
    print(f"{Colors.WHITE}Enter target IP address (or press ENTER for self public IP):{Colors.RESET}")
    try:
        ip_query = input(f"\\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip()
    except: return
    print(f"\\n{Colors.YELLOW}⏳ Querying global IP routing & geolocation registry...{Colors.RESET}")
    time.sleep(0.4)
    result = lookup_ip_address(ip_query)
    if not result.get("success"):
        print(f"\\n{Colors.RED}❌ Error: {result.get('error')}{Colors.RESET}")
    else:
        print(f"\\n{Colors.NEON_GREEN}✓ IP Information Retrieved!{Colors.RESET}\\n")
        print(f"{Colors.CYAN}Target IP:    {result.get('ip')}{Colors.RESET}")
        print(f"{Colors.CYAN}Location:     {result.get('city')}, {result.get('region')}, {result.get('country')}{Colors.RESET}")
        print(f"{Colors.CYAN}ISP/Org:      {result.get('isp')} ({result.get('asn')}){Colors.RESET}")
        print(f"{Colors.CYAN}Coordinates:  {result.get('latitude')}, {result.get('longitude')}{Colors.RESET}")
        print(f"{Colors.GRAY}Google Maps:  https://www.google.com/maps?q={result.get('latitude')},{result.get('longitude')}{Colors.RESET}")
        save_history_entry("IP", result.get("ip", ip_query), result)
    wait_for_enter()

def handle_gps_location():
    clear_screen()
    print_banner()
    print_section("3. GPS Location (User-Authorized)", Colors.NEON_GREEN)
    gps_res = get_termux_gps()
    if gps_res.get("available"):
        print(f"{Colors.NEON_GREEN}✓ Coordinates: Lat {gps_res.get('latitude')}, Lon {gps_res.get('longitude')}{Colors.RESET}")
        print(f"{Colors.WHITE}Map: {gps_res.get('maps_url')}{Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}Notice: {gps_res.get('reason')}{Colors.RESET}")
        print(f"{Colors.WHITE}Install Termux API: pkg install termux-api -y{Colors.RESET}")
    wait_for_enter()

def handle_history():
    clear_screen()
    print_banner()
    print_section("4. Lookup History", Colors.NEON_CYAN)
    h = load_history()
    if not h: print(f"{Colors.YELLOW}No search records found yet.{Colors.RESET}")
    else:
        for i, item in enumerate(h[:15], 1):
            print(f"[{i:02d}] [{item.get('type')}] {item.get('query')} - {item.get('summary')}")
    wait_for_enter()

def handle_settings():
    clear_screen()
    print_banner()
    print_section("5. Settings", Colors.YELLOW)
    print(f"App: {APP_NAME} v{VERSION} | Author: {AUTHOR}")
    wait_for_enter()

def handle_about():
    clear_screen()
    print_banner()
    print_section("6. About & Ethics", Colors.MAGENTA)
    print(f"{APP_NAME} by {AUTHOR} ({CONTACT_EMAIL})")
    print(f"Open Source under MIT License.")
    wait_for_enter()

def main():
    while True:
        clear_screen()
        print_banner()
        print(f"  [1] Phone Number Lookup\\n  [2] IP Information Lookup\\n  [3] GPS Location\\n  [4] Lookup History\\n  [5] Settings\\n  [6] About\\n  [0] Exit")
        try:
            choice = input(f"\\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip()
        except: sys.exit(0)
        if choice == "1": handle_phone_lookup()
        elif choice == "2": handle_ip_lookup()
        elif choice == "3": handle_gps_location()
        elif choice == "4": handle_history()
        elif choice == "5": handle_settings()
        elif choice == "6": handle_about()
        elif choice == "0": sys.exit(0)

if __name__ == "__main__":
    main()
`
  );

  zip.file(
    'requirements.txt',
    `phonenumbers>=8.13.0
requests>=2.31.0
`
  );

  zip.file(
    'LICENSE',
    `MIT License
Copyright (c) 2026 Sohag Ali
`
  );

  zip.file(
    'README.md',
    `# SOHAG Mobile Number Tracker — Termux Edition
Track • Locate • Secure

Run in Termux:
pkg update -y && pkg install python git termux-api -y
pip install -r requirements.txt
python main.py
`
  );

  // App directory
  const appFolder = zip.folder('app');
  if (appFolder) {
    appFolder.file(
      '__init__.py',
      `__version__ = "1.0.0"\n__author__ = "Sohag Ali"`
    );
    appFolder.file(
      'colors.py',
      `class Colors:
    RESET = "\\033[0m"
    BOLD = "\\033[1m"
    CYAN = "\\033[38;5;51m"
    NEON_CYAN = "\\033[38;5;87m"
    PURPLE = "\\033[38;5;141m"
    NEON_PURPLE = "\\033[38;5;177m"
    GREEN = "\\033[38;5;48m"
    NEON_GREEN = "\\033[38;5;49m"
    YELLOW = "\\033[38;5;227m"
    RED = "\\033[38;5;196m"
    WHITE = "\\033[38;5;255m"
    GRAY = "\\033[38;5;244m"
    DARK_GRAY = "\\033[38;5;238m"
`
    );
    appFolder.file(
      'banner.py',
      `from app.colors import Colors
BANNER = f"""{Colors.NEON_CYAN}
  ███████╗ ██████╗ ██╗  ██╗ █████╗  ██████╗ 
  ██╔════╝██╔═══██╗██║  ██║██╔══██╗██╔════╝ 
  ███████╗██║   ██║███████║███████║██║  ███╗
  ╚════██║██║   ██║██╔══██║██╔══██║██║   ██║
  ███████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ 
{Colors.NEON_PURPLE}  ▶ MOBILE NUMBER TRACKER ◀{Colors.RESET}
{Colors.NEON_GREEN}  Track • Locate • Secure • Termux Edition v1.0.0{Colors.RESET}
"""
def print_banner():
    print(BANNER)
def print_section(title, color=Colors.NEON_CYAN):
    print(f"\\n{color}{Colors.BOLD}▶ {title.upper()}{Colors.RESET}")
`
    );
    appFolder.file(
      'config.py',
      `APP_NAME = "SOHAG Mobile Number Tracker"
TAGLINE = "Track • Locate • Secure"
VERSION = "1.0.0"
AUTHOR = "Sohag Ali"
CONTACT_EMAIL = "sohag2410bd@gmail.com"
GITHUB_REPO = "https://github.com/sohag2410bd/sohag-tracker"
`
    );
  }

  // Scripts directory
  const scriptsFolder = zip.folder('scripts');
  if (scriptsFolder) {
    scriptsFolder.file(
      'termux_install.sh',
      `#!/data/data/com.termux/files/usr/bin/bash
pkg update -y
pkg install python git termux-api -y
pip install -r requirements.txt
python main.py
`
    );
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename = 'sohag-mobile-tracker-termux.zip') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
