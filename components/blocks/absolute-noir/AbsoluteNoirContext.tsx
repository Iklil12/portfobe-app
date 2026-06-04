"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AbsoluteNoirContextType {
    selectedMedia: { url: string; title: string; type: 'video' | 'photo' | 'certificate' } | null;
    setSelectedMedia: (media: { url: string; title: string; type: 'video' | 'photo' | 'certificate' } | null) => void;
}

const AbsoluteNoirContext = createContext<AbsoluteNoirContextType | undefined>(undefined);

export const AbsoluteNoirProvider = ({ children }: { children: ReactNode }) => {
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; title: string; type: 'video' | 'photo' | 'certificate' } | null>(null);

    return (
        <AbsoluteNoirContext.Provider value={{ selectedMedia, setSelectedMedia }}>
            {children}
        </AbsoluteNoirContext.Provider>
    );
};

export const useAbsoluteNoir = () => {
    const context = useContext(AbsoluteNoirContext);
    if (context === undefined) {
        throw new Error('useAbsoluteNoir must be used within an AbsoluteNoirProvider');
    }
    return context;
};
