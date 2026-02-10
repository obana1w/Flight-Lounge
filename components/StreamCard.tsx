'use client';

import { useState, useRef, useEffect } from 'react';
import { Plane, Circle, Volume2, Music, Pause, Play } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

interface StreamCardProps {
  code: string;
  city: string;
  listeners: number;
  isLive: boolean;
  atcStreamUrl?: string;
  ambientMusicUrl?: string;
}

export function StreamCard({ code, city, listeners, isLive, atcStreamUrl, ambientMusicUrl }: StreamCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [atcVolume, setAtcVolume] = useState(70);
  const [musicVolume, setMusicVolume] = useState(30);

  const atcAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);

  const { activeStreamId, setActiveStream } = useAudioPlayer();

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

  const handlePlayToggle = () => {
    if (isPlaying) {
      // Pause both
      atcAudioRef.current?.pause();
      musicAudioRef.current?.pause();
      setIsPlaying(false);
      setActiveStream(null);
    } else {
      // Play both
      atcAudioRef.current?.play();
      musicAudioRef.current?.play();
      setIsPlaying(true);
      setActiveStream(code);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-500 ${
        isPlaying
          ? 'border-primary shadow-2xl shadow-primary/20'
          : 'border-border hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-black/30'
      }`}
    >
      {/* Pulsating Rings for Active State */}
      {isPlaying && (
        <>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[88px] -translate-x-1/2">
              <div className="pulse-ring pulse-ring-1" />
              <div className="pulse-ring pulse-ring-2" />
              <div className="pulse-ring pulse-ring-3" />
            </div>
          </div>
          <style jsx>{`
            .pulse-ring {
              position: absolute;
              border: 2px solid rgba(59, 130, 246, 0.4);
              border-radius: 50%;
              animation: pulseRing 3s ease-out infinite;
            }

            .pulse-ring-1 {
              width: 60px;
              height: 60px;
              margin-left: -30px;
              margin-top: -30px;
              animation-delay: 0s;
            }

            .pulse-ring-2 {
              width: 60px;
              height: 60px;
              margin-left: -30px;
              margin-top: -30px;
              animation-delay: 1s;
            }

            .pulse-ring-3 {
              width: 60px;
              height: 60px;
              margin-left: -30px;
              margin-top: -30px;
              animation-delay: 2s;
            }

            @keyframes pulseRing {
              0% {
                transform: scale(0.8);
                opacity: 1;
              }
              50% {
                transform: scale(2);
                opacity: 0.5;
              }
              100% {
                transform: scale(3);
                opacity: 0;
              }
            }
          `}</style>
        </>
      )}

      <div className="relative p-8">
        <div className="mb-6 flex justify-center">
          <Plane
            className={`h-10 w-10 transition-all duration-500 ${
              isPlaying ? 'text-primary scale-110' : 'text-primary'
            }`}
            strokeWidth={1.5}
          />
        </div>

        <h3 className="mb-2 text-center text-xl font-bold text-foreground">
          {code}
        </h3>

        <p className="mb-6 text-center text-sm text-muted">
          {city}
        </p>

        <div className="mb-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Circle className="h-2 w-2 fill-current" />
            <span>{listeners}</span>
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

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            isPlaying
              ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90'
              : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" strokeWidth={2} />
              Остановить
            </>
          ) : (
            <>
              <Play className="h-4 w-4" strokeWidth={2} />
              Слушать
            </>
          )}
        </button>
      </div>

      {/* Hidden Audio Elements */}
      <audio
        ref={atcAudioRef}
        src={atcStreamUrl || '/demo-atc.mp3'}
        loop
        preload="metadata"
      />
      <audio
        ref={musicAudioRef}
        src={ambientMusicUrl || '/demo-ambient.mp3'}
        loop
        preload="metadata"
      />
    </div>
  );
}
