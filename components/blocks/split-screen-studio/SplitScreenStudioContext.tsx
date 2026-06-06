"use client";

import React, { createContext, useContext, useState } from 'react';

interface SplitScreenStudioContextType {
    selectedMedia: { url: string, title: string, type: 'video' | 'photo' | 'certificate' } | null;
    setSelectedMedia: (media: any) => void;
    activeSection: {
        bg: string;
        index: string | React.ReactNode;
        tag: string | React.ReactNode;
        title: string | React.ReactNode;
        desc: string | React.ReactNode;
    };
    setActiveSection: React.Dispatch<React.SetStateAction<any>>;
    cursorHovered: boolean | string;
    setCursorHovered: (hovered: boolean | string) => void;
}

const SplitScreenStudioContext = createContext<SplitScreenStudioContextType | null>(null);

export function SplitScreenStudioProvider({ children, initialActiveSection }: { children: React.ReactNode, initialActiveSection: any }) {
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const [activeSection, setActiveSection] = useState<any>(initialActiveSection);
    const [cursorHovered, setCursorHovered] = useState<boolean | string>(false);

    return (
        <SplitScreenStudioContext.Provider value={{ selectedMedia, setSelectedMedia, activeSection, setActiveSection, cursorHovered, setCursorHovered }}>
            {children}
        </SplitScreenStudioContext.Provider>
    );
}

export function useSplitScreenStudio() {
    const context = useContext(SplitScreenStudioContext);
    if (!context) {
        throw new Error('useSplitScreenStudio must be used within a SplitScreenStudioProvider');
    }
    return context;
}
