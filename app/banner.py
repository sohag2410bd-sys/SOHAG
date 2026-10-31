"""
SOHAG Mobile Number Tracker - ASCII Banner & Header
"""

from app.colors import Colors

BANNER = f"""{Colors.NEON_CYAN}
  ███████╗ ██████╗ ██╗  ██╗ █████╗  ██████╗ 
  ██╔════╝██╔═══██╗██║  ██║██╔══██╗██╔════╝ 
  ███████╗██║   ██║███████║███████║██║  ███╗
  ╚════██║██║   ██║██╔══██║██╔══██║██║   ██║
  ███████║╚██████╔╝██║  ██║██║  ██║╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ 
{Colors.NEON_PURPLE}  ▶ MOBILE NUMBER TRACKER ◀{Colors.RESET}
{Colors.NEON_GREEN}  Track • Locate • Secure • Termux Edition v1.0.0{Colors.RESET}
{Colors.GRAY}  Author: Sohag Ali | GitHub: @sohag2410bd{Colors.RESET}
"""

def print_banner():
    print(BANNER)
    print(f"{Colors.DARK_GRAY}{'━' * 55}{Colors.RESET}")

def print_section(title: str, color: str = Colors.NEON_CYAN):
    print(f"\n{color}{Colors.BOLD}▶ {title.upper()}{Colors.RESET}")
    print(f"{Colors.DARK_GRAY}{'─' * (len(title) + 5)}{Colors.RESET}")
