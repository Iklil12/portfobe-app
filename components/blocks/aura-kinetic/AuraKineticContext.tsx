"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MediaData {
  url: string;
  title: string;
  type: 'video' | 'photo' | 'certificate';
}

interface AuraKineticContextType {
  selectedMedia: MediaData | null;
  setSelectedMedia: (media: MediaData | null) => void;
}

const AuraKineticContext = createContext<AuraKineticContextType | undefined>(undefined);

export function AuraKineticProvider({ children }: { children: ReactNode }) {
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);

  return (
    <AuraKineticContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </AuraKineticContext.Provider>
  );
}

export function useAuraKineticMedia() {
  const context = useContext(AuraKineticContext);
  if (context === undefined) {
    throw new Error('useAuraKineticMedia must be used within an AuraKineticProvider');
  }
  return context;
}
