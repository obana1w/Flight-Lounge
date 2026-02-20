'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Radio, Circle, Volume2, Music, Play, Pause, Loader2, ChevronDown } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useAirport } from "@/contexts/AirportContext";
import { AIRPORTS, AirportConfig } from "@/lib/airportsConfig";
import { motion, AnimatePresence } from "motion/react";
import { WeatherWidget } from "./WeatherWidget";

interface StreamCardProps {
  listeners: number;
  isLive: boolean;
}

export interface StreamCardRef {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  isLoading: boolean;
}

export const StreamCard = forwardRef<StreamCardRef, StreamCardProps>(({ listeners, isLive }, ref) => {
  const { selectedAirport, setSelectedAirport, isLoaded } = useAirport();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [atcVolume, setAtcVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 70;
    const stored = localStorage.getItem('flylounge_atc_volume');
    return stored !== null ? Number(stored) : 70;
  });
  const [musicVolume, setMusicVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 30;
    const stored = localStorage.getItem('flylounge_music_volume');
    return stored !== null ? Number(stored) : 30;
  });
  const [dynamicStreamUrl, setDynamicStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveListeners, setLiveListeners] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { activeStreamId, setActiveStream } = useAudioPlayer();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle audio errors
  useEffect(() => {
    const atcAudio = atcAudioRef.current;
    if (!atcAudio) return;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      const audio = e.target as HTMLAudioElement;
      if (audio.error) {
        console.error('Audio error code:', audio.error.code);
        console.error('Audio error message:', audio.error.message);
        setError(`Ошибка воспроизведения: ${audio.error.message}`);
      }
      setIsPlaying(false);
    };

    atcAudio.addEventListener('error', handleError);
    return () => atcAudio.removeEventListener('error', handleError);
  }, []);

  // Stop playback if another card becomes active
  useEffect(() => {
    if (activeStreamId !== selectedAirport.code && isPlaying) {
      atcAudioRef.current?.pause();
      musicAudioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [activeStreamId, selectedAirport.code, isPlaying]);

  useEffect(() => {
    if (atcAudioRef.current) {
      atcAudioRef.current.volume = atcVolume / 100;
    }
    localStorage.setItem('flylounge_atc_volume', String(atcVolume));
  }, [atcVolume]);

  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume / 100;
    }
    localStorage.setItem('flylounge_music_volume', String(musicVolume));
  }, [musicVolume]);

  // Auto-restart music if it stops
  useEffect(() => {
    const musicAudio = musicAudioRef.current;
    if (!musicAudio) return;

    const handleMusicEnded = () => {
      if (isPlaying && selectedAirport.ambientMusicUrl) {
        console.log('Music ended, restarting...');
        musicAudio.currentTime = 0;
        musicAudio.play().catch(err => {
          console.error('Failed to restart music:', err);
        });
      }
    };

    const handleMusicError = () => {
      if (isPlaying && selectedAirport.ambientMusicUrl) {
        console.log('Music error, attempting to restart...');
        setTimeout(() => {
          musicAudio.load();
          musicAudio.play().catch(err => {
            console.error('Failed to restart music after error:', err);
          });
        }, 1000);
      }
    };

    musicAudio.addEventListener('ended', handleMusicEnded);
    musicAudio.addEventListener('error', handleMusicError);

    return () => {
      musicAudio.removeEventListener('ended', handleMusicEnded);
      musicAudio.removeEventListener('error', handleMusicError);
    };
  }, [isPlaying, selectedAirport.ambientMusicUrl]);

  // Fetch listener count on mount and periodically (even when not playing)
  useEffect(() => {
    // Initial count fetch
    fetch('/api/listeners')
      .then(res => res.json())
      .then(data => setLiveListeners(data.listeners))
      .catch(err => console.error('Failed to fetch listener count:', err));

    // Update listener count every 15 seconds
    const countInterval = setInterval(() => {
      fetch('/api/listeners')
        .then(res => res.json())
        .then(data => setLiveListeners(data.listeners))
        .catch(err => console.error('Failed to fetch listener count:', err));
    }, 15000);

    return () => {
      clearInterval(countInterval);
    };
  }, []);

  // Listener tracking - send heartbeat when playing
  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;

    if (isPlaying) {
      // Send initial heartbeat
      fetch('/api/listeners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      }).catch(err => console.error('Failed to send heartbeat:', err));

      // Send heartbeat every 20 seconds
      heartbeatInterval = setInterval(() => {
        fetch('/api/listeners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        }).catch(err => console.error('Failed to send heartbeat:', err));
      }, 20000);
    } else {
      // Remove listener when stopped
      fetch('/api/listeners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      }).catch(err => console.error('Failed to remove listener:', err));
    }

    return () => {
      clearInterval(heartbeatInterval);

      // Cleanup on unmount
      if (isPlaying) {
        fetch('/api/listeners', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        }).catch(err => console.error('Failed to remove listener:', err));
      }
    };
  }, [isPlaying, sessionId]);

  const handlePlay = async (airportOverride?: AirportConfig) => {
    console.log('[Play] Starting play handler', {
      isLoaded,
      selectedAirport,
      airportOverride
    });

    // Wait for context to load
    if (!isLoaded) {
      console.warn('[Play] Context not loaded yet, waiting...');
      setError('Загрузка...');
      return;
    }

    // Use override airport if provided, otherwise use selected airport
    const airport = airportOverride || selectedAirport;

    // Validate airport config
    if (!airport || !airport.source || !airport.streamCode) {
      console.error('[Play] Invalid airport config:', {
        airport,
        hasAirport: !!airport,
        hasSource: !!(airport && airport.source),
        hasStreamCode: !!(airport && airport.streamCode),
        selectedAirport,
        isLoaded
      });
      setError('Ошибка конфигурации аэропорта');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build proxy URL using new universal endpoint
      const proxyUrl = `/api/stream-proxy/${airport.source}/${airport.streamCode}`;
      console.log(`[${airport.code}] Using proxy URL:`, proxyUrl);
      setDynamicStreamUrl(proxyUrl);

      // Wait a moment for the audio element to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Play ATC stream (critical)
      if (atcAudioRef.current) {
        console.log(`[${airport.code}] Setting audio source to proxy:`, proxyUrl);
        atcAudioRef.current.src = proxyUrl;
        atcAudioRef.current.load(); // Explicitly load the stream

        try {
          await atcAudioRef.current.play();
          console.log(`[${airport.code}] ATC stream playing successfully`);

          // Set playing state immediately after ATC starts
          setIsPlaying(true);
          setActiveStream(airport.code);
          setIsLoading(false);
        } catch (playError) {
          console.error(`[${airport.code}] Error playing ATC stream:`, playError);
          throw new Error(`Ошибка воспроизведения: ${playError instanceof Error ? playError.message : 'Неизвестная ошибка'}`);
        }
      }

      // Try to play music in background (optional, non-blocking)
      if (musicAudioRef.current && airport.ambientMusicUrl) {
        musicAudioRef.current.src = airport.ambientMusicUrl;
        musicAudioRef.current.load();
        musicAudioRef.current.play().then(() => {
          console.log(`[${airport.code}] Music stream playing successfully`);
        }).catch((musicError) => {
          console.warn(`[${airport.code}] Music stream failed to play:`, musicError);
          // Music is optional, so we don't throw here
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить поток';
      setError(errorMessage);
      console.error(`[${airport.code}] Error loading stream:`, err);
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    atcAudioRef.current?.pause();
    musicAudioRef.current?.pause();
    setIsPlaying(false);
    setActiveStream(null);
  };

  // Handle airport change with auto-switching (Variant 1C)
  const handleAirportChange = async (airport: AirportConfig) => {
    console.log(`[Airport Change] From ${selectedAirport.code} to ${airport.code}`);

    // Close dropdown
    setIsDropdownOpen(false);

    // If currently playing - auto-switch to new airport
    if (isPlaying) {
      console.log(`[Airport Change] Auto-switching stream to ${airport.code}`);

      // Stop current streams
      atcAudioRef.current?.pause();
      musicAudioRef.current?.pause();

      // Reset stream URL to force reload
      setDynamicStreamUrl(null);
      setError(null);

      // Update selected airport in context BEFORE playing
      setSelectedAirport(airport);

      // Small delay for cleanup
      await new Promise(resolve => setTimeout(resolve, 50));

      // Start new stream automatically with the new airport
      await handlePlay(airport);
    } else {
      // If not playing - just update the selection
      setSelectedAirport(airport);
    }
  };

  // Expose play/pause methods to parent via ref
  useImperativeHandle(ref, () => ({
    play: handlePlay,
    pause: handlePause,
    isPlaying,
    isLoading,
  }));

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-card/30 backdrop-blur-xl transition-all duration-500 ${isLoading
        ? 'border-primary shadow-2xl shadow-primary/20 animate-pulse'
        : isPlaying
          ? 'border-primary shadow-2xl shadow-primary/20'
          : 'border-border hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-black/20'
        }`}
    >
      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <Radio
            className={`h-10 w-10 sm:h-12 sm:w-12 text-primary animate-pulse`}
            style={{ animationDuration: '3s' }}
            strokeWidth={1.5}
          />
        </div>

        {/* Airport Selector - Minimal Apple Style */}
        <div className="mb-2 relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading || !isLoaded}
            className={`group w-full text-center transition-all ${isLoading || !isLoaded ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
          >
            {/* Airport Code with Chevron */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className={`text-xl sm:text-2xl font-bold text-foreground transition-colors ${!isLoading && isLoaded ? 'group-hover:text-primary' : ''
                }`}>
                {isLoaded ? selectedAirport.code : '...'}
              </h3>
              <ChevronDown
                className={`h-4 w-4 text-muted/60 transition-all ${isDropdownOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary'
                  }`}
                strokeWidth={2}
              />
            </div>

            {/* City Name */}
            <p className="text-sm sm:text-base text-muted">
              {isLoaded ? selectedAirport.city : 'Загрузка...'}
            </p>

            {/* Subtle underline on hover */}
            <div className={`h-px mx-auto mt-2 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-all ${!isLoading && isLoaded ? 'w-0 group-hover:w-24' : 'w-0'
              }`} />
          </button>

          {/* Dropdown Menu - Clean Apple Style */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-[280px] rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/10 overflow-hidden"
              >
                <div className="p-2">
                  {AIRPORTS.map((airport, index) => (
                    <button
                      key={airport.code}
                      onClick={() => handleAirportChange(airport)}
                      disabled={isLoading}
                      className={`w-full px-3 py-2.5 text-left transition-all flex items-center justify-between rounded-lg ${airport.code === selectedAirport.code
                        ? 'bg-primary/8'
                        : 'hover:bg-background/50'
                        } ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${airport.code === selectedAirport.code ? 'text-primary' : 'text-foreground'
                          }`}>
                          {airport.code}
                        </div>
                        <div className="text-xs text-muted/70 mt-0.5">{airport.city}</div>
                      </div>
                      {airport.code === selectedAirport.code && (
                        <svg
                          className="h-4 w-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Radio Frequency - Always visible */}
        <div className="mb-4 text-center">
          <span className="font-mono text-xs font-semibold text-primary tracking-wider">
            {isLoaded ? selectedAirport.frequency : '...'}
          </span>
        </div>

        {/* Live message when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center text-sm leading-relaxed text-muted/70 overflow-hidden"
            >
              Ты на частоте неба. Не подкаст. Не запись.<br />
              Живой эфир между землёй и облаками.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mb-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Circle className={`h-2 w-2 fill-current ${liveListeners > 0 ? 'text-success animate-pulse' : ''}`}
              style={liveListeners > 0 ? { animationDuration: '2s' } : {}} />
            <span>{liveListeners}</span>
          </div>

          {isLive && (
            <div className="flex items-center gap-2 text-success">
              <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="font-medium">Live</span>
            </div>
          )}
        </div>

        {/* Audio Controls - Always Visible */}
        <div className="mb-4 space-y-3">
          {/* ATC Volume */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Volume2
                  className={`h-4 w-4 transition-all duration-300 ${isPlaying ? 'text-primary' : 'text-muted/40'
                    }`}
                />
                <span className={`text-xs font-medium transition-all duration-300 ${isPlaying ? 'text-foreground' : 'text-muted/40'
                  }`}>
                  ATC
                </span>
              </div>
              <span className={`font-mono text-[11px] transition-all duration-300 ${isPlaying ? 'text-muted' : 'text-muted/40'
                }`}>
                {atcVolume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={atcVolume}
              onChange={(e) => setAtcVolume(Number(e.target.value))}
              disabled={!isPlaying}
              className={`h-1.5 w-full appearance-none rounded-full outline-none transition-all duration-300 ${isPlaying
                ? 'cursor-ew-resize [&::-webkit-slider-thumb]:hover:scale-125'
                : 'cursor-not-allowed opacity-50'
                } [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:transition-transform`}
              style={{
                background: isPlaying
                  ? `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${atcVolume}%, #1E293B ${atcVolume}%, #1E293B 100%)`
                  : '#1E293B',
              }}
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Music
                  className={`h-4 w-4 transition-all duration-300 ${isPlaying ? 'text-secondary' : 'text-muted/40'
                    }`}
                />
                <span className={`text-xs font-medium transition-all duration-300 ${isPlaying ? 'text-foreground' : 'text-muted/40'
                  }`}>
                  Music
                </span>
              </div>
              <span className={`font-mono text-[11px] transition-all duration-300 ${isPlaying ? 'text-muted' : 'text-muted/40'
                }`}>
                {musicVolume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              disabled={!isPlaying}
              className={`h-1.5 w-full appearance-none rounded-full outline-none transition-all duration-300 ${isPlaying
                ? 'cursor-ew-resize [&::-webkit-slider-thumb]:hover:scale-125'
                : 'cursor-not-allowed opacity-50'
                } [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-secondary/30 [&::-webkit-slider-thumb]:transition-transform`}
              style={{
                background: isPlaying
                  ? `linear-gradient(to right, #6366F1 0%, #6366F1 ${musicVolume}%, #1E293B ${musicVolume}%, #1E293B 100%)`
                  : '#1E293B',
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Inactive state message */}
        {!isPlaying && !isLoading && (
          <div className="text-center text-sm text-muted/60 leading-relaxed pt-2">
            Они говорят. Ты можешь слышать.
          </div>
        )}

        {/* Weather Widget */}
        <WeatherWidget show={isPlaying && isLoaded} icao={isLoaded ? selectedAirport.code : 'ULLI'} />

        {/* Play/Pause Button - Bottom */}
        <div className="mt-4 sm:mt-6 flex justify-center">
          <button
            onClick={isPlaying ? handlePause : () => handlePlay()}
            disabled={isLoading || !isLoaded}
            className={`group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[10px] px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold transition-all ${isLoading || !isLoaded
              ? 'cursor-not-allowed opacity-80 bg-primary/50'
              : 'cursor-pointer bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
              }`}
          >
            {!isLoaded ? (
              <>
                Загрузка...
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              </>
            ) : isLoading ? (
              <>
                Подключение...
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              </>
            ) : isPlaying ? (
              <>
                Остановить
                <Pause className="h-4 w-4" strokeWidth={2} />
              </>
            ) : (
              <>
                Слушать небо
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </motion.svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hidden Audio Elements */}
      <audio
        ref={atcAudioRef}
        preload="none"
        crossOrigin="anonymous"
      />
      <audio
        ref={musicAudioRef}
        loop
        preload="none"
      />
    </div>
  );
});

StreamCard.displayName = 'StreamCard';
