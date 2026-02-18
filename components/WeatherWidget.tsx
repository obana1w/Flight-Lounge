'use client';

import { useEffect, useState } from 'react';
import { Cloud, Wind, Sunrise, Sunset } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MetarData {
  raw: string;
  temp?: number;
  windSpeed?: number;
  windDir?: number;
  visibility?: number;
  qnh?: number;
  reportTime?: string;
  taf?: string;
  sunrise?: string;
  sunset?: string;
}

export function WeatherWidget({ show }: { show: boolean }) {
  const [metar, setMetar] = useState<MetarData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetar = () => {
    setLoading(true);
    fetch('/api/weather')
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

  useEffect(() => {
    if (show) {
      // Initial fetch
      fetchMetar();

      // Update every 10 minutes (600000ms)
      const interval = setInterval(() => {
        fetchMetar();
      }, 600000);

      return () => clearInterval(interval);
    } else {
      // Reset when hidden
      setMetar(null);
    }
  }, [show]);

  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}Z`;
  };

  const formatSunTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  return (
    <AnimatePresence>
      {show && metar && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="overflow-hidden"
        >
          <div className="rounded-lg sm:rounded-xl border border-border/30 bg-card/50 p-3 sm:p-4 backdrop-blur-sm space-y-2.5 sm:space-y-3">
            {/* Wind Info */}
            {metar.windDir !== undefined && metar.windSpeed !== undefined && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-background/40 py-1.5 sm:py-2 px-2.5 sm:px-3">
                <Wind className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary/70" strokeWidth={1.5} />
                <span className="text-[11px] sm:text-xs text-muted/60">Ветер:</span>
                <span className="font-mono text-[13px] sm:text-sm font-semibold text-foreground">
                  {metar.windDir}° • {metar.windSpeed} м/с
                </span>
              </div>
            )}

            {/* METAR Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Cloud className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary/70" strokeWidth={1.5} />
                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted/70">
                  METAR ULLI
                </span>
              </div>
              {metar.reportTime && (
                <span className="font-mono text-[9px] sm:text-[10px] text-muted/50">
                  {formatTime(metar.reportTime)}
                </span>
              )}
            </div>

            {/* METAR Raw Code */}
            <div className="rounded-lg bg-background/60 p-2.5 sm:p-3">
              <pre className="font-mono text-[10px] sm:text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
                {metar.raw}
              </pre>
            </div>

            {/* Sun Times */}
            {metar.sunrise && metar.sunset && (
              <div className="flex items-center justify-around pt-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Sunrise className="h-4 w-4 sm:h-5 sm:w-5 text-warning/70" strokeWidth={1.5} />
                  <div className="text-[11px] sm:text-xs">
                    <div className="text-muted/50">Восход</div>
                    <div className="font-mono font-medium text-foreground/90">
                      {formatSunTime(metar.sunrise)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Sunset className="h-4 w-4 sm:h-5 sm:w-5 text-warning/70" strokeWidth={1.5} />
                  <div className="text-[11px] sm:text-xs">
                    <div className="text-muted/50">Заход</div>
                    <div className="font-mono font-medium text-foreground/90">
                      {formatSunTime(metar.sunset)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
