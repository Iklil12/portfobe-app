import { StateCreator } from 'zustand';
import { EditorStore, ResumeState, ResumeData } from '../types';

export const createResumeSlice: StateCreator<EditorStore, [], [], ResumeState> = (set) => ({
  resumeData: null,
  
  setResumeData: (val) => set((state) => ({ 
    resumeData: typeof val === 'function' ? val(state.resumeData) : val,
    isDirty: true
  })),

  updateResumeData: (updates: Partial<ResumeData>) => set((state) => ({
    resumeData: state.resumeData ? { ...state.resumeData, ...updates } : null,
    isDirty: true
  }))
});
