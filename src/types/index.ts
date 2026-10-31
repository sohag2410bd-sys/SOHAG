export interface PhoneLookupResult {
  rawInput: string;
  isValid: boolean;
  isPossible: boolean;
  e164: string;
  international: string;
  national: string;
  rfc3966: string;
  countryCode: string;
  countryName: string;
  countryIso: string;
  flag: string;
  carrier: string;
  lineType: string;
  timezones: string[];
  disclaimer: string;
  timestamp: string;
}

export interface IpLookupResult {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  flag: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  org: string;
  asn: string;
  currency?: string;
  timestamp: string;
}

export interface GpsLocationState {
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  address?: string;
  error?: string | null;
  lastUpdated?: string;
  trackingMode: 'watch' | 'single' | 'idle';
}

export interface HistoryRecord {
  id: string;
  type: 'PHONE' | 'IP' | 'GPS';
  query: string;
  summary: string;
  timestamp: string;
  details: PhoneLookupResult | IpLookupResult | { latitude: number; longitude: number; accuracy: number; address?: string };
}

export interface CountryOption {
  name: string;
  iso: string;
  dialCode: string;
  flag: string;
  formatPlaceholder: string;
}
