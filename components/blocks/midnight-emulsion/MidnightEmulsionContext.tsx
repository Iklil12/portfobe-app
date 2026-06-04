"use client";

import React, { createContext, useContext, useState } from 'react';

type MediaType = 'video' | 'photo' | 'certificate';

interface SelectedMedia {
  url: string;
  title: string;
  type: MediaType;
}

interface MidnightEmulsionContextType {
  selectedMedia: SelectedMedia | null;
  setSelectedMedia: (media: SelectedMedia | null) => void;
}

const MidnightEmulsionContext = createContext<MidnightEmulsionContextType>({
  selectedMedia: null,
  setSelectedMedia: () => {},
});

export const useMidnightEmulsion = () => useContext(MidnightEmulsionContext);

export function MidnightEmulsionProvider({ children }: { children: React.ReactNode }) {
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);

  return (
    <MidnightEmulsionContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </MidnightEmulsionContext.Provider>
  );
}
