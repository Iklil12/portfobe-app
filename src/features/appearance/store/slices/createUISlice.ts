import { StateCreator } from 'zustand';
import { EditorStore, UIState } from '../types';

export const createUISlice: StateCreator<EditorStore, [], [], UIState> = (set, get) => ({
  isLoading: true,
  isSavingDraft: false,
  isPublishing: false,
  isEditorCollapsed: false,
  showOfflineModal: false,
  isThemeModalOpen: false,
  showProModal: false,
  isSeoModalOpen: false,
  previewMode: 'desktop',
  splitModeType: 'fixed',
  desktopZoom: 0.75,
  mobileZoom: 1.0,
  isDraftsModalOpen: false,
  isSaveDraftModalOpen: false,
  isPublishModalOpen: false,
  isDirty: false,

  setIsLoading: (val) => set({ isLoading: val }),
  setIsSavingDraft: (val) => set({ isSavingDraft: val }),
  setIsPublishing: (val) => set({ isPublishing: val }),
  setIsEditorCollapsed: (val) => set((state) => ({ isEditorCollapsed: typeof val === 'function' ? val(state.isEditorCollapsed) : val })),
  setShowOfflineModal: (val) => set({ showOfflineModal: val }),
  setIsThemeModalOpen: (val) => set({ isThemeModalOpen: val }),
  setShowProModal: (val) => set({ showProModal: val }),
  setIsSeoModalOpen: (val) => set({ isSeoModalOpen: val }),
  setPreviewMode: (val) => set({ previewMode: val }),
  setSplitModeType: (val) => set({ splitModeType: val }),
  setDesktopZoom: (val) => set((state) => ({ desktopZoom: typeof val === 'function' ? val(state.desktopZoom) : val })),
  setMobileZoom: (val) => set((state) => ({ mobileZoom: typeof val === 'function' ? val(state.mobileZoom) : val })),
  setIsDraftsModalOpen: (val) => set({ isDraftsModalOpen: val }),
  setIsSaveDraftModalOpen: (val) => set({ isSaveDraftModalOpen: val }),
  setIsPublishModalOpen: (val) => set({ isPublishModalOpen: val }),
  setIsDirty: (val) => set({ isDirty: val }),

  zoomIn: (mode?: string) => {
    const targetMode = mode || get().previewMode;
    if (targetMode === 'desktop' || targetMode === 'split') {
      get().setDesktopZoom((z) => Math.min(1.0, parseFloat((z + 0.1).toFixed(2))));
    } else {
      get().setMobileZoom((z) => Math.min(1.5, parseFloat((z + 0.1).toFixed(2))));
    }
  },
  zoomOut: (mode?: string) => {
    const targetMode = mode || get().previewMode;
    if (targetMode === 'desktop' || targetMode === 'split') {
      get().setDesktopZoom((z) => Math.max(0.4, parseFloat((z - 0.1).toFixed(2))));
    } else {
      get().setMobileZoom((z) => Math.max(0.4, parseFloat((z - 0.1).toFixed(2))));
    }
  },
});
