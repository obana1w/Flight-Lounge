/**
 * Utility functions for fetching and managing radio scanner stream URLs
 */

export interface StreamData {
  streamUrl: string;
  listeners: number;
  isLive: boolean;
}

/**
 * Fetches the dynamic stream URL for a given station code from radioscanner.pro
 * Uses our API route to avoid CORS issues
 * @param stationCode - The station code (e.g., 'ulli')
 * @returns Promise with stream data including URL, listener count, and live status
 */
export async function fetchStreamUrl(stationCode: string): Promise<StreamData> {
  try {
    const response = await fetch(`/api/stream/${stationCode.toLowerCase()}`, {
      cache: 'no-store', // Always get fresh URL
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch stream data: ${response.status}`);
    }

    const data = await response.json();

    return {
      streamUrl: data.streamUrl,
      listeners: data.listeners,
      isLive: data.isLive,
    };
  } catch (error) {
    console.error(`Error fetching stream URL for ${stationCode}:`, error);
    throw error;
  }
}

/**
 * Radio scanner station configuration
 */
export interface StationConfig {
  code: string;
  city: string;
  radioScannerCode: string; // Code used in radioscanner.pro URLs
}

/**
 * Available radio scanner stations
 */
export const AVAILABLE_STATIONS: StationConfig[] = [
  { code: 'ULLI', city: 'Санкт-Петербург (Пулково)', radioScannerCode: 'ulli' },
  { code: 'UWKD', city: 'Казань', radioScannerCode: '57968' },
  { code: 'UAAA', city: 'Алматы', radioScannerCode: '4575' },
  { code: 'UNEE', city: 'Кемерово', radioScannerCode: '38476' },
  { code: 'USDD', city: 'Салехард', radioScannerCode: '45431' },
];
