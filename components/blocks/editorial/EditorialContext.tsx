"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type MediaType = 'video' | 'photo' | 'certificate';

interface SelectedMedia {
    url: string;
    title: string;
    type: MediaType;
}

interface EditorialContextType {
    selectedMedia: SelectedMedia | null;
    setSelectedMedia: (media: SelectedMedia | null) => void;
}

const EditorialContext = createContext<EditorialContextType | undefined>(undefined);

export function EditorialProvider({ children }: { children: ReactNode }) {
    const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);

    return (
        <EditorialContext.Provider value={{ selectedMedia, setSelectedMedia }}>
            {children}
        </EditorialContext.Provider>
    );
}

export function useEditorialMedia() {
    const context = useContext(EditorialContext);
    if (context === undefined) {
        throw new Error('useEditorialMedia must be used within an EditorialProvider');
    }
    return context;
}
