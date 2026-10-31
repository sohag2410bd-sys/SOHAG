#!/usr/bin/env python3
"""
====================================================================
SOHAG Mobile Number Tracker — Termux & Linux CLI Edition
Track • Locate • Secure
Author: Sohag Ali (sohag2410bd@gmail.com)
====================================================================
"""

import os
import sys
import time

# Ensure app package is importable
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
    print(f"\n{Colors.GRAY}Press Enter to return to main menu...{Colors.RESET}", end="")
    try:
        input()
    except (KeyboardInterrupt, EOFError):
        pass

def handle_phone_lookup():
    clear_screen()
    print_banner()
    print_section("1. Phone Number Lookup", Colors.NEON_PURPLE)
    
    print(f"{Colors.WHITE}Enter international phone number with country code:{Colors.RESET}")
    print(f"{Colors.GRAY}Examples: +8801712345678, +15551234567, +447700900123{Colors.RESET}")
    
    try:
        raw_number = input(f"\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip()
    except (KeyboardInterrupt, EOFError):
        return
        
    if not raw_number:
        print(f"{Colors.RED}❌ No number entered.{Colors.RESET}")
        wait_for_enter()
        return
        
    print(f"\n{Colors.YELLOW}⏳ Analyzing number format and carrier allocation...{Colors.RESET}")
    time.sleep(0.4)
    
    result = lookup_phone_number(raw_number)
    
    if not result.get("success"):
        print(f"\n{Colors.RED}❌ Error: {result.get('error', 'Lookup failed')}{Colors.RESET}")
    else:
        print(f"\n{Colors.NEON_GREEN}✓ Lookup Successful!{Colors.RESET}\n")
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
        
        print(f"\n{Colors.GRAY}🔒 Disclaimer: {result.get('disclaimer')}{Colors.RESET}")
        
        # Save to history
        save_history_entry("PHONE", result.get("e164", raw_number), result)

    wait_for_enter()

def handle_ip_lookup():
    clear_screen()
    print_banner()
    print_section("2. IP Information Lookup", Colors.CYAN)
    
    print(f"{Colors.WHITE}Enter target IP address (or press ENTER to detect your public IP):{Colors.RESET}")
    print(f"{Colors.GRAY}Examples: 8.8.8.8, 1.1.1.1, 103.145.118.1{Colors.RESET}")
    
    try:
        ip_query = input(f"\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip()
    except (KeyboardInterrupt, EOFError):
        return
        
    print(f"\n{Colors.YELLOW}⏳ Querying global IP routing & geolocation registry...{Colors.RESET}")
    time.sleep(0.4)
    
    result = lookup_ip_address(ip_query)
    
    if not result.get("success"):
        print(f"\n{Colors.RED}❌ Error: {result.get('error', 'Failed to retrieve IP info')}{Colors.RESET}")
    else:
        print(f"\n{Colors.NEON_GREEN}✓ IP Information Retrieved!{Colors.RESET}\n")
        print(f"{Colors.CYAN}╔══════════════════════════════════════════════════════════════╗{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.BOLD} {Colors.WHITE}IP GEOLOCATION & NETWORK DETAILS{Colors.RESET}{' ' * 28}{Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}╠══════════════════════════════════════════════════════════════╣{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}Target IP:{Colors.RESET}     {result.get('ip', 'N/A'):<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}City/Region:{Colors.RESET}   {f\"{result.get('city', '')}, {result.get('region', '')}\":<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}Country:{Colors.RESET}       {f\"{result.get('country', '')} {result.get('flag', '')}\":<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}ISP Provider:{Colors.RESET}  {str(result.get('isp', 'N/A'))[:43]:<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}Organization:{Colors.RESET}  {str(result.get('org', 'N/A'))[:43]:<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}ASN Code:{Colors.RESET}      {str(result.get('asn', 'N/A')):<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}Coordinates:{Colors.RESET}   {f\"Lat: {result.get('latitude')}, Lon: {result.get('longitude')}\":<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}Postal Code:{Colors.RESET}   {str(result.get('postal', 'N/A')):<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}║{Colors.RESET} {Colors.NEON_PURPLE}Timezone:{Colors.RESET}      {str(result.get('timezone', 'UTC')):<43} {Colors.CYAN}║{Colors.RESET}")
        print(f"{Colors.CYAN}╚══════════════════════════════════════════════════════════════╝{Colors.RESET}")
        
        map_url = f"https://www.google.com/maps?q={result.get('latitude')},{result.get('longitude')}"
        print(f"\n{Colors.GRAY}📍 Map Preview: {Colors.UNDERLINE}{map_url}{Colors.RESET}")
        
        # Save to history
        save_history_entry("IP", result.get("ip", ip_query), result)

    wait_for_enter()

def handle_gps_location():
    clear_screen()
    print_banner()
    print_section("3. GPS Location (User-Authorized)", Colors.NEON_GREEN)
    
    print(f"{Colors.WHITE}Reading device GPS hardware status...{Colors.RESET}")
    print(f"{Colors.GRAY}Notice: SOHAG strictly adheres to privacy laws. Location is only{Colors.RESET}")
    print(f"{Colors.GRAY}shared from your own device with your explicit permission.{Colors.RESET}\n")
    
    gps_res = get_termux_gps()
    
    if gps_res.get("available"):
        lat = gps_res.get("latitude")
        lon = gps_res.get("longitude")
        acc = gps_res.get("accuracy")
        
        print(f"{Colors.NEON_GREEN}✓ Live GPS Sensor Signal Locked!{Colors.RESET}\n")
        print(f"{Colors.GREEN}╔══════════════════════════════════════════════════════════════╗{Colors.RESET}")
        print(f"{Colors.GREEN}║{Colors.BOLD} {Colors.WHITE}DEVICE GPS COORDINATES{Colors.RESET}{' ' * 38}{Colors.GREEN}║{Colors.RESET}")
        print(f"{Colors.GREEN}╠══════════════════════════════════════════════════════════════╣{Colors.RESET}")
        print(f"{Colors.GREEN}║{Colors.RESET} {Colors.NEON_CYAN}Latitude:{Colors.RESET}      {str(lat):<43} {Colors.GREEN}║{Colors.RESET}")
        print(f"{Colors.GREEN}║{Colors.RESET} {Colors.NEON_CYAN}Longitude:{Colors.RESET}     {str(lon):<43} {Colors.GREEN}║{Colors.RESET}")
        print(f"{Colors.GREEN}║{Colors.RESET} {Colors.NEON_CYAN}Accuracy:{Colors.RESET}      {f\"{acc} meters\":<43} {Colors.GREEN}║{Colors.RESET}")
        print(f"{Colors.GREEN}║{Colors.RESET} {Colors.NEON_CYAN}Provider:{Colors.RESET}      {str(gps_res.get('provider')):<43} {Colors.GREEN}║{Colors.RESET}")
        print(f"{Colors.GREEN}║{Colors.RESET} {Colors.NEON_CYAN}Timestamp:{Colors.RESET}     {str(gps_res.get('timestamp')):<43} {Colors.GREEN}║{Colors.RESET}")
        print(f"{Colors.GREEN}╚══════════════════════════════════════════════════════════════╝{Colors.RESET}")
        
        print(f"\n{Colors.WHITE}Map Links:{Colors.RESET}")
        print(f"  Google Maps:     {Colors.CYAN}{gps_res.get('maps_url')}{Colors.RESET}")
        print(f"  OpenStreetMap:   {Colors.CYAN}{gps_res.get('osm_url')}{Colors.RESET}")
        
        save_history_entry("GPS", f"{lat}, {lon}", {
            "summary": f"GPS Fix: {lat}, {lon} (±{acc}m)",
            "latitude": lat,
            "longitude": lon,
            "accuracy": acc
        })
    else:
        print(f"{Colors.YELLOW}⚠️  Termux GPS Sensor Not Accessible Directly in this Shell{Colors.RESET}")
        print(f"{Colors.GRAY}Reason: {gps_res.get('reason')}{Colors.RESET}\n")
        print(f"{Colors.WHITE}How to enable GPS in Android Termux:{Colors.RESET}")
        print(f"  1. Install Termux:API app from F-Droid.")
        print(f"  2. In Termux, run: {Colors.NEON_CYAN}pkg install termux-api -y{Colors.RESET}")
        print(f"  3. Grant Android Location permission to Termux & Termux:API.")
        print(f"  4. Re-run {Colors.NEON_CYAN}python main.py{Colors.RESET}\n")
        
        print(f"{Colors.PURPLE}Would you like an approximate location lookup via public IP instead? (y/n): {Colors.RESET}", end="")
        try:
            choice = input().strip().lower()
            if choice == "y":
                ip_res = lookup_ip_address()
                if ip_res.get("success"):
                    print(f"\n{Colors.NEON_GREEN}✓ IP Approximate Location:{Colors.RESET}")
                    print(f"  City:    {ip_res.get('city')}, {ip_res.get('country')}")
                    print(f"  Coords:  {ip_res.get('latitude')}, {ip_res.get('longitude')}")
                    print(f"  ISP:     {ip_res.get('isp')}")
                    print(f"  Map:     https://www.google.com/maps?q={ip_res.get('latitude')},{ip_res.get('longitude')}")
        except Exception:
            pass

    wait_for_enter()

def handle_history():
    clear_screen()
    print_banner()
    print_section("4. Lookup History", Colors.NEON_CYAN)
    
    history = load_history()
    if not history:
        print(f"{Colors.YELLOW}No search records found yet.{Colors.RESET}")
        wait_for_enter()
        return
        
    print(f"{Colors.WHITE}Found {len(history)} recent lookups:{Colors.RESET}\n")
    for i, item in enumerate(history[:15], 1):
        record_type = item.get("type", "RECORD")
        badge_color = Colors.NEON_PURPLE if record_type == "PHONE" else Colors.NEON_CYAN if record_type == "IP" else Colors.NEON_GREEN
        print(f"[{i:02d}] {badge_color}[{record_type:<5}]{Colors.RESET} {Colors.WHITE}{item.get('query'):<20}{Colors.RESET} {Colors.GRAY}{item.get('timestamp')}{Colors.RESET}")
        print(f"     ↳ {Colors.DIM}{item.get('summary')}{Colors.RESET}")
        
    print(f"\n{Colors.WHITE}Options:{Colors.RESET}")
    print(f"  [C] Clear History")
    print(f"  [ENTER] Return to menu")
    
    try:
        opt = input(f"\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip().upper()
        if opt == "C":
            clear_history()
            print(f"{Colors.NEON_GREEN}✓ Search history cleared.{Colors.RESET}")
            time.sleep(1)
    except Exception:
        pass

def handle_settings():
    clear_screen()
    print_banner()
    print_section("5. Settings & Environment", Colors.YELLOW)
    
    print(f"{Colors.WHITE}System Environment Configuration:{Colors.RESET}\n")
    print(f"  • Application:        {Colors.NEON_CYAN}{APP_NAME}{Colors.RESET}")
    print(f"  • Version:            {Colors.NEON_GREEN}v{VERSION}{Colors.RESET}")
    print(f"  • Runtime:            {sys.version.split()[0]} ({sys.platform})")
    print(f"  • Termux API:         {'Detected' if os.path.exists('/data/data/com.termux') else 'External Shell / Linux'}")
    print(f"  • History Logging:    {Colors.NEON_GREEN}Active (lookup_history.json){Colors.RESET}")
    print(f"  • Safety Mode:        {Colors.NEON_GREEN}Enforced (Ethical Tracking Only){Colors.RESET}")
    
    print(f"\n{Colors.WHITE}Recommended Packages:{Colors.RESET}")
    print(f"  pip install phonenumbers requests")
    print(f"  pkg install termux-api (For Android GPS)")
    
    wait_for_enter()

def handle_about():
    clear_screen()
    print_banner()
    print_section("6. About & Ethical Standards", Colors.MAGENTA)
    
    print(f"{Colors.BOLD}{Colors.WHITE}{APP_NAME}{Colors.RESET}")
    print(f"{Colors.NEON_GREEN}Tagline: {TAGLINE}{Colors.RESET}")
    print(f"{Colors.GRAY}Version {VERSION} • Open Source Privacy Tool{Colors.RESET}\n")
    
    print(f"{Colors.CYAN}Lead Developer:{Colors.RESET}  {AUTHOR}")
    print(f"{Colors.CYAN}Email Contact:{Colors.RESET}   {CONTACT_EMAIL}")
    print(f"{Colors.CYAN}Official Repo:{Colors.RESET}   {GITHUB_REPO}\n")
    
    print(f"{Colors.NEON_PURPLE}Ethical Usage & Telecommunications Reality:{Colors.RESET}")
    print(f"{Colors.WHITE}1. Phone numbers are digital addresses allocated by national regulatory")
    print(f"   bodies (e.g. BTRC in Bangladesh, FCC in USA, Ofcom in UK).")
    print(f"2. A phone number resolves to country prefix, network carrier code,")
    print(f"   and geographic area code.")
    print(f"3. Real-time satellite GPS tracking of a phone number cannot be legally")
    print(f"   performed without subscriber consent or cellular tower lawful intercept.")
    print(f"4. SOHAG Tracker empowers users with real, transparent telecommunication")
    print(f"   metadata and self-authorized GPS sharing.{Colors.RESET}")
    
    wait_for_enter()

def main():
    while True:
        clear_screen()
        print_banner()
        
        print(f"{Colors.WHITE}Select an option from the menu:{Colors.RESET}\n")
        print(f"  {Colors.NEON_PURPLE}[1]{Colors.RESET} Phone Number Lookup      {Colors.GRAY}(Carrier, Country, Validity){Colors.RESET}")
        print(f"  {Colors.CYAN}[2]{Colors.RESET} IP Information Lookup    {Colors.GRAY}(City, Country, ISP, ASN){Colors.RESET}")
        print(f"  {Colors.NEON_GREEN}[3]{Colors.RESET} GPS Location             {Colors.GRAY}(Device Coordinates & Map){Colors.RESET}")
        print(f"  {Colors.WHITE}[4]{Colors.RESET} Lookup History           {Colors.GRAY}(View saved results){Colors.RESET}")
        print(f"  {Colors.YELLOW}[5]{Colors.RESET} Settings                 {Colors.GRAY}(Environment & Status){Colors.RESET}")
        print(f"  {Colors.MAGENTA}[6]{Colors.RESET} About & Ethics           {Colors.GRAY}(Author & Documentation){Colors.RESET}")
        print(f"  {Colors.RED}[0]{Colors.RESET} Exit")
        
        try:
            choice = input(f"\n{Colors.NEON_CYAN}sohag@tracker:~# {Colors.RESET}").strip()
        except (KeyboardInterrupt, EOFError):
            print(f"\n\n{Colors.YELLOW}Exiting SOHAG Tracker. Stay safe!{Colors.RESET}")
            sys.exit(0)
            
        if choice == "1":
            handle_phone_lookup()
        elif choice == "2":
            handle_ip_lookup()
        elif choice == "3":
            handle_gps_location()
        elif choice == "4":
            handle_history()
        elif choice == "5":
            handle_settings()
        elif choice == "6":
            handle_about()
        elif choice == "0":
            print(f"\n{Colors.NEON_GREEN}Thank you for using SOHAG Mobile Number Tracker!{Colors.RESET}")
            print(f"{Colors.GRAY}Track • Locate • Secure{Colors.RESET}\n")
            sys.exit(0)
        else:
            print(f"{Colors.RED}❌ Invalid selection. Please choose 1-6 or 0 to exit.{Colors.RESET}")
            time.sleep(1)

if __name__ == "__main__":
    main()
