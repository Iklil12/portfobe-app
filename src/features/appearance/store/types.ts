// src/features/appearance/store/types.ts

export const FORBIDDEN_BLOCKS_PER_THEME: Record<string, string[]> = {
  'absolute-noir': ['MARQUEE'],
  'split': ['MARQUEE']
};

export interface PageBlock {
  id: string;
  blockType: string;
  orderIndex: number;
  isVisible: boolean;
  isLocked?: boolean;
}

export interface DraftBlocksConfig {
  id: string;
  isLocked: boolean;
  blockType?: string;
  orderIndex?: number;
  isVisible?: boolean;
}

// -------------------------------------
// RESUME DATA TYPES
// -------------------------------------
export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  date: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  date: string;
}

export interface ResumeData {
  isInitialized?: boolean;
  template?: string;
  name: string;
  profession: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

// -------------------------------------
// STATE SLICES
// -------------------------------------

export interface UIState {
  isLoading: boolean;
  isSavingDraft: boolean;
  isPublishing: boolean;
  isEditorCollapsed: boolean;
  showOfflineModal: boolean;
  isThemeModalOpen: boolean;
  showProModal: boolean;
  isSeoModalOpen: boolean;
  previewMode: 'desktop' | 'mobile' | 'split';
  splitModeType: 'flexible' | 'fixed';
  desktopZoom: number;
  mobileZoom: number;
  isDraftsModalOpen: boolean;
  isSaveDraftModalOpen: boolean;
  isPublishModalOpen: boolean;
  isDirty: boolean;

  setIsLoading: (val: boolean) => void;
  setIsSavingDraft: (val: boolean) => void;
  setIsPublishing: (val: boolean) => void;
  setIsEditorCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
  setShowOfflineModal: (val: boolean) => void;
  setIsThemeModalOpen: (val: boolean) => void;
  setShowProModal: (val: boolean) => void;
  setIsSeoModalOpen: (val: boolean) => void;
  setPreviewMode: (val: 'desktop' | 'mobile' | 'split') => void;
  setSplitModeType: (val: 'flexible' | 'fixed') => void;
  setDesktopZoom: (val: number | ((prev: number) => number)) => void;
  setMobileZoom: (val: number | ((prev: number) => number)) => void;
  setIsDraftsModalOpen: (val: boolean) => void;
  setIsSaveDraftModalOpen: (val: boolean) => void;
  setIsPublishModalOpen: (val: boolean) => void;
  setIsDirty: (val: boolean) => void;
  zoomIn: (mode?: string) => void;
  zoomOut: (mode?: string) => void;
}

export interface ProfileState {
  fullName: string;
  professionText: string; // Renamed to avoid collision with resumeData.profession? Actually let's keep exact names.
  bioText: string;
  locationText: string;
  avatarUrl: string;
  subdomain: string;
  isLive: boolean;
  dbData: any; // Raw database profile data
  userPlan: string;
  planExpiredAt: Date | string | null;

  setFullName: (val: string) => void;
  setProfessionText: (val: string) => void;
  setBioText: (val: string) => void;
  setLocationText: (val: string) => void;
  setAvatarUrl: (val: string) => void;
  setSubdomain: (val: string) => void;
  setIsLive: (val: boolean) => void;
  setDbData: (val: any) => void;
  setUserPlan: (val: string) => void;
  setPlanExpiredAt: (val: Date | string | null) => void;
}

export interface ThemeState {
  activeTheme: string;
  themeColor: string;
  fontHeading: string;
  fontBody: string;
  buttonShape: string;
  cardStyle: string;
  splashScreen: boolean;
  favorites: string[];
  customTexts: Record<string, string>;
  pageBlocks: PageBlock[];
  selectedProjects: string[];
  rawProjects: any[];

  setActiveTheme: (val: string) => void;
  setThemeColor: (val: string) => void;
  setFontHeading: (val: string) => void;
  setFontBody: (val: string) => void;
  setButtonShape: (val: string) => void;
  setCardStyle: (val: string) => void;
  setSplashScreen: (val: boolean) => void;
  setFavorites: (val: string[] | ((prev: string[]) => string[])) => void;
  setCustomTexts: (val: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  updateCustomText: (key: string, value: string) => void;
  setPageBlocks: (val: PageBlock[] | ((prev: PageBlock[]) => PageBlock[])) => void;
  setSelectedProjects: (val: string[] | ((prev: string[]) => string[])) => void;
  setRawProjects: (val: any[]) => void;
}

export interface ResumeState {
  resumeData: ResumeData | null;
  setResumeData: (val: ResumeData | null | ((prev: ResumeData | null) => ResumeData | null)) => void;
  updateResumeData: (updates: Partial<ResumeData>) => void;
}

export interface DraftState {
  drafts: any[];
  activeDraftId: string | null;
  activeDraftName: string | null;
  publishedDraftId: string | null;

  setDrafts: (val: any[]) => void;
  setActiveDraftId: (val: string | null) => void;
  setActiveDraftName: (val: string | null) => void;
  setPublishedDraftId: (val: string | null) => void;
}

export interface HistoryState {
  pastStates: Partial<ThemeState>[];
  futureStates: Partial<ThemeState>[];
  historyTick: number;
  
  undo: () => void;
  redo: () => void;
  pushHistory: (state: Partial<ThemeState>) => void;
}

// -------------------------------------
// COMBINED EDITOR STORE
// -------------------------------------
export type EditorStore = UIState & ProfileState & ThemeState & ResumeState & DraftState & HistoryState & {
  // Thunk Actions (Async)
  fetchData: () => Promise<void>;
  saveSettings: (options?: { isPublishing?: boolean, draftName?: string }) => Promise<any>;
  saveResumeData: () => Promise<void>;
  loadDraft: (draftId: string) => Promise<void>;
  exitDraft: () => void;
  toggleFavorite: (themeId: string) => Promise<void>;
  resetToThemePreset: () => void;

  canUndo: boolean;
  canRedo: boolean;
};

// Legacy aliases for backward compatibility
export type ThemeEditorState = EditorStore;
export type ThemeEditorActions = EditorStore;
