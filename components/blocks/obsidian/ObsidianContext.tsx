"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MediaData {
  url: string;
  title: string;
  type: 'video' | 'photo' | 'certificate';
}

interface ObsidianContextType {
  selectedMedia: MediaData | null;
  setSelectedMedia: (media: MediaData | null) => void;
}

const ObsidianContext = createContext<ObsidianContextType | undefined>(undefined);

export function ObsidianProvider({ children }: { children: ReactNode }) {
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);

  return (
    <ObsidianContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </ObsidianContext.Provider>
  );
}

export function useObsidianMedia() {
  const context = useContext(ObsidianContext);
  if (context === undefined) {
    throw new Error('useObsidianMedia must be used within an ObsidianProvider');
  }
  return context;
}
