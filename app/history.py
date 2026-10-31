"""
SOHAG Mobile Number Tracker - History Management
"""

import json
import os
import time
from app.config import HISTORY_FILE

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_history_entry(record_type: str, query: str, details: dict):
    history = load_history()
    entry = {
        "id": int(time.time() * 1000),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "type": record_type,
        "query": query,
        "summary": details.get("summary", ""),
        "details": details
    }
    history.insert(0, entry)
    # Keep last 100 records
    history = history[:100]
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to save history: {e}")
    return entry

def clear_history():
    try:
        if os.path.exists(HISTORY_FILE):
            os.remove(HISTORY_FILE)
            return True
        return True
    except Exception:
        return False
