/**
 * Configuration for all available airports
 */

export type StreamSource = 'radioscanner' | 'liveatc';

export interface AirportConfig {
  code: string;           // ICAO code (ULLI, URSS)
  city: string;           // City name in Russian
  source: StreamSource;   // Stream source
  streamCode: string;     // Code for the stream API (ulli, urss, 57968)
  frequency: string;      // Radio frequency (e.g., "118.1 MHz")
  latitude: number;       // Latitude for sun times
  longitude: number;      // Longitude for sun times
  ambientMusicUrl?: string; // Optional ambient music URL
}

/**
 * Available airports configuration
 */
export const AIRPORTS: AirportConfig[] = [
  {
    code: 'ULLI',
    city: 'Санкт-Петербург (Пулково)',
    source: 'radioscanner',
    streamCode: 'ulli',
    frequency: 'ATC Mix',
    latitude: 59.8003,
    longitude: 30.2625,
    ambientMusicUrl: 'https://ice3.somafm.com/fluid-128-mp3',
  },
  {
    code: 'URSS',
    city: 'Сочи (Адлер)',
    source: 'liveatc',
    streamCode: 'urss',
    frequency: 'ATC Mix',
    latitude: 43.4499,
    longitude: 39.9566,
    ambientMusicUrl: 'https://ice3.somafm.com/fluid-128-mp3',
  },
  {
    code: 'UNNT',
    city: 'Новосибирск (Толмачёво)',
    source: 'liveatc',
    streamCode: 'unnt',
    frequency: 'ATC Mix',
    latitude: 55.0198,
    longitude: 82.6187,
    ambientMusicUrl: 'https://ice3.somafm.com/fluid-128-mp3',
  },
];

/**
 * Get airport config by ICAO code
 */
export function getAirportByCode(code: string): AirportConfig | undefined {
  return AIRPORTS.find(airport => airport.code === code);
}

/**
 * Get default airport (first in the list)
 */
export function getDefaultAirport(): AirportConfig {
  return AIRPORTS[0];
}
