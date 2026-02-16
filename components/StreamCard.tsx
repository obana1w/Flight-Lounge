'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Radio, Circle, Volume2, Music } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { fetchStreamUrl } from "@/lib/streamUtils";
import { motion, AnimatePresence } from "motion/react";
import { WeatherWidget } from "./WeatherWidget";

interface StreamCardProps {
  code: string;
  city: string;
  listeners: number;
  isLive: boolean;
  radioScannerCode?: string; // Code for radioscanner.pro (e.g., 'ulli')
  atcStreamUrl?: string;
  ambientMusicUrl?: string;
}

export interface StreamCardRef {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  isLoading: boolean;
}

export const StreamCard = forwardRef<StreamCardRef, StreamCardProps>(({ code, city, listeners, isLive, radioScannerCode, atcStreamUrl, ambientMusicUrl }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [atcVolume, setAtcVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(30);
  const [dynamicStreamUrl, setDynamicStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liveListeners, setLiveListeners] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);

  const { activeStreamId, setActiveStream } = useAudioPlayer();

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
    if (activeStreamId !== code && isPlaying) {
      atcAudioRef.current?.pause();
      musicAudioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [activeStreamId, code, isPlaying]);

  useEffect(() => {
    if (atcAudioRef.current) {
      atcAudioRef.current.volume = atcVolume / 100;
    }
  }, [atcVolume]);

  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume / 100;
    }
  }, [musicVolume]);

  // Auto-restart music if it stops
  useEffect(() => {
    const musicAudio = musicAudioRef.current;
    if (!musicAudio) return;

    const handleMusicEnded = () => {
      if (isPlaying && ambientMusicUrl) {
        console.log('Music ended, restarting...');
        musicAudio.currentTime = 0;
        musicAudio.play().catch(err => {
          console.error('Failed to restart music:', err);
        });
      }
    };

    const handleMusicError = () => {
      if (isPlaying && ambientMusicUrl) {
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
  }, [isPlaying, ambientMusicUrl]);

  // Listener tracking - send heartbeat and fetch count
  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;
    let countInterval: NodeJS.Timeout;

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

      // Update listener count every 10 seconds
      countInterval = setInterval(() => {
        fetch('/api/listeners')
          .then(res => res.json())
          .then(data => setLiveListeners(data.listeners))
          .catch(err => console.error('Failed to fetch listener count:', err));
      }, 10000);

      // Initial count fetch
      fetch('/api/listeners')
        .then(res => res.json())
        .then(data => setLiveListeners(data.listeners))
        .catch(err => console.error('Failed to fetch listener count:', err));
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
      clearInterval(countInterval);

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

  const handlePlay = async () => {
    // If we have a radioScannerCode, use proxy URL
    if (radioScannerCode && !dynamicStreamUrl) {
      setIsLoading(true);
      setError(null);

      try {
        // Use our proxy endpoint instead of direct URL
        const proxyUrl = `/api/stream-proxy/${radioScannerCode.toLowerCase()}`;
        console.log('Using proxy URL:', proxyUrl);
        setDynamicStreamUrl(proxyUrl);

        // Wait a moment for the audio element to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // Play both
        if (atcAudioRef.current) {
          console.log('Setting audio source to proxy:', proxyUrl);
          atcAudioRef.current.src = proxyUrl;
          atcAudioRef.current.load(); // Explicitly load the stream

          try {
            await atcAudioRef.current.play();
            console.log('ATC stream playing successfully');
          } catch (playError) {
            console.error('Error playing ATC stream:', playError);
            throw new Error(`Ошибка воспроизведения: ${playError instanceof Error ? playError.message : 'Неизвестная ошибка'}`);
          }
        }

        // Try to play music (optional)
        if (musicAudioRef.current && ambientMusicUrl) {
          try {
            await musicAudioRef.current.play();
            console.log('Music stream playing successfully');
          } catch (musicError) {
            console.warn('Music stream failed to play:', musicError);
            // Music is optional, so we don't throw here
          }
        }

        setIsPlaying(true);
        setActiveStream(code);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить поток';
        setError(errorMessage);
        console.error('Error loading stream:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use existing URL (either dynamic or static)
      try {
        await atcAudioRef.current?.play();
        if (musicAudioRef.current && ambientMusicUrl) {
          await musicAudioRef.current?.play();
        }
        setIsPlaying(true);
        setActiveStream(code);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка воспроизведения';
        setError(errorMessage);
        console.error('Error playing stream:', err);
      }
    }
  };

  const handlePause = () => {
    atcAudioRef.current?.pause();
    musicAudioRef.current?.pause();
    setIsPlaying(false);
    setActiveStream(null);
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
      className={`group relative overflow-hidden rounded-3xl border bg-card transition-all duration-500 ${
        isLoading
          ? 'border-primary shadow-2xl shadow-primary/20 animate-pulse'
          : isPlaying
          ? 'border-primary shadow-2xl shadow-primary/20'
          : 'border-border hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-black/20'
      }`}
    >
      <div className="relative p-10">
        <div className="mb-8 flex justify-center">
          <Radio
            className={`h-12 w-12 text-primary animate-pulse`}
            style={{ animationDuration: '3s' }}
            strokeWidth={1.5}
          />
        </div>

        <h3 className="mb-3 text-center text-2xl font-bold text-foreground">
          {code}
        </h3>

        <p className="mb-2 text-center text-base text-muted">
          {city}
        </p>

        {/* Radio Frequency - Always visible */}
        <div className="mb-4 text-center">
          <span className="font-mono text-xs font-semibold text-primary">118.1 MHz</span>
        </div>

        {/* Live message when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center text-xs leading-relaxed text-muted/70 overflow-hidden"
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
                  className={`h-3.5 w-3.5 transition-all duration-300 ${
                    isPlaying ? 'text-primary' : 'text-muted/40'
                  }`}
                />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isPlaying ? 'text-foreground' : 'text-muted/40'
                }`}>
                  ATC
                </span>
              </div>
              <span className={`font-mono text-[10px] transition-all duration-300 ${
                isPlaying ? 'text-muted' : 'text-muted/40'
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
              className={`h-1.5 w-full appearance-none rounded-full outline-none transition-all duration-300 ${
                isPlaying
                  ? 'cursor-pointer [&::-webkit-slider-thumb]:hover:scale-125'
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
                  className={`h-3.5 w-3.5 transition-all duration-300 ${
                    isPlaying ? 'text-secondary' : 'text-muted/40'
                  }`}
                />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isPlaying ? 'text-foreground' : 'text-muted/40'
                }`}>
                  Music
                </span>
              </div>
              <span className={`font-mono text-[10px] transition-all duration-300 ${
                isPlaying ? 'text-muted' : 'text-muted/40'
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
              className={`h-1.5 w-full appearance-none rounded-full outline-none transition-all duration-300 ${
                isPlaying
                  ? 'cursor-pointer [&::-webkit-slider-thumb]:hover:scale-125'
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
          <div className="text-center text-xs text-muted/60 leading-relaxed pt-2">
            Они говорят. Ты можешь слышать.
          </div>
        )}

        {/* Weather Widget */}
        <WeatherWidget show={isPlaying} />
      </div>

      {/* Hidden Audio Elements */}
      <audio
        ref={atcAudioRef}
        src={dynamicStreamUrl || atcStreamUrl}
        preload="none"
        crossOrigin="anonymous"
      />
      {ambientMusicUrl && (
        <audio
          ref={musicAudioRef}
          src={ambientMusicUrl}
          loop
          preload="metadata"
        />
      )}
    </div>
  );
});

StreamCard.displayName = 'StreamCard';
