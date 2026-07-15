import { StateCreator } from 'zustand';
import { EditorStore, DraftState } from '../types';

export const createDraftSlice: StateCreator<EditorStore, [], [], DraftState> = (set) => ({
  drafts: [],
  activeDraftId: null,
  activeDraftName: null,
  publishedDraftId: null,

  setDrafts: (val) => set({ drafts: val }),
  setActiveDraftId: (val) => set({ activeDraftId: val }),
  setActiveDraftName: (val) => set({ activeDraftName: val }),
  setPublishedDraftId: (val) => set({ publishedDraftId: val }),
});
