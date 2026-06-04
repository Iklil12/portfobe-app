"use client";

import React, { createContext, useContext, useState } from 'react';

interface NexusSplitContextType {
  selectedMedia: { url: string; title: string; type: 'video' | 'photo' | 'certificate' } | null;
  setSelectedMedia: React.Dispatch<React.SetStateAction<{ url: string; title: string; type: 'video' | 'photo' | 'certificate' } | null>>;
}

const NexusSplitContext = createContext<NexusSplitContextType | undefined>(undefined);

export function NexusSplitProvider({ children }: { children: React.ReactNode }) {
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; title: string; type: 'video' | 'photo' | 'certificate' } | null>(null);

  return (
    <NexusSplitContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </NexusSplitContext.Provider>
  );
}

export function useNexusSplit() {
  const context = useContext(NexusSplitContext);
  if (context === undefined) {
    throw new Error('useNexusSplit must be used within a NexusSplitProvider');
  }
  return context;
}
