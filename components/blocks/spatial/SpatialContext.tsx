"use client";

import React, { createContext, useContext, useState } from 'react';

type MediaType = 'video' | 'photo' | 'certificate';

export interface MediaData {
  url: string;
  title: string;
  type: MediaType;
}

interface SpatialContextType {
  selectedMedia: MediaData | null;
  setSelectedMedia: (media: MediaData | null) => void;
}

const SpatialContext = createContext<SpatialContextType>({
  selectedMedia: null,
  setSelectedMedia: () => {},
});

export const useSpatialMedia = () => useContext(SpatialContext);

export function SpatialProvider({ children }: { children: React.ReactNode }) {
  const [selectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  return (
    <SpatialContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </SpatialContext.Provider>
  );
}
