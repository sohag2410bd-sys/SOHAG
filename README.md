# SOHAG Mobile Number Tracker 📱🔍

> **Track • Locate • Secure**  
> Professional mobile number validation, carrier allocation lookup, user-authorized GPS location sharing, and IP network intelligence. Compatible with Android Termux (no root required) and modern web browsers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.8+](https://img.shields.io/badge/Python-3.8+-brightgreen.svg)](https://www.python.org/)
[![Termux](https://img.shields.io/badge/Platform-Termux%20%7C%20Linux%20%7C%20Web-purple.svg)]()
[![Security](https://img.shields.io/badge/Privacy-100%25%20Client--Side-cyan.svg)]()

---

## 🌟 Highlights

- **Phone Number Lookup**: International standard validation (E.164, National, RFC3966), country & dial code detection, cellular carrier operator identification, line type (Mobile, Fixed Line, VoIP), and timezones.
- **GPS Location**: Real user-authorized device coordinates (Latitude, Longitude, Accuracy), interactive OpenStreetMap / Google Maps integration, and reverse address geocoding.
- **IP Information Lookup**: Public IP intelligence including City, Region, Country, ISP provider, Organization, and Autonomous System Number (ASN).
- **Termux CLI Native**: 100% operational in Android Termux without root privileges via `python main.py`.
- **Search History**: Local storage of previous lookups with export to JSON/CSV.
- **Privacy & Ethical First**: Zero server logging, transparent telecommunications analysis, no fake tracking claims.

---

## 🚀 Quick Start in Android Termux

Install and launch directly in Android Termux with one command:

```bash
# Step 1: Open Termux and run
pkg update -y && pkg install git python termux-api -y

# Step 2: Clone repository
git clone https://github.com/sohag2410bd/sohag-tracker.git
cd sohag-tracker

# Step 3: Install Python dependencies
pip install -r requirements.txt

# Step 4: Run the tracker
python main.py
```

### Or using the automated installer:
```bash
curl -sL https://raw.githubusercontent.com/sohag2410bd/sohag-tracker/main/scripts/termux_install.sh | bash
```

---

## 💻 Desktop & Linux Installation

```bash
# Clone the repository
git clone https://github.com/sohag2410bd/sohag-tracker.git
cd sohag-tracker

# Install Python requirements
pip install -r requirements.txt

# Run CLI
python3 main.py
```

---

## 🧭 Main CLI Menu

```text
  ███████╗ ██████╗ ██╗  ██╗ █████╗  ██████╗ 
  ██╔════╝██╔═══██╗██║  ██║██╔══██╗██╔════╝ 
  ███████╗██║   ██║███████║███████║██║  ███╗
  ╚════██║██║   ██║██╔══██║██╔══██║██║   ██║
  ███████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ 
  ▶ MOBILE NUMBER TRACKER ◀
  Track • Locate • Secure • Termux Edition v1.0.0

Select an option from the menu:
  [1] Phone Number Lookup      (Carrier, Country, Validity)
  [2] IP Information Lookup    (City, Country, ISP, ASN)
  [3] GPS Location             (Device Coordinates & Map)
  [4] Lookup History           (View saved results)
  [5] Settings                 (Environment & Status)
  [6] About & Ethics           (Author & Documentation)
  [0] Exit
```

---

## 🔒 Security & Privacy Notice

- **No Remote Spying**: This tool strictly respects legal boundaries and user privacy.
- **Phone Lookup Reality**: Cellular numbers are assigned by national telecom authorities to carriers and area code blocks. A phone lookup yields regulatory assignment and carrier metadata. Real-time satellite surveillance of another person's phone without permission or cellular tower warrant is technologically impossible and illegal.
- **GPS Sharing**: GPS coordinates are retrieved strictly from the current user's device with explicit system authorization.
- **Zero Remote Storage**: Search queries and coordinates are processed client-side and saved exclusively on your local device.

---

## 👨‍💻 Author & Credits

- **Developer**: Sohag Ali
- **Email**: `sohag2410bd@gmail.com`
- **GitHub**: `https://github.com/sohag2410bd`
- **License**: MIT License (see [LICENSE](LICENSE))
