export interface CountryPhoneConfig {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  example: string;
}

export const COUNTRIES: CountryPhoneConfig[] = [
  // --- Popular / Featured Countries First ---
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', minLength: 10, maxLength: 10, placeholder: '98765 43210', example: '10 digits' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', minLength: 10, maxLength: 10, placeholder: '202 555 0123', example: '10 digits' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', minLength: 10, maxLength: 10, placeholder: '7911 123456', example: '10 digits' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', minLength: 10, maxLength: 10, placeholder: '416 555 0145', example: '10 digits' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', minLength: 9, maxLength: 9, placeholder: '412 345 678', example: '9 digits' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', minLength: 9, maxLength: 9, placeholder: '50 123 4567', example: '9 digits' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', minLength: 9, maxLength: 9, placeholder: '50 123 4567', example: '9 digits' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', minLength: 8, maxLength: 8, placeholder: '8123 4567', example: '8 digits' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', minLength: 10, maxLength: 11, placeholder: '151 23456789', example: '10-11 digits' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', minLength: 9, maxLength: 9, placeholder: '6 12 34 56 78', example: '9 digits' },

  // --- Asia & Pacific ---
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', minLength: 10, maxLength: 10, placeholder: '1712 345678', example: '10 digits' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975', minLength: 8, maxLength: 8, placeholder: '17 123 456', example: '8 digits' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', minLength: 11, maxLength: 11, placeholder: '138 0013 8000', example: '11 digits' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852', minLength: 8, maxLength: 8, placeholder: '9123 4567', example: '8 digits' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', minLength: 10, maxLength: 12, placeholder: '812 3456 7890', example: '10-12 digits' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', minLength: 9, maxLength: 9, placeholder: '50 123 4567', example: '9 digits' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', minLength: 10, maxLength: 10, placeholder: '90 1234 5678', example: '10 digits' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', minLength: 10, maxLength: 10, placeholder: '10 1234 5678', example: '10 digits' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', minLength: 8, maxLength: 8, placeholder: '9123 4567', example: '8 digits' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', minLength: 9, maxLength: 9, placeholder: '71 234 5678', example: '9 digits' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', minLength: 9, maxLength: 10, placeholder: '12 345 6789', example: '9-10 digits' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960', minLength: 7, maxLength: 7, placeholder: '712 3456', example: '7 digits' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977', minLength: 10, maxLength: 10, placeholder: '984 1234567', example: '10 digits' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', minLength: 9, maxLength: 10, placeholder: '21 123 4567', example: '9-10 digits' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', minLength: 8, maxLength: 8, placeholder: '9123 4567', example: '8 digits' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', minLength: 10, maxLength: 10, placeholder: '300 1234567', example: '10 digits' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', minLength: 10, maxLength: 10, placeholder: '917 123 4567', example: '10 digits' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', minLength: 8, maxLength: 8, placeholder: '3312 3456', example: '8 digits' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', minLength: 9, maxLength: 9, placeholder: '81 234 5678', example: '9 digits' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', minLength: 10, maxLength: 10, placeholder: '532 123 4567', example: '10 digits' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', minLength: 9, maxLength: 9, placeholder: '912 345 678', example: '9 digits' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', minLength: 9, maxLength: 9, placeholder: '91 234 5678', example: '9 digits' },

  // --- Europe ---
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', minLength: 10, maxLength: 11, placeholder: '664 123 4567', example: '10-11 digits' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', minLength: 9, maxLength: 9, placeholder: '470 12 34 56', example: '9 digits' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', minLength: 9, maxLength: 9, placeholder: '78 123 45 67', example: '9 digits' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', minLength: 9, maxLength: 9, placeholder: '601 123 456', example: '9 digits' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', minLength: 8, maxLength: 8, placeholder: '32 12 34 56', example: '8 digits' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', minLength: 9, maxLength: 9, placeholder: '612 345 678', example: '9 digits' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', minLength: 9, maxLength: 10, placeholder: '41 234 5678', example: '9-10 digits' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', minLength: 10, maxLength: 10, placeholder: '691 234 5678', example: '10 digits' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', minLength: 9, maxLength: 9, placeholder: '20 123 4567', example: '9 digits' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', minLength: 9, maxLength: 9, placeholder: '85 123 4567', example: '9 digits' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', minLength: 10, maxLength: 10, placeholder: '320 123 4567', example: '10 digits' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', minLength: 9, maxLength: 9, placeholder: '6 12345678', example: '9 digits' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', minLength: 8, maxLength: 8, placeholder: '412 34 567', example: '8 digits' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', minLength: 9, maxLength: 9, placeholder: '512 345 678', example: '9 digits' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', minLength: 9, maxLength: 9, placeholder: '912 345 678', example: '9 digits' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', minLength: 9, maxLength: 10, placeholder: '712 345 678', example: '9-10 digits' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', minLength: 10, maxLength: 10, placeholder: '912 345 6789', example: '10 digits' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', minLength: 9, maxLength: 9, placeholder: '70 123 45 67', example: '9 digits' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', minLength: 9, maxLength: 9, placeholder: '50 123 4567', example: '9 digits' },

  // --- Americas ---
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', minLength: 10, maxLength: 10, placeholder: '11 1234 5678', example: '10 digits' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', minLength: 10, maxLength: 11, placeholder: '11 91234 5678', example: '10-11 digits' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', minLength: 9, maxLength: 9, placeholder: '9 1234 5678', example: '9 digits' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', minLength: 10, maxLength: 10, placeholder: '300 123 4567', example: '10 digits' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', minLength: 10, maxLength: 10, placeholder: '55 1234 5678', example: '10 digits' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', minLength: 9, maxLength: 9, placeholder: '912 345 678', example: '9 digits' },

  // --- Africa ---
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', minLength: 10, maxLength: 10, placeholder: '10 1234 5678', example: '10 digits' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', minLength: 9, maxLength: 9, placeholder: '24 123 4567', example: '9 digits' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', minLength: 9, maxLength: 9, placeholder: '712 345 678', example: '9 digits' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', minLength: 9, maxLength: 9, placeholder: '612 345 678', example: '9 digits' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', minLength: 10, maxLength: 10, placeholder: '802 123 4567', example: '10 digits' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', minLength: 9, maxLength: 9, placeholder: '71 123 4567', example: '9 digits' },

  // --- Other World Countries ---
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', minLength: 8, maxLength: 8, placeholder: '3612 3456', example: '8 digits' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', minLength: 9, maxLength: 9, placeholder: '7 9012 3456', example: '9 digits' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', minLength: 8, maxLength: 8, placeholder: '71 123 456', example: '8 digits' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230', minLength: 8, maxLength: 8, placeholder: '5123 4567', example: '8 digits' }
];

export const DEFAULT_COUNTRY: CountryPhoneConfig = COUNTRIES[0]; // India (+91, 10 digits)

export function findCountryByCode(code: string): CountryPhoneConfig {
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase()) || DEFAULT_COUNTRY;
}
