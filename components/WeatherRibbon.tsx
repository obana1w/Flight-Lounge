'use client';

import { useEffect, useState } from 'react';
import { motion } from "motion/react";
import { useAirport } from "@/contexts/AirportContext";

interface MetarData {
  raw: string;
  temp?: number;
  windSpeed?: number;
  windDir?: number;
  visibility?: number;
  qnh?: number;
  reportTime?: string;
}

export function WeatherRibbon() {
  const { selectedAirport } = useAirport();
  const [metar, setMetar] = useState<MetarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetar = () => {
      fetch(`/api/weather?icao=${selectedAirport.code}`)
        .then(res => res.json())
        .then(data => {
          setMetar(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch METAR:', err);
          setLoading(false);
        });
    };

    // Initial fetch
    fetchMetar();

    // Update every 5 minutes (300000ms)
    const interval = setInterval(() => {
      fetchMetar();
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedAirport.code]); // Added selectedAirport.code to dependencies

  const formatVisibility = (vis?: number) => {
    if (!vis) return '—';
    if (vis >= 10000) return '>10km';
    if (vis >= 1000) return `${Math.round(vis / 1000)}km`;
    return `${vis}m`;
  };

  if (loading || !metar) {
    return (
      <section className="pt-12 pb-12 sm:pt-14 sm:pb-14 lg:pt-12 lg:pb-12 bg-card/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-sm text-muted/60 font-mono">Загрузка погоды...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-10 pb-10 sm:pt-12 sm:pb-12 lg:pt-12 lg:pb-12 bg-card/30 border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center gap-5 sm:gap-6">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto"
          >
            <div className="font-mono text-xl sm:text-2xl font-semibold tracking-[0.2em] sm:tracking-[0.25em]">
              {selectedAirport.code}
            </div>
            <div className="font-mono text-[10px] sm:text-[11px] text-muted/70 max-w-full sm:max-w-[280px] lg:max-w-[300px] leading-[1.5] break-all sm:break-normal text-center sm:text-left">
              {metar.raw}
            </div>
          </motion.div>

          {/* Right Section - Weather Data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap gap-4 sm:gap-6 lg:gap-10"
          >
            {/* Wind */}
            {metar.windDir !== undefined && metar.windSpeed !== undefined && (
              <div className="text-center">
                <div className="font-mono text-base sm:text-lg font-medium text-blue-400">
                  {metar.windDir}°/{metar.windSpeed}kt
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted uppercase tracking-wider mt-0.5 sm:mt-1">
                  Ветер
                </div>
              </div>
            )}

            {/* Temperature */}
            {metar.temp !== undefined && (
              <div className="text-center">
                <div className="font-mono text-base sm:text-lg font-medium text-blue-400">
                  {metar.temp > 0 ? '+' : ''}{metar.temp}°C
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted uppercase tracking-wider mt-0.5 sm:mt-1">
                  Темп.
                </div>
              </div>
            )}

            {/* Visibility */}
            {metar.visibility !== undefined && (
              <div className="text-center">
                <div className="font-mono text-base sm:text-lg font-medium text-blue-400">
                  {formatVisibility(metar.visibility)}
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted uppercase tracking-wider mt-0.5 sm:mt-1">
                  Видимость
                </div>
              </div>
            )}

            {/* QNH */}
            {metar.qnh !== undefined && (
              <div className="text-center">
                <div className="font-mono text-base sm:text-lg font-medium text-blue-400">
                  {metar.qnh}
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted uppercase tracking-wider mt-0.5 sm:mt-1">
                  QNH hPa
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
