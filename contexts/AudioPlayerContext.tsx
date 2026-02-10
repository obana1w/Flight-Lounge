'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AudioPlayerContextType {
  activeStreamId: string | null;
  setActiveStream: (id: string | null) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null);

  const setActiveStream = (id: string | null) => {
    setActiveStreamId(id);
  };

  return (
    <AudioPlayerContext.Provider value={{ activeStreamId, setActiveStream }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
}
