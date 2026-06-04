"use client";

import React, { createContext, useContext, useState } from 'react';

type MediaType = 'video' | 'photo' | 'certificate';

interface SelectedMedia {
  url: string;
  title: string;
  type: MediaType;
}

interface ViewfinderContextType {
  selectedMedia: SelectedMedia | null;
  setSelectedMedia: (media: SelectedMedia | null) => void;
}

const ViewfinderContext = createContext<ViewfinderContextType>({
  selectedMedia: null,
  setSelectedMedia: () => {},
});

export const useViewfinder = () => useContext(ViewfinderContext);

export function ViewfinderProvider({ children }: { children: React.ReactNode }) {
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);

  return (
    <ViewfinderContext.Provider value={{ selectedMedia, setSelectedMedia }}>
      {children}
    </ViewfinderContext.Provider>
  );
}
