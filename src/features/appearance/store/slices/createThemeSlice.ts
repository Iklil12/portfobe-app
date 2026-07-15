import { StateCreator } from 'zustand';
import { EditorStore, ThemeState } from '../types';

export const createThemeSlice: StateCreator<EditorStore, [], [], ThemeState> = (set) => ({
  activeTheme: "brutalism",
  themeColor: "#000000",
  fontHeading: "Space Mono",
  fontBody: "Inter",
  buttonShape: "hard",
  cardStyle: "hard-shadow",
  splashScreen: true,
  favorites: [],
  customTexts: {},
  pageBlocks: [],
  selectedProjects: [],
  rawProjects: [],

  setActiveTheme: (val) => set({ activeTheme: val, isDirty: true }),
  setThemeColor: (val) => set({ themeColor: val, isDirty: true }),
  setFontHeading: (val) => set({ fontHeading: val, isDirty: true }),
  setFontBody: (val) => set({ fontBody: val, isDirty: true }),
  setButtonShape: (val) => set({ buttonShape: val, isDirty: true }),
  setCardStyle: (val) => set({ cardStyle: val, isDirty: true }),
  setSplashScreen: (val) => set({ splashScreen: val, isDirty: true }),
  setFavorites: (val) => set((state) => ({ favorites: typeof val === 'function' ? val(state.favorites) : val })),
  setCustomTexts: (val) => set((state) => ({ customTexts: typeof val === 'function' ? val(state.customTexts) : val, isDirty: true })),
  updateCustomText: (key, value) => set((state) => ({ customTexts: { ...state.customTexts, [key]: value }, isDirty: true })),
  setPageBlocks: (val) => set((state) => ({ pageBlocks: typeof val === 'function' ? val(state.pageBlocks) : val, isDirty: true })),
  setSelectedProjects: (val) => set((state) => ({ selectedProjects: typeof val === 'function' ? val(state.selectedProjects) : val, isDirty: true })),
  setRawProjects: (val) => set({ rawProjects: val }),
});
