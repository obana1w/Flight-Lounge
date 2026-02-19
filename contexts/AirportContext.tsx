'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AirportConfig, getDefaultAirport, getAirportByCode } from '@/lib/airportsConfig';

interface AirportContextType {
  selectedAirport: AirportConfig;
  setSelectedAirport: (airport: AirportConfig) => void;
  isLoaded: boolean;
}

const AirportContext = createContext<AirportContextType | undefined>(undefined);

const STORAGE_KEY = 'flylounge_selected_airport';

export function AirportProvider({ children }: { children: ReactNode }) {
  const [selectedAirport, setSelectedAirportState] = useState<AirportConfig>(() => {
    const defaultAirport = getDefaultAirport();
    console.log('[AirportContext] Initializing with default airport:', defaultAirport);
    return defaultAirport;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    console.log('[AirportContext] useEffect running, checking localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      console.log('[AirportContext] Found stored airport code:', stored);
      const airport = getAirportByCode(stored);
      if (airport) {
        console.log('[AirportContext] Loading airport from storage:', airport);
        setSelectedAirportState(airport);
      } else {
        console.warn('[AirportContext] Stored code not found in config:', stored);
      }
    } else {
      console.log('[AirportContext] No stored airport, using default');
    }
    setIsLoaded(true);
    console.log('[AirportContext] Context loaded, isLoaded=true');
  }, []);

  // Save to localStorage when changed
  const setSelectedAirport = (airport: AirportConfig) => {
    console.log('[AirportContext] Setting airport:', airport);
    setSelectedAirportState(airport);
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, airport.code);
      console.log('[AirportContext] Saved to localStorage:', airport.code);
    }
  };

  return (
    <AirportContext.Provider value={{ selectedAirport, setSelectedAirport, isLoaded }}>
      {children}
    </AirportContext.Provider>
  );
}

export function useAirport() {
  const context = useContext(AirportContext);
  if (context === undefined) {
    throw new Error('useAirport must be used within an AirportProvider');
  }
  return context;
}
