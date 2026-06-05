"use client";

import React, { createContext, useContext, useState } from 'react';

type MediaType = {
    url: string;
    title: string;
    type: 'video' | 'photo' | 'certificate';
};

interface AcidTechContextType {
    selectedMedia: MediaType | null;
    setSelectedMedia: (media: MediaType | null) => void;
    openAward: string | null;
    setOpenAward: (id: string | null) => void;
}

const AcidTechContext = createContext<AcidTechContextType | undefined>(undefined);

export function AcidTechProvider({ children }: { children: React.ReactNode }) {
    const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
    const [openAward, setOpenAward] = useState<string | null>(null);

    return (
        <AcidTechContext.Provider value={{ selectedMedia, setSelectedMedia, openAward, setOpenAward }}>
            {children}
        </AcidTechContext.Provider>
    );
}

export function useAcidTech() {
    const context = useContext(AcidTechContext);
    if (context === undefined) {
        throw new Error('useAcidTech must be used within an AcidTechProvider');
    }
    return context;
}
