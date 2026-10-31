#!/data/data/com.termux/files/usr/bin/bash
# ====================================================================
# SOHAG Mobile Number Tracker — Android Termux One-Click Installer
# Track • Locate • Secure
# Author: Sohag Ali (sohag2410bd@gmail.com)
# ====================================================================

set -e

# Terminal colors
CYAN='\033[38;5;51m'
PURPLE='\033[38;5;141m'
GREEN='\033[38;5;48m'
YELLOW='\033[38;5;227m'
RED='\033[38;5;196m'
RESET='\033[0m'

clear
echo -e "${CYAN}"
echo "  ███████╗ ██████╗ ██╗  ██╗ █████╗  ██████╗ "
echo "  ██╔════╝██╔═══██╗██║  ██║██╔══██╗██╔════╝ "
echo "  ███████╗██║   ██║███████║███████║██║  ███╗"
echo "  ╚════██║██║   ██║██╔══██║██╔══██║██║   ██║"
echo "  ███████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝"
echo "  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ "
echo -e "${PURPLE}  ▶ TERMUX AUTO INSTALLER ◀${RESET}"
echo -e "${GREEN}  Installing SOHAG Mobile Number Tracker...${RESET}\n"

echo -e "${YELLOW}[1/4] Updating Termux packages...${RESET}"
pkg update -y && pkg upgrade -y

echo -e "${YELLOW}[2/4] Installing Python, Git, and Termux:API...${RESET}"
pkg install python git termux-api -y

echo -e "${YELLOW}[3/4] Installing Python dependencies (phonenumbers, requests)...${RESET}"
pip install --upgrade pip
pip install phonenumbers requests

echo -e "${YELLOW}[4/4] Setting execution permissions...${RESET}"
chmod +x main.py scripts/run.sh 2>/dev/null || true

echo -e "\n${GREEN}======================================================"
echo -e "✓ Installation Complete Successfully!"
echo -e "======================================================${RESET}"
echo -e "${CYAN}To launch the tracker at any time, run:${RESET}"
echo -e "  ${PURPLE}python main.py${RESET}\n"

# Run now
python main.py
