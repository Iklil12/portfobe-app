import { StateCreator } from 'zustand';
import { EditorStore, HistoryState, ThemeState } from '../types';

export const createHistorySlice: StateCreator<EditorStore, [], [], HistoryState> = (set, get) => ({
  pastStates: [],
  futureStates: [],
  historyTick: 0,

  undo: () => {
    const { pastStates, futureStates, historyTick } = get();
    if (pastStates.length === 0) return;

    const previousState = pastStates[pastStates.length - 1];
    const newPast = pastStates.slice(0, -1);
    
    // Capture current snapshot for redo
    const currentSnapshot: Partial<ThemeState> = {
      activeTheme: get().activeTheme,
      themeColor: get().themeColor,
      fontHeading: get().fontHeading,
      fontBody: get().fontBody,
      buttonShape: get().buttonShape,
      cardStyle: get().cardStyle,
      splashScreen: get().splashScreen,
      customTexts: get().customTexts,
      pageBlocks: get().pageBlocks,
      selectedProjects: get().selectedProjects,
    };

    set({
      pastStates: newPast,
      futureStates: [...futureStates, currentSnapshot],
      historyTick: historyTick + 1,
      ...previousState,
    });
  },

  redo: () => {
    const { pastStates, futureStates, historyTick } = get();
    if (futureStates.length === 0) return;

    const nextState = futureStates[futureStates.length - 1];
    const newFuture = futureStates.slice(0, -1);
    
    // Capture current snapshot for undo
    const currentSnapshot: Partial<ThemeState> = {
      activeTheme: get().activeTheme,
      themeColor: get().themeColor,
      fontHeading: get().fontHeading,
      fontBody: get().fontBody,
      buttonShape: get().buttonShape,
      cardStyle: get().cardStyle,
      splashScreen: get().splashScreen,
      customTexts: get().customTexts,
      pageBlocks: get().pageBlocks,
      selectedProjects: get().selectedProjects,
    };

    set({
      pastStates: [...pastStates, currentSnapshot],
      futureStates: newFuture,
      historyTick: historyTick + 1,
      ...nextState,
    });
  },

  pushHistory: (stateSnapshot) => {
    const { pastStates, historyTick } = get();
    const newPast = [...pastStates, stateSnapshot];
    // Keep max 15 items
    if (newPast.length > 15) newPast.shift();

    set({
      pastStates: newPast,
      futureStates: [],
      historyTick: historyTick + 1,
    });
  }
});
