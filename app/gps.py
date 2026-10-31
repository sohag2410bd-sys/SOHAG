"""
SOHAG Mobile Number Tracker - GPS Location Engine (Termux & Device)
"""

import json
import shutil
import subprocess
import time
from app.colors import Colors

def get_termux_gps():
    """
    Attempts to read GPS coordinates using Termux API if running in Android Termux.
    Requires: 'pkg install termux-api' and Termux:API app installed from F-Droid.
    """
    termux_loc_bin = shutil.which("termux-location")
    
    if not termux_loc_bin:
        return {
            "available": False,
            "reason": "termux-location command not found",
            "instructions": "In Termux, install: pkg install termux-api -y (Requires Termux:API app from F-Droid)"
        }
        
    try:
        # Request location with 10s timeout
        proc = subprocess.run(
            [termux_loc_bin, "-p", "gps", "-r", "once"],
            capture_output=True,
            text=True,
            timeout=12
        )
        if proc.returncode == 0 and proc.stdout:
            data = json.loads(proc.stdout)
            lat = data.get("latitude")
            lon = data.get("longitude")
            acc = data.get("accuracy", 0.0)
            alt = data.get("altitude", 0.0)
            provider = data.get("provider", "gps")
            
            return {
                "available": True,
                "latitude": lat,
                "longitude": lon,
                "accuracy": acc,
                "altitude": alt,
                "provider": provider,
                "maps_url": f"https://www.google.com/maps?q={lat},{lon}",
                "osm_url": f"https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=16/{lat}/{lon}",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        else:
            return {
                "available": False,
                "reason": proc.stderr or "Permission denied or GPS signal timeout",
                "instructions": "Ensure GPS/Location is enabled in Android Settings and Termux has location permission."
            }
    except Exception as e:
        return {
            "available": False,
            "reason": str(e),
            "instructions": "Make sure Termux:API companion app has Location permission granted."
        }
