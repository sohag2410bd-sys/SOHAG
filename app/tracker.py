"""
SOHAG Mobile Number Tracker - Phone Number Lookup Engine
"""

import re
import sys

# Try importing phonenumbers if installed
try:
    import phonenumbers
    from phonenumbers import geocoder, carrier, timezone
    HAS_PHONENUMBERS = True
except ImportError:
    HAS_PHONENUMBERS = False

# Known country codes & metadata fallback
COUNTRY_CODES = {
    "880": {"name": "Bangladesh", "iso": "BD", "flag": "🇧🇩", "currency": "BDT", "region": "South Asia"},
    "1": {"name": "United States / Canada", "iso": "US", "flag": "🇺🇸", "currency": "USD", "region": "North America"},
    "44": {"name": "United Kingdom", "iso": "GB", "flag": "🇬🇧", "currency": "GBP", "region": "Europe"},
    "91": {"name": "India", "iso": "IN", "flag": "🇮🇳", "currency": "INR", "region": "South Asia"},
    "92": {"name": "Pakistan", "iso": "PK", "flag": "🇵🇰", "currency": "PKR", "region": "South Asia"},
    "971": {"name": "United Arab Emirates", "iso": "AE", "flag": "🇦🇪", "currency": "AED", "region": "Middle East"},
    "966": {"name": "Saudi Arabia", "iso": "SA", "flag": "🇸🇦", "currency": "SAR", "region": "Middle East"},
    "49": {"name": "Germany", "iso": "DE", "flag": "🇩🇪", "currency": "EUR", "region": "Europe"},
    "33": {"name": "France", "iso": "FR", "flag": "🇫🇷", "currency": "EUR", "region": "Europe"},
    "81": {"name": "Japan", "iso": "JP", "flag": "🇯🇵", "currency": "JPY", "region": "East Asia"},
    "86": {"name": "China", "iso": "CN", "flag": "🇨🇳", "currency": "CNY", "region": "East Asia"},
    "61": {"name": "Australia", "iso": "AU", "flag": "🇦🇺", "currency": "AUD", "region": "Oceania"},
    "60": {"name": "Malaysia", "iso": "MY", "flag": "🇲🇾", "currency": "MYR", "region": "Southeast Asia"},
    "62": {"name": "Indonesia", "iso": "ID", "flag": "🇮🇩", "currency": "IDR", "region": "Southeast Asia"},
    "977": {"name": "Nepal", "iso": "NP", "flag": "🇳🇵", "currency": "NPR", "region": "South Asia"},
}

BD_PREFIX_CARRIERS = {
    "17": "Grameenphone",
    "13": "Grameenphone (Skitto / 013)",
    "18": "Robi Axiata",
    "16": "Airtel (Robi)",
    "19": "Banglalink",
    "14": "Banglalink (014)",
    "15": "Teletalk Bangladesh",
}

def clean_phone_input(raw: str) -> str:
    cleaned = re.sub(r"[^\d+]", "", raw.strip())
    if cleaned.startswith("00"):
        cleaned = "+" + cleaned[2:]
    elif not cleaned.startswith("+") and cleaned.startswith("880"):
        cleaned = "+" + cleaned
    elif not cleaned.startswith("+") and cleaned.startswith("01") and len(cleaned) == 11:
        # Default Bangladesh domestic format
        cleaned = "+88" + cleaned
    return cleaned

def lookup_phone_number(raw_number: str, default_region: str = "BD") -> dict:
    cleaned = clean_phone_input(raw_number)
    
    if not cleaned:
        return {
            "success": False,
            "error": "Please enter a valid phone number with country code (e.g. +8801712345678)"
        }
        
    if HAS_PHONENUMBERS:
        try:
            parsed = phonenumbers.parse(cleaned, default_region if not cleaned.startswith("+") else None)
            is_valid = phonenumbers.is_valid_number(parsed)
            is_possible = phonenumbers.is_possible_number(parsed)
            
            country_code = str(parsed.country_code)
            national_num = str(parsed.national_number)
            
            geo_name = geocoder.description_for_number(parsed, "en")
            carrier_name = carrier.name_for_number(parsed, "en")
            timezones = list(timezone.time_zones_for_number(parsed))
            
            # Format types
            int_format = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL)
            nat_format = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL)
            e164_format = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
            rfc3966 = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.RFC3966)
            
            # Determine line type
            num_type = phonenumbers.number_type(parsed)
            type_map = {
                0: "Fixed Line",
                1: "Mobile",
                2: "Fixed Line or Mobile",
                3: "Toll Free",
                4: "Premium Rate",
                5: "Shared Cost",
                6: "VoIP",
                7: "Personal Number",
                8: "Pager",
                9: "UAN",
                10: "Voicemail",
                -1: "Unknown"
            }
            line_type = type_map.get(num_type, "Unknown")
            
            meta = COUNTRY_CODES.get(country_code, {"name": geo_name or "Unknown", "flag": "🌐", "iso": "UN"})
            
            # Fallback for carrier if library doesn't have it (e.g. Bangladesh prefixes)
            if not carrier_name and country_code == "880" and len(national_num) >= 2:
                prefix = national_num[:2]
                carrier_name = BD_PREFIX_CARRIERS.get(prefix, "Bangladesh Mobile Network")

            return {
                "success": True,
                "is_valid": is_valid,
                "is_possible": is_possible,
                "raw_input": raw_number,
                "e164": e164_format,
                "international": int_format,
                "national": nat_format,
                "rfc3966": rfc3966,
                "country_code": f"+{country_code}",
                "country_name": geo_name or meta.get("name", "International"),
                "country_iso": meta.get("iso", ""),
                "flag": meta.get("flag", "🌐"),
                "carrier": carrier_name or "Not Available / Ported",
                "line_type": line_type,
                "timezones": timezones or ["UTC"],
                "summary": f"{int_format} ({meta.get('name', 'Intl')} - {carrier_name or line_type})",
                "disclaimer": "Phone number shows assigned carrier & allocation jurisdiction. Exact real-time GPS requires device authorization."
            }
        except Exception as e:
            # Fallback to algorithmic parser
            pass

    # Built-in Fallback without phonenumbers library
    num_str = cleaned.lstrip("+")
    detected_cc = None
    detected_meta = None
    
    # Sort country codes by descending length
    for cc in sorted(COUNTRY_CODES.keys(), key=lambda x: len(x), reverse=True):
        if num_str.startswith(cc):
            detected_cc = cc
            detected_meta = COUNTRY_CODES[cc]
            break
            
    if not detected_cc:
        return {
            "success": True,
            "is_valid": len(num_str) >= 7,
            "is_possible": True,
            "raw_input": raw_number,
            "e164": f"+{num_str}",
            "international": f"+{num_str}",
            "national": num_str,
            "rfc3966": f"tel:+{num_str}",
            "country_code": "+Unknown",
            "country_name": "International Number",
            "flag": "🌐",
            "carrier": "Standard Carrier",
            "line_type": "Mobile/Fixed",
            "timezones": ["UTC"],
            "summary": f"+{num_str} (International)",
            "disclaimer": "Phone lookup shows standard prefix data. Install 'phonenumbers' via pip for deep metadata."
        }
        
    subscriber = num_str[len(detected_cc):]
    carrier_name = "Telecom Operator"
    if detected_cc == "880" and len(subscriber) >= 2:
        prefix = subscriber[:2]
        carrier_name = BD_PREFIX_CARRIERS.get(prefix, "Bangladesh Mobile Operator")
        
    return {
        "success": True,
        "is_valid": len(subscriber) >= 6,
        "is_possible": True,
        "raw_input": raw_number,
        "e164": f"+{num_str}",
        "international": f"+{detected_cc} {subscriber}",
        "national": f"0{subscriber}",
        "rfc3966": f"tel:+{num_str}",
        "country_code": f"+{detected_cc}",
        "country_name": detected_meta["name"],
        "country_iso": detected_meta["iso"],
        "flag": detected_meta["flag"],
        "carrier": carrier_name,
        "line_type": "Mobile",
        "timezones": ["UTC+6" if detected_cc == "880" else "Local"],
        "summary": f"+{detected_cc} {subscriber} ({detected_meta['name']} - {carrier_name})",
        "disclaimer": "Real-time handset GPS requires on-device authorization or carrier warrant."
    }
