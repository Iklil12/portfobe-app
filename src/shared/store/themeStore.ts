import { create } from 'zustand';

// 1. Definisikan tipe untuk blok portofolio (diambil dari useThemeEditor)
export interface PageBlock {
  id: string;
  blockType: string;
  orderIndex: number;
  isVisible: boolean;
  isLocked?: boolean;
}

export type EditorStateSnapshot = {
  activeTheme: string;
  themeColor: string;
  fontHeading: string;
  fontBody: string;
  buttonShape: string;
  cardStyle: string;
  splashScreen: boolean;
  customTexts: Record<string, string>;
  pageBlocks: PageBlock[];
  selectedProjects: string[];
};

// 2. Definisikan antarmuka (Interface) untuk keseluruhan State dan Actions
interface ThemeState {
  // --- UI & MODAL STATE ---
  previewMode: 'desktop' | 'mobile' | 'split';
  splitModeType: 'flexible' | 'fixed';
  desktopZoom: number;
  mobileZoom: number;
  isEditorCollapsed: boolean;
  isThemeModalOpen: boolean;
  showProModal: boolean;
  isDraftsModalOpen: boolean;
  isSaveDraftModalOpen: boolean;
  isPublishModalOpen: boolean;

  // --- APPEARANCE STATE (TEMA) ---
  activeTheme: string;
  themeColor: string;
  fontHeading: string;
  fontBody: string;
  buttonShape: string;
  cardStyle: string;
  splashScreen: boolean;
  customTexts: Record<string, string>;

  // --- ACTIONS ---
  setPreviewMode: (mode: 'desktop' | 'mobile' | 'split') => void;
  setSplitModeType: (type: 'flexible' | 'fixed') => void;
  zoomIn: (mode: 'desktop' | 'mobile') => void;
  zoomOut: (mode: 'desktop' | 'mobile') => void;
  setIsEditorCollapsed: (val: boolean) => void;
  setIsThemeModalOpen: (val: boolean) => void;
  setShowProModal: (val: boolean) => void;
  setIsDraftsModalOpen: (val: boolean) => void;
  setIsSaveDraftModalOpen: (val: boolean) => void;
  setIsPublishModalOpen: (val: boolean) => void;
  
  setActiveTheme: (theme: string) => void;
  setThemeColor: (color: string) => void;
  setFontHeading: (font: string) => void;
  setFontBody: (font: string) => void;
  setButtonShape: (shape: string) => void;
  setCardStyle: (style: string) => void;
  setSplashScreen: (val: boolean) => void;
  setCustomTexts: (texts: Record<string, string>) => void;

  // --- BLOCKS & PROJECTS STATE ---
  pageBlocks: PageBlock[];
  selectedProjects: string[];
  setPageBlocks: (blocks: PageBlock[] | ((prev: PageBlock[]) => PageBlock[])) => void;
  setSelectedProjects: (projects: string[] | ((prev: string[]) => string[])) => void;
  
  // --- HISTORY (UNDO/REDO) STATE ---
  pastStates: EditorStateSnapshot[];
  futureStates: EditorStateSnapshot[];
  isRestoring: boolean;
  canUndo: boolean;
  canRedo: boolean;
  
  // --- HISTORY ACTIONS ---
  pushHistory: (snapshot: EditorStateSnapshot) => void;
  undo: () => void;
  redo: () => void;
  setIsRestoring: (val: boolean) => void;
}

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.0;
const ZOOM_MAX_MOBILE = 1.5;
const ZOOM_STEP = 0.1;

// 3. Buat Store Zustand
export const useThemeStore = create<ThemeState>((set, get) => ({
  // --- INITIAL UI STATE ---
  previewMode: 'desktop',
  splitModeType: 'fixed',
  desktopZoom: 0.75,
  mobileZoom: 1.0,
  isEditorCollapsed: false,
  isThemeModalOpen: false,
  showProModal: false,
  isDraftsModalOpen: false,
  isSaveDraftModalOpen: false,
  isPublishModalOpen: false,

  // --- INITIAL APPEARANCE STATE ---
  activeTheme: 'brutalism',
  themeColor: '#000000',
  fontHeading: 'Space Mono',
  fontBody: 'Inter',
  buttonShape: 'hard',
  cardStyle: 'hard-shadow',
  splashScreen: true,
  customTexts: {},

  // --- INITIAL BLOCKS & PROJECTS ---
  pageBlocks: [],
  selectedProjects: [],

  // --- INITIAL HISTORY ---
  pastStates: [],
  futureStates: [],
  isRestoring: false,
  canUndo: false,
  canRedo: false,

  // --- UI ACTIONS ---
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setSplitModeType: (type) => set({ splitModeType: type }),
  setIsEditorCollapsed: (val) => set({ isEditorCollapsed: val }),
  setIsThemeModalOpen: (val) => set({ isThemeModalOpen: val }),
  setShowProModal: (val) => set({ showProModal: val }),
  setIsDraftsModalOpen: (val) => set({ isDraftsModalOpen: val }),
  setIsSaveDraftModalOpen: (val) => set({ isSaveDraftModalOpen: val }),
  setIsPublishModalOpen: (val) => set({ isPublishModalOpen: val }),

  zoomIn: (mode) => {
    if (mode === 'desktop') {
      set((state) => ({ desktopZoom: Math.min(ZOOM_MAX, parseFloat((state.desktopZoom + ZOOM_STEP).toFixed(2))) }));
    } else {
      set((state) => ({ mobileZoom: Math.min(ZOOM_MAX_MOBILE, parseFloat((state.mobileZoom + ZOOM_STEP).toFixed(2))) }));
    }
  },

  zoomOut: (mode) => {
    if (mode === 'desktop') {
      set((state) => ({ desktopZoom: Math.max(ZOOM_MIN, parseFloat((state.desktopZoom - ZOOM_STEP).toFixed(2))) }));
    } else {
      set((state) => ({ mobileZoom: Math.max(ZOOM_MIN, parseFloat((state.mobileZoom - ZOOM_STEP).toFixed(2))) }));
    }
  },

  // --- APPEARANCE ACTIONS ---
  setActiveTheme: (theme) => set({ activeTheme: theme }),
  setThemeColor: (color) => set({ themeColor: color }),
  setFontHeading: (font) => set({ fontHeading: font }),
  setFontBody: (font) => set({ fontBody: font }),
  setButtonShape: (shape) => set({ buttonShape: shape }),
  setCardStyle: (style) => set({ cardStyle: style }),
  setSplashScreen: (val) => set({ splashScreen: val }),
  setCustomTexts: (texts) => set({ customTexts: texts }),

  // --- BLOCKS & PROJECTS ACTIONS ---
  setPageBlocks: (blocks) => set((state) => ({ 
    pageBlocks: typeof blocks === 'function' ? blocks(state.pageBlocks) : blocks 
  })),
  setSelectedProjects: (projects) => set((state) => ({ 
    selectedProjects: typeof projects === 'function' ? projects(state.selectedProjects) : projects 
  })),

  // --- HISTORY ACTIONS ---
  setIsRestoring: (val) => set({ isRestoring: val }),
  
  pushHistory: (snapshot) => set((state) => {
    const newPastStates = [...state.pastStates, snapshot];
    if (newPastStates.length > 30) newPastStates.shift(); // Max 30 steps
    return {
      pastStates: newPastStates,
      futureStates: [],
      canUndo: newPastStates.length > 0,
      canRedo: false
    };
  }),

  undo: () => {
    const state = get();
    if (state.pastStates.length === 0) return;
    
    set({ isRestoring: true });
    
    const previousState = state.pastStates[state.pastStates.length - 1];
    const newPastStates = state.pastStates.slice(0, -1);
    
    const currentSnapshot: EditorStateSnapshot = {
      activeTheme: state.activeTheme,
      themeColor: state.themeColor,
      fontHeading: state.fontHeading,
      fontBody: state.fontBody,
      buttonShape: state.buttonShape,
      cardStyle: state.cardStyle,
      splashScreen: state.splashScreen,
      customTexts: state.customTexts,
      pageBlocks: state.pageBlocks,
      selectedProjects: state.selectedProjects,
    };
    
    set({
      ...previousState,
      pastStates: newPastStates,
      futureStates: [...state.futureStates, currentSnapshot],
      canUndo: newPastStates.length > 0,
      canRedo: true
    });

    setTimeout(() => get().setIsRestoring(false), 100);
  },

  redo: () => {
    const state = get();
    if (state.futureStates.length === 0) return;
    
    set({ isRestoring: true });
    
    const nextState = state.futureStates[state.futureStates.length - 1];
    const newFutureStates = state.futureStates.slice(0, -1);
    
    const currentSnapshot: EditorStateSnapshot = {
      activeTheme: state.activeTheme,
      themeColor: state.themeColor,
      fontHeading: state.fontHeading,
      fontBody: state.fontBody,
      buttonShape: state.buttonShape,
      cardStyle: state.cardStyle,
      splashScreen: state.splashScreen,
      customTexts: state.customTexts,
      pageBlocks: state.pageBlocks,
      selectedProjects: state.selectedProjects,
    };
    
    set({
      ...nextState,
      pastStates: [...state.pastStates, currentSnapshot],
      futureStates: newFutureStates,
      canUndo: true,
      canRedo: newFutureStates.length > 0
    });

    setTimeout(() => get().setIsRestoring(false), 100);
  }
}));
