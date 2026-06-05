"use client";

import React, { createContext, useContext, useState } from 'react';

type CinematicContextType = {
    selectedMedia: { url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null;
    setSelectedMedia: (media: any) => void;
    openAward: string | null;
    setOpenAward: (id: string | null) => void;
};

const CinematicContext = createContext<CinematicContextType | undefined>(undefined);

export const CinematicProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const [openAward, setOpenAward] = useState<string | null>(null);

    return (
        <CinematicContext.Provider value={{ selectedMedia, setSelectedMedia, openAward, setOpenAward }}>
            {children}
        </CinematicContext.Provider>
    );
};

export const useCinematic = () => {
    const context = useContext(CinematicContext);
    if (context === undefined) {
        throw new Error('useCinematic must be used within a CinematicProvider');
    }
    return context;
};
