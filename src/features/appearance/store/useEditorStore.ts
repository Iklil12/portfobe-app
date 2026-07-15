import { create } from 'zustand';
import { EditorStore } from './types';
import { createUISlice } from './slices/createUISlice';
import { createProfileSlice } from './slices/createProfileSlice';
import { createResumeSlice } from './slices/createResumeSlice';
import { createThemeSlice } from './slices/createThemeSlice';
import { createDraftSlice } from './slices/createDraftSlice';
import { createHistorySlice } from './slices/createHistorySlice';
import { showToast } from '@/shared/lib/customToast';
import { safeStringifyJson, safeParseJson } from '@/shared/lib/safeJson';

export const selectLivePreviewData = (state: EditorStore) => {
  return {
    ...(state.dbData || {}),
    profile: {
      ...(state.dbData?.profile || {}),
      fullName: state.fullName,
      profession: state.professionText,
      bio: state.bioText,
      location: state.locationText,
      avatarUrl: state.avatarUrl,
      subdomain: state.subdomain,
      isLive: state.isLive,
      resumeData: state.resumeData,
    },
    theme: {
      themeTemplate: state.activeTheme,
      themeColor: state.themeColor,
      fontHeading: state.fontHeading,
      fontBody: state.fontBody,
      cardStyle: state.cardStyle,
      buttonShape: state.buttonShape,
      splashScreen: state.splashScreen,
      customTexts: state.customTexts,
    },
    pageBlocks: state.pageBlocks,
    selectedProjects: state.selectedProjects,
    plan: state.userPlan,
    planExpiredAt: state.planExpiredAt,
    isDirty: state.isDirty,
  };
};

export const useEditorStore = create<EditorStore>((set, get, store) => ({
  ...createUISlice(set, get, store),
  ...createProfileSlice(set, get, store),
  ...createResumeSlice(set, get, store),
  ...createThemeSlice(set, get, store),
  ...createDraftSlice(set, get, store),
  ...createHistorySlice(set, get, store),

  get canUndo() {
    return get().pastStates.length > 0;
  },

  get canRedo() {
    return get().futureStates.length > 0;
  },

  fetchData: async () => {
    try {
      get().setIsLoading(true);
      
      const res = await fetch(`/api/appearance?t=${Date.now()}`);
      if (!res.ok) {
        showToast({ message: 'Koneksi ke database lambat. Mohon muat ulang halaman.', id: 'db-timeout', type: 'error' });
        throw new Error('Failed to fetch data');
      }
      const json = await res.json();
      
      // SUPER DEBUG: Store raw json so we can see it in UI
      if (typeof window !== 'undefined') {
        (window as any).DEBUG_JSON = json;
        console.log("==========================================");
        console.log("RAW JSON DARI API MENTAH (STRING):");
        console.log(JSON.stringify(json, null, 2));
        console.log("==========================================");
      }
      const profile = json.profile;
      const theme = json.siteAppearance; // FIX: theme is under siteAppearance
      const drafts = json.drafts || [];
      const blocks = json.pageBlocks || json.blocks || [];
      const selectedProjects = json.siteAppearance?.projects?.map((p: any) => p.projectId) || [];
      const rawProjects = json.projects || [];

      // Update Profile State
      get().setDbData(json || {});
      get().setFullName(profile?.fullName || 'Your Name');
      get().setProfessionText(profile?.profession || 'Profession / Short Bio');
      get().setBioText(profile?.bio || '');
      get().setLocationText(profile?.location || 'Indonesia');
      get().setAvatarUrl(profile?.avatarUrl || '');
      get().setSubdomain(profile?.subdomain || '');
      get().setIsLive(profile?.isLive !== false);
      get().setUserPlan(json.plan || 'FREE');
      get().setPlanExpiredAt(json.planExpiredAt || null);
      
      // Update Resume State
      if (profile?.resumeData) {
        get().setResumeData(typeof profile.resumeData === 'string' ? safeParseJson(profile.resumeData, null) : profile.resumeData);
      }

      // Update Theme State
      if (theme) {
        get().setActiveTheme(theme.themeTemplate || 'brutalism');
        get().setThemeColor(theme.themeColor || '#000000');
        get().setFontHeading(theme.fontHeading || 'Space Mono');
        get().setFontBody(theme.fontBody || 'Inter');
        get().setButtonShape(theme.buttonShape || 'hard');
        get().setCardStyle(theme.cardStyle || 'hard-shadow');
        get().setSplashScreen(theme.splashScreen ?? true);
        get().setCustomTexts(safeParseJson(theme.customTexts, {}) || {});
      }

      get().setPageBlocks(blocks);
      get().setSelectedProjects(selectedProjects);
      get().setRawProjects(rawProjects);
      
      // Update Draft State
      get().setDrafts(drafts);
      const publishedDraftId = json.siteAppearance?.publishedDraftId || null;
      get().setPublishedDraftId(publishedDraftId);
      
      // Reset to LIVE version by default
      get().setActiveDraftId(null);
      get().setActiveDraftName(null);

      get().setIsDirty(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast({ type: 'error', message: 'Gagal memuat data pengaturan.', id: 'fetch-err' });
    } finally {
      get().setIsLoading(false);
    }
  },

  saveSettings: async (options = {}) => {
    try {
      if (options.isPublishing) get().setIsPublishing(true);
      else get().setIsSavingDraft(true);

      const state = get();
      const payload = {
        themeId: state.activeTheme,
        themeColor: state.themeColor,
        fontHeading: state.fontHeading,
        fontBody: state.fontBody,
        buttonShape: state.buttonShape,
        cardStyle: state.cardStyle,
        splashScreen: state.splashScreen,
        customTexts: safeStringifyJson(state.customTexts),
        pageBlocks: state.pageBlocks.map((b) => ({
          blockType: b.blockType,
          orderIndex: b.orderIndex,
          isVisible: b.isVisible,
        })),
        selectedProjects: state.selectedProjects,
        isDraft: !options.isPublishing,
        draftName: options.draftName || state.activeDraftName || `Draft - ${new Date().toLocaleDateString()}`,
      };

      const isPublishing = !!options.isPublishing;
      const endpoint = isPublishing ? '/api/appearance' : '/api/appearance/drafts';
      let method = isPublishing ? 'PATCH' : 'POST';
      
      // If saving an existing draft, use PUT and include ID
      if (!isPublishing && state.activeDraftId) {
        method = 'PUT';
        (payload as any).id = state.activeDraftId;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const result = await res.json();
      const returnedDraftId = result.id || result.draftId || (options.isPublishing ? state.activeDraftId : undefined);

      if (options.isPublishing) {
        if (returnedDraftId) get().setPublishedDraftId(returnedDraftId);
        showToast({ type: 'success', message: 'Perubahan berhasil dipublikasikan!', id: 'pub-succ' });
      } else {
        showToast({ type: 'success', message: 'Draf berhasil disimpan!', id: 'draft-succ' });
      }

      get().setActiveDraftId(returnedDraftId || null);
      get().setIsDirty(false);
      
      // Refresh drafts list
      const fetchRes = await fetch('/api/appearance');
      if (fetchRes.ok) {
        const json = await fetchRes.json();
        get().setDrafts(json.drafts || []);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showToast({ type: 'error', message: error.message || 'Gagal menyimpan pengaturan.', id: 'save-err' });
      throw error;
    } finally {
      get().setIsPublishing(false);
      get().setIsSavingDraft(false);
      get().setIsSaveDraftModalOpen(false);
      get().setIsPublishModalOpen(false);
    }
  },

  saveResumeData: async () => {
    try {
      const state = get();
      if (!state.resumeData) return;
      
      const res = await fetch('/api/profile/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: state.resumeData }),
      });
      
      if (!res.ok) throw new Error("Gagal menyimpan CV");
      showToast({ type: 'success', message: 'Data CV berhasil disimpan!', id: 'cv-succ' });
      
    } catch (e) {
      console.error(e);
      showToast({ type: 'error', message: 'Terjadi kesalahan saat menyimpan CV.', id: 'cv-err' });
    }
  },

  loadDraft: async (draftId: string) => {
    // Basic implementation to switch to a draft
    const state = get();
    const draft = state.drafts.find((d: any) => d.id === draftId);
    if (!draft) return;
    
    get().setActiveDraftId(draftId);
    get().setActiveDraftName(draft.name);
    get().setActiveTheme(draft.themeTemplate);
    get().setThemeColor(safeParseJson(draft.designTokens, {} as any).themeColor || '#000000');
    get().setFontHeading(safeParseJson(draft.designTokens, {} as any).fontHeading || 'Space Mono');
    get().setFontBody(safeParseJson(draft.designTokens, {} as any).fontBody || 'Inter');
    get().setButtonShape(safeParseJson(draft.designTokens, {} as any).buttonShape || 'hard');
    get().setCardStyle(safeParseJson(draft.designTokens, {} as any).cardStyle || 'hard-shadow');
    get().setSplashScreen(draft.splashScreen);
    get().setCustomTexts(safeParseJson(draft.customTexts, {}));
    
    const draftProjects = draft.projects?.map((p: any) => p.projectId) || [];
    get().setSelectedProjects(draftProjects);
    
    get().setIsDirty(false);
    showToast({ type: 'success', message: `Draf "${draft.name}" dimuat.`, id: 'draft-load' });
  },

  exitDraft: () => {
    get().fetchData();
    showToast({ type: 'info', message: 'Keluar dari mode draf.', id: 'draft-exit' });
  },

  toggleFavorite: async (themeId: string) => {
    try {
      const state = get();
      const isFav = state.favorites.includes(themeId);
      
      // Optimistic update
      if (isFav) {
        get().setFavorites(state.favorites.filter(id => id !== themeId));
      } else {
        get().setFavorites([...state.favorites, themeId]);
      }

      await fetch('/api/appearance/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
    } catch (e) {
      console.error(e);
      // Revert if error
      get().fetchData(); 
    }
  },

  resetToThemePreset: () => {
    showToast({ type: 'info', message: 'Reset to preset not fully implemented in this store yet.', id: 'reset-info' });
  }
}));
