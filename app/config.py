"""
SOHAG Mobile Number Tracker - Configuration & Defaults
"""

import os

APP_NAME = "SOHAG Mobile Number Tracker"
TAGLINE = "Track • Locate • Secure"
VERSION = "1.0.0"
AUTHOR = "Sohag Ali"
CONTACT_EMAIL = "sohag2410bd@gmail.com"
GITHUB_REPO = "https://github.com/sohag2410bd/sohag-tracker"

# Data storage paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HISTORY_FILE = os.path.join(BASE_DIR, "lookup_history.json")
CONFIG_FILE = os.path.join(BASE_DIR, "config.json")

# Default settings
DEFAULT_CONFIG = {
    "default_country": "BD",
    "save_history": True,
    "theme": "cyber_neon",
    "timeout": 8,
    "anonymize_history": False
}
