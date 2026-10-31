import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import { PhoneLookupResult, CountryOption } from '../types';

export const POPULAR_COUNTRIES: CountryOption[] = [
  { name: 'Bangladesh', iso: 'BD', dialCode: '+880', flag: '🇧🇩', formatPlaceholder: '1712345678' },
  { name: 'United States', iso: 'US', dialCode: '+1', flag: '🇺🇸', formatPlaceholder: '5551234567' },
  { name: 'United Kingdom', iso: 'GB', dialCode: '+44', flag: '🇬🇧', formatPlaceholder: '7700900123' },
  { name: 'India', iso: 'IN', dialCode: '+91', flag: '🇮🇳', formatPlaceholder: '9876543210' },
  { name: 'Pakistan', iso: 'PK', dialCode: '+92', flag: '🇵🇰', formatPlaceholder: '3001234567' },
  { name: 'United Arab Emirates', iso: 'AE', dialCode: '+971', flag: '🇦🇪', formatPlaceholder: '501234567' },
  { name: 'Saudi Arabia', iso: 'SA', dialCode: '+966', flag: '🇸🇦', formatPlaceholder: '501234567' },
  { name: 'Canada', iso: 'CA', dialCode: '+1', flag: '🇨🇦', formatPlaceholder: '4161234567' },
  { name: 'Australia', iso: 'AU', dialCode: '+61', flag: '🇦🇺', formatPlaceholder: '412345678' },
  { name: 'Germany', iso: 'DE', dialCode: '+49', flag: '🇩🇪', formatPlaceholder: '15112345678' },
  { name: 'France', iso: 'FR', dialCode: '+33', flag: '🇫🇷', formatPlaceholder: '612345678' },
  { name: 'Malaysia', iso: 'MY', dialCode: '+60', flag: '🇲🇾', formatPlaceholder: '123456789' },
  { name: 'Singapore', iso: 'SG', dialCode: '+65', flag: '🇸🇬', formatPlaceholder: '81234567' },
  { name: 'Italy', iso: 'IT', dialCode: '+39', flag: '🇮🇹', formatPlaceholder: '3201234567' },
  { name: 'Spain', iso: 'ES', dialCode: '+34', flag: '🇪🇸', formatPlaceholder: '612345678' },
  { name: 'Brazil', iso: 'BR', dialCode: '+55', flag: '🇧🇷', formatPlaceholder: '11987654321' },
  { name: 'Nigeria', iso: 'NG', dialCode: '+234', flag: '🇳🇬', formatPlaceholder: '8021234567' },
  { name: 'South Africa', iso: 'ZA', dialCode: '+27', flag: '🇿🇦', formatPlaceholder: '711234567' },
];

export const COUNTRY_NAMES: Record<string, { name: string; flag: string; timezone: string }> = {
  BD: { name: 'Bangladesh', flag: '🇧🇩', timezone: 'Asia/Dhaka (UTC+6)' },
  US: { name: 'United States', flag: '🇺🇸', timezone: 'UTC-5 to UTC-8' },
  CA: { name: 'Canada', flag: '🇨🇦', timezone: 'UTC-3.5 to UTC-8' },
  GB: { name: 'United Kingdom', flag: '🇬🇧', timezone: 'Europe/London (UTC+0/+1)' },
  IN: { name: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata (UTC+5:30)' },
  PK: { name: 'Pakistan', flag: '🇵🇰', timezone: 'Asia/Karachi (UTC+5)' },
  AE: { name: 'United Arab Emirates', flag: '🇦🇪', timezone: 'Asia/Dubai (UTC+4)' },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦', timezone: 'Asia/Riyadh (UTC+3)' },
  DE: { name: 'Germany', flag: '🇩🇪', timezone: 'Europe/Berlin (UTC+1/+2)' },
  FR: { name: 'France', flag: '🇫🇷', timezone: 'Europe/Paris (UTC+1/+2)' },
  AU: { name: 'Australia', flag: '🇦🇺', timezone: 'Australia/Sydney (UTC+8 to +11)' },
  MY: { name: 'Malaysia', flag: '🇲🇾', timezone: 'Asia/Kuala_Lumpur (UTC+8)' },
  SG: { name: 'Singapore', flag: '🇸🇬', timezone: 'Asia/Singapore (UTC+8)' },
  IT: { name: 'Italy', flag: '🇮🇹', timezone: 'Europe/Rome (UTC+1/+2)' },
  ES: { name: 'Spain', flag: '🇪🇸', timezone: 'Europe/Madrid (UTC+1/+2)' },
  BR: { name: 'Brazil', flag: '🇧🇷', timezone: 'America/Sao_Paulo (UTC-3)' },
  NG: { name: 'Nigeria', flag: '🇳🇬', timezone: 'Africa/Lagos (UTC+1)' },
  ZA: { name: 'South Africa', flag: '🇿🇦', timezone: 'Africa/Johannesburg (UTC+2)' },
};

const BD_CARRIERS: Record<string, string> = {
  '17': 'Grameenphone (Telenor Group)',
  '13': 'Grameenphone (Skitto / 013 Series)',
  '18': 'Robi Axiata Limited',
  '16': 'Airtel (Robi Axiata)',
  '19': 'Banglalink Digital (VEON Ltd.)',
  '14': 'Banglalink (014 Series)',
  '15': 'Teletalk Bangladesh Ltd. (State Owned)',
};

export function cleanPhoneString(input: string, dialCode?: string): string {
  let cleaned = input.trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  }
  
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0') && dialCode) {
      cleaned = dialCode + cleaned.slice(1);
    } else if (dialCode) {
      cleaned = dialCode + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

export function detectCarrier(countryIso: string, nationalNumber: string): string {
  if (countryIso === 'BD' && nationalNumber.length >= 2) {
    const prefix = nationalNumber.slice(0, 2);
    if (BD_CARRIERS[prefix]) {
      return BD_CARRIERS[prefix];
    }
    return 'Bangladesh Mobile Operator';
  }

  if (countryIso === 'IN' && nationalNumber.length >= 2) {
    const firstDigit = nationalNumber.charAt(0);
    if (['9', '8', '7', '6'].includes(firstDigit)) {
      return 'Indian Cellular Network (Jio / Airtel / Vi / BSNL)';
    }
    return 'Fixed / Landline Telecom';
  }

  if (countryIso === 'US' || countryIso === 'CA') {
    return 'North American NANP Carrier (AT&T / Verizon / T-Mobile / Rogers / Bell)';
  }

  if (countryIso === 'GB') {
    if (nationalNumber.startsWith('7')) {
      return 'UK Mobile Carrier (EE / O2 / Vodafone / Three)';
    }
    return 'UK Geographic / Landline Network';
  }

  return 'National Telecom Network';
}

export function parseNumberDetails(
  rawInput: string,
  defaultCountry: CountryCode = 'BD'
): { success: boolean; data?: PhoneLookupResult; error?: string } {
  if (!rawInput || rawInput.trim().length === 0) {
    return { success: false, error: 'Please enter a phone number' };
  }

  const cleaned = cleanPhoneString(rawInput);
  const digitsOnly = cleaned.replace(/\D/g, '');

  if (digitsOnly.length < 5) {
    return {
      success: false,
      error: 'Please enter a valid phone number with country code (e.g. +8801712345678)',
    };
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(cleaned, defaultCountry);

    if (!phoneNumber || !phoneNumber.isPossible()) {
      return {
        success: false,
        error: 'Invalid number format. Please ensure country code is included (e.g. +8801712345678)',
      };
    }

    const countryIso = (phoneNumber.country || defaultCountry) as string;
    const countryMeta = COUNTRY_NAMES[countryIso] || {
      name: countryIso,
      flag: '🌐',
      timezone: 'UTC',
    };

    const carrier = detectCarrier(countryIso, phoneNumber.nationalNumber);
    const lineType = phoneNumber.getType()
      ? phoneNumber.getType()!.replace('_', ' ').toUpperCase()
      : 'MOBILE';

    const result: PhoneLookupResult = {
      rawInput,
      isValid: phoneNumber.isValid(),
      isPossible: phoneNumber.isPossible(),
      e164: phoneNumber.format('E.164'),
      international: phoneNumber.formatInternational(),
      national: phoneNumber.formatNational(),
      rfc3966: phoneNumber.getURI(),
      countryCode: `+${phoneNumber.countryCallingCode}`,
      countryName: countryMeta.name,
      countryIso,
      flag: countryMeta.flag,
      carrier,
      lineType,
      timezones: [countryMeta.timezone],
      disclaimer:
        'Phone lookup validates telecom allocations and regional operator assignment. Real-time satellite GPS tracking of a 3rd party requires lawful carrier interception and cannot be achieved remotely.',
      timestamp: new Date().toISOString(),
    };

    return { success: true, data: result };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to parse phone number',
    };
  }
}
