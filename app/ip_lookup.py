"""
SOHAG Mobile Number Tracker - IP Geolocation & ASN Lookup
"""

import json
import urllib.request
import urllib.error
import re

IP_API_URLS = [
    "https://ipapi.co/{ip}/json/",
    "https://freeipapi.com/api/json/{ip}",
    "http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query"
]

def is_valid_ip(ip_str: str) -> bool:
    if not ip_str:
        return True # Empty means fetch self public IP
    # IPv4 regex
    ipv4_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    # Basic IPv6 check
    if ":" in ip_str:
        return True
    return bool(re.match(ipv4_pattern, ip_str.strip()))

def lookup_ip_address(ip_query: str = "") -> dict:
    clean_ip = ip_query.strip()
    
    if clean_ip and not is_valid_ip(clean_ip):
        return {
            "success": False,
            "error": "Invalid IP address format. Example: 8.8.8.8 or leave empty for your current public IP."
        }
        
    endpoint = f"https://ipapi.co/{clean_ip}/json/" if clean_ip else "https://ipapi.co/json/"
    
    headers = {
        "User-Agent": "SOHAG-Tracker/1.0 (Termux; Python 3)",
        "Accept": "application/json"
    }
    
    try:
        req = urllib.request.Request(endpoint, headers=headers)
        with urllib.request.urlopen(req, timeout=7) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                
                # Check if rate-limited or error returned by ipapi
                if data.get("error"):
                    raise Exception(data.get("reason", "API rate limit reached"))
                    
                ip = data.get("ip", clean_ip)
                city = data.get("city", "Unknown City")
                region = data.get("region", "Unknown Region")
                country = data.get("country_name", "Unknown Country")
                country_code = data.get("country_code", "")
                org = data.get("org", data.get("org", "Unknown Org"))
                asn = data.get("asn", "Unknown ASN")
                lat = data.get("latitude", 0.0)
                lon = data.get("longitude", 0.0)
                tz = data.get("timezone", "UTC")
                postal = data.get("postal", "N/A")
                
                return {
                    "success": True,
                    "ip": ip,
                    "city": city,
                    "region": region,
                    "country": country,
                    "country_code": country_code,
                    "flag": f"🌐 {country_code}" if country_code else "🌐",
                    "postal": postal,
                    "latitude": lat,
                    "longitude": lon,
                    "timezone": tz,
                    "isp": org,
                    "org": org,
                    "asn": asn,
                    "currency": data.get("currency", "USD"),
                    "summary": f"{ip} - {city}, {country} ({org})"
                }
    except Exception as e:
        # Fallback to freeipapi.com
        try:
            fb_endpoint = f"https://freeipapi.com/api/json/{clean_ip}" if clean_ip else "https://freeipapi.com/api/json"
            req = urllib.request.Request(fb_endpoint, headers=headers)
            with urllib.request.urlopen(req, timeout=7) as fb_response:
                if fb_response.status == 200:
                    fb_data = json.loads(fb_response.read().decode("utf-8"))
                    ip = fb_data.get("ipAddress", clean_ip or "Your IP")
                    city = fb_data.get("cityName", "Unknown City")
                    region = fb_data.get("regionName", "Unknown Region")
                    country = fb_data.get("countryName", "Unknown Country")
                    cc = fb_data.get("countryCode", "")
                    lat = fb_data.get("latitude", 0.0)
                    lon = fb_data.get("longitude", 0.0)
                    tz = fb_data.get("timeZone", "UTC")
                    
                    return {
                        "success": True,
                        "ip": ip,
                        "city": city,
                        "region": region,
                        "country": country,
                        "country_code": cc,
                        "flag": f"🌐 {cc}" if cc else "🌐",
                        "postal": fb_data.get("zipCode", "N/A"),
                        "latitude": lat,
                        "longitude": lon,
                        "timezone": tz,
                        "isp": "Public Internet Provider",
                        "org": "Autonomous System",
                        "asn": "AS-Global",
                        "currency": "USD",
                        "summary": f"{ip} - {city}, {country}"
                    }
        except Exception as fb_err:
            return {
                "success": False,
                "error": f"Failed to retrieve IP geolocation: {str(e)} / {str(fb_err)}"
            }
