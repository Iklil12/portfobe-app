import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { useSearchParams } from 'next/navigation';
import { showToast } from '@/lib/customToast';
import { safeParseJson, safeStringifyJson } from '@/lib/safeJson';

const UNIVERSAL_BLOCK_ORDER = ['HERO', 'MARQUEE', 'ABOUT', 'SKILLS', 'EXPERIENCE', 'SERVICES', 'STATS', 'PROJECTS', '3D', 'PENPOT', 'CANVA', 'GITHUB', 'AWARDS', 'TESTIMONIALS', 'FOOTER'];

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
const THEME_BLOCK_PRESETS: Record<string, string[]> = {
  'spatial': UNIVERSAL_BLOCK_ORDER,
  'minimalist': UNIVERSAL_BLOCK_ORDER,
  'obsidian-reel': UNIVERSAL_BLOCK_ORDER,
  'aura-kinetic': UNIVERSAL_BLOCK_ORDER,
  'editorial': UNIVERSAL_BLOCK_ORDER,
  'viewfinder': UNIVERSAL_BLOCK_ORDER,
  'midnight-emulsion': UNIVERSAL_BLOCK_ORDER,
  'split': UNIVERSAL_BLOCK_ORDER,
  'absolute-noir': UNIVERSAL_BLOCK_ORDER,
  'cinematic': UNIVERSAL_BLOCK_ORDER,
  'acid': UNIVERSAL_BLOCK_ORDER,
  'acid-tech': UNIVERSAL_BLOCK_ORDER,
  'bentogrid': UNIVERSAL_BLOCK_ORDER,
  'brutalism': UNIVERSAL_BLOCK_ORDER,
  'cinematic-gallery': UNIVERSAL_BLOCK_ORDER,
  'monolith': UNIVERSAL_BLOCK_ORDER,
  'layered-monolith': UNIVERSAL_BLOCK_ORDER,
  'kinetic-avant-garde': UNIVERSAL_BLOCK_ORDER,
  'nexus-noir': UNIVERSAL_BLOCK_ORDER,
  'horizontal-flow': UNIVERSAL_BLOCK_ORDER,
  'default': UNIVERSAL_BLOCK_ORDER
};

const applyPresetToBlocks = (blocks: PageBlock[], themeId: string) => {
  const preset = THEME_BLOCK_PRESETS[themeId] || THEME_BLOCK_PRESETS['default'];
  const newBlocks = [...blocks].sort((a, b) => {
    const indexA = preset.indexOf(a.blockType);
    const indexB = preset.indexOf(b.blockType);
    const finalA = indexA === -1 ? 999 : indexA;
    const finalB = indexB === -1 ? 999 : indexB;
    return finalA - finalB;
  });
  return newBlocks.map((b, i) => ({ ...b, orderIndex: i }));
};

export function useThemeEditor() {
  const searchParams = useSearchParams();
  const previewTheme = searchParams.get('previewTheme');

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const ZOOM_MIN = 0.4;
  const ZOOM_MAX = 1.0;
  const ZOOM_STEP = 0.1;
  const [desktopZoom, setDesktopZoom] = useState(0.75);
  const zoomIn = () => setDesktopZoom(z => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(2))));
  const zoomOut = () => setDesktopZoom(z => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(2))));

  // --- STATE UNTUK DATA PROFIL ---
  const [fullName, setFullName] = useState("Nama Anda");
  const fullNameRef = useRef(fullName);
  useEffect(() => { fullNameRef.current = fullName; }, [fullName]);
  
  const [profession, setProfession] = useState("Profesi / Bio Singkat");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("Indonesia");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [dbData, setDbData] = useState<any>({});

  // --- STATE UNTUK TEMA & PENGATURAN ---
  const [activeTheme, setActiveTheme] = useState("brutalism");
  const [themeColor, setThemeColor] = useState("#000000");
  const [fontHeading, setFontHeading] = useState("Space Mono");
  const [fontBody, setFontBody] = useState("Inter");
  const [buttonShape, setButtonShape] = useState("hard");
  const [cardStyle, setCardStyle] = useState("hard-shadow");
  const [splashScreen, setSplashScreen] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});
  const customTextsRef = useRef(customTexts);
  useEffect(() => { customTextsRef.current = customTexts; }, [customTexts]);
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);
  const dataLoaded = useRef(false);

  // --- STATE DRAFTS & PUBLISHING ---
  const [drafts, setDrafts] = useState<any[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeDraftName, setActiveDraftName] = useState<string | null>(null);
  const [publishedDraftId, setPublishedDraftId] = useState<string | null>(null);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  
  // Menandakan apakah ada draft yang sudah disimpan tapi belum dipublish di sesi ini
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);

  // --- STATE UNDO/REDO ---
  type EditorStateSnapshot = {
    activeTheme: string;
    themeColor: string;
    fontHeading: string;
    fontBody: string;
    buttonShape: string;
    cardStyle: string;
    splashScreen: boolean;
    customTexts: Record<string, string>;
    pageBlocks: PageBlock[];
  };

  const pastStatesRef = useRef<EditorStateSnapshot[]>([]);
  const futureStatesRef = useRef<EditorStateSnapshot[]>([]);
  const [historyTick, setHistoryTick] = useState(0);
  const isRestoring = useRef(false);
  const prevCombinedState = useRef<EditorStateSnapshot | null>(null);

  const currentSnapshot: EditorStateSnapshot = {
    activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts, pageBlocks
  };

  useEffect(() => {
    // Inisialisasi awal begitu data selesai diloading agar BASELINE terekam
    if (!isLoading && !prevCombinedState.current) {
      prevCombinedState.current = currentSnapshot;
      return;
    }

    if (isRestoring.current || isLoading) return;

    const timer = setTimeout(() => {
      if (prevCombinedState.current) {
        const prevStr = safeStringifyJson(prevCombinedState.current);
        const currStr = safeStringifyJson(currentSnapshot);
        
        if (prevStr !== currStr) {
          pastStatesRef.current.push(prevCombinedState.current);
          if (pastStatesRef.current.length > 30) pastStatesRef.current.shift();
          futureStatesRef.current = [];
          setHistoryTick(t => t + 1);
        }
      }
      prevCombinedState.current = currentSnapshot;
    }, 50);

    return () => clearTimeout(timer);
  }, [activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, pageBlocks, isLoading]);

  const undo = () => {
    if (pastStatesRef.current.length === 0) return;
    isRestoring.current = true;
    
    const previousState = pastStatesRef.current.pop()!;
    futureStatesRef.current.push(currentSnapshot);
    setHistoryTick(t => t + 1);
    
    setActiveTheme(previousState.activeTheme);
    setThemeColor(previousState.themeColor);
    setFontHeading(previousState.fontHeading);
    setFontBody(previousState.fontBody);
    setButtonShape(previousState.buttonShape);
    setCardStyle(previousState.cardStyle);
    setSplashScreen(previousState.splashScreen);
    setCustomTexts(previousState.customTexts);
    setPageBlocks(previousState.pageBlocks);
    
    prevCombinedState.current = previousState;
    setTimeout(() => { isRestoring.current = false; }, 100);
  };

  const redo = () => {
    if (futureStatesRef.current.length === 0) return;
    isRestoring.current = true;
    
    const nextState = futureStatesRef.current.pop()!;
    pastStatesRef.current.push(currentSnapshot);
    setHistoryTick(t => t + 1);
    
    setActiveTheme(nextState.activeTheme);
    setThemeColor(nextState.themeColor);
    setFontHeading(nextState.fontHeading);
    setFontBody(nextState.fontBody);
    setButtonShape(nextState.buttonShape);
    setCardStyle(nextState.cardStyle);
    setSplashScreen(nextState.splashScreen);
    setCustomTexts(nextState.customTexts);
    setPageBlocks(nextState.pageBlocks);
    
    prevCombinedState.current = nextState;
    setTimeout(() => { isRestoring.current = false; }, 100);
  };

  // Track clean state for Anti-Spam
  const [lastSavedState, setLastSavedState] = useState<any>(null);

  // Compute isDirty
  const isDirty = lastSavedState ? (
    activeTheme !== lastSavedState.activeTheme ||
    themeColor !== lastSavedState.themeColor ||
    fontHeading !== lastSavedState.fontHeading ||
    fontBody !== lastSavedState.fontBody ||
    buttonShape !== lastSavedState.buttonShape ||
    cardStyle !== lastSavedState.cardStyle ||
    splashScreen !== lastSavedState.splashScreen ||
    fullName !== lastSavedState.fullName ||
    profession !== lastSavedState.profession ||
    bio !== lastSavedState.bio ||
    location !== lastSavedState.location ||
    safeStringifyJson(customTexts) !== safeStringifyJson(lastSavedState.customTexts) ||
    safeStringifyJson(pageBlocks.map(b => ({id: b.id, orderIndex: b.orderIndex, isVisible: b.isVisible, isLocked: b.isLocked}))) !== 
    safeStringifyJson(lastSavedState.pageBlocks?.map((b: PageBlock) => ({id: b.id, orderIndex: b.orderIndex, isVisible: b.isVisible, isLocked: b.isLocked})))
  ) : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resApp = await fetch('/api/appearance', { cache: 'no-store' });
        let appData: any = {};

        if (resApp.ok) {
          appData = await resApp.json();

          if (appData) {
            if (appData.profile) {
              if (appData.profile.fullName) setFullName(appData.profile.fullName);
              if (appData.profile.profession) setProfession(appData.profile.profession);
              if (appData.profile.bio) setBio(appData.profile.bio);
              if (appData.profile.location) setLocation(appData.profile.location);
              if (appData.profile.avatarUrl) setAvatarUrl(appData.profile.avatarUrl);
              if (appData.profile.subdomain) setSubdomain(appData.profile.subdomain);
            }

            if (appData.isLive !== undefined) setIsLive(appData.isLive);

            if (appData.siteAppearance) {
              const sa = appData.siteAppearance;
              
              // LOGIKA TEASER: Gunakan tema dari URL jika ada (Preview Mode)
              // Jika tidak ada, baru gunakan tema dari database
              if (previewTheme) {
                setActiveTheme(previewTheme);
              } else if (sa.themeTemplate) {
                setActiveTheme(sa.themeTemplate);
              }

              if (sa.themeColor) setThemeColor(sa.themeColor);
              if (sa.fontHeading) setFontHeading(sa.fontHeading);
              if (sa.fontBody) setFontBody(sa.fontBody);
              if (sa.buttonShape) setButtonShape(sa.buttonShape);
              if (sa.cardStyle) setCardStyle(sa.cardStyle);
              if (sa.splashScreen !== undefined && sa.splashScreen !== null) {
                setSplashScreen(sa.splashScreen);
              }

              if (sa.favoriteThemes !== undefined) {
                // Ambil dari ThemeFavorite table langsung
              }
              
              if (sa.customTexts) {
                const parsedTexts = safeParseJson(sa.customTexts, {});
                setCustomTexts(parsedTexts || {});
              }
              
              if (sa.publishedDraftId) setPublishedDraftId(sa.publishedDraftId);
              
              // Set lastSavedState for dirty tracking
              // PENTING: Gunakan blok yang sudah difilter (tanpa legacy INTEGRATIONS)
              let cleanBlocks = (appData.pageBlocks || []).filter((b: PageBlock) => !b.blockType.includes('INTEGRATIONS'));
              
              const texts = sa.customTexts ? safeParseJson(sa.customTexts, {}) : {};
              const textsObj = texts as Record<string, any>;
              if (textsObj?.draftBlocksConfig) {
                 cleanBlocks = cleanBlocks.map((b: PageBlock) => {
                    const config = textsObj.draftBlocksConfig.find((d: DraftBlocksConfig) => d.id === b.id);
                    return config ? { ...b, isLocked: config.isLocked } : b;
                 });
              }

              setLastSavedState({
                activeTheme: sa.themeTemplate || 'minimalist',
                themeColor: sa.themeColor || '#000000',
                fontHeading: sa.fontHeading || 'Inter',
                fontBody: sa.fontBody || 'Inter',
                buttonShape: sa.buttonShape || 'rounded',
                cardStyle: sa.cardStyle || 'flat',
                splashScreen: sa.splashScreen || false,
                customTexts: texts,
                pageBlocks: cleanBlocks,
                fullName: appData.profile?.fullName || "Nama Anda",
                profession: appData.profile?.profession || "Profesi / Bio Singkat",
                bio: appData.profile?.bio || "",
                location: appData.profile?.location || "Indonesia"
              });
            }
          }
        }

        setDbData(appData);
        if (appData.pageBlocks) {
          let validBlocks = (appData.pageBlocks || []).filter((b: PageBlock) => !b.blockType.includes('INTEGRATIONS'));
          if (appData.siteAppearance?.customTexts) {
             const texts = safeParseJson(appData.siteAppearance.customTexts, {});
             const textsObj = texts as Record<string, any>;
             if (textsObj?.draftBlocksConfig) {
                validBlocks = validBlocks.map((b: PageBlock) => {
                   const config = textsObj.draftBlocksConfig.find((d: DraftBlocksConfig) => d.id === b.id);
                   return config ? { ...b, isLocked: config.isLocked } : b;
                });
             }
          }

          if (previewTheme) {
            // Jika masuk dari halaman Tema, terapkan preset tema tujuan
            const presetBlocks = applyPresetToBlocks(validBlocks, previewTheme);
            setPageBlocks(presetBlocks);
          } else {
            // Jika masuk normal, biarkan susunan sesuai database (Live Web)
            setPageBlocks(validBlocks);
          }
        }

        // Ambil favorit dari tabel ThemeFavorite
        try {
          const favRes = await fetch('/api/themes/favorite');
          if (favRes.ok) {
            const favData = await favRes.json();
            setFavorites(Array.isArray(favData.favorites) ? favData.favorites : []);
          }
        } catch {
          setFavorites([]);
        }

        // Ambil Drafts
        try {
          const draftsRes = await fetch('/api/appearance/drafts');
          if (draftsRes.ok) {
            const draftsData = await draftsRes.json();
            const validDrafts = Array.isArray(draftsData) ? draftsData : [];
            setDrafts(validDrafts);

            // Skenario 1: Jika tidak sedang preview tema lain, dan ada draft yang Live, 
            // otomatis aktifkan draft tersebut agar user melanjutkan kerjanya.
            if (!previewTheme && appData.siteAppearance?.publishedDraftId) {
              const liveDraft = validDrafts.find((d: any) => d.id === appData.siteAppearance.publishedDraftId);
              if (liveDraft) {
                setActiveDraftId(liveDraft.id);
                setActiveDraftName(liveDraft.name);
                
                // Deteksi apakah draft ini punya perubahan yang belum di-publish
                const isDraftDifferent = 
                  liveDraft.themeTemplate !== appData.siteAppearance.themeTemplate ||
                  liveDraft.themeColor !== appData.siteAppearance.themeColor ||
                  liveDraft.fontHeading !== appData.siteAppearance.fontHeading ||
                  liveDraft.fontBody !== appData.siteAppearance.fontBody ||
                  liveDraft.buttonShape !== appData.siteAppearance.buttonShape ||
                  liveDraft.cardStyle !== appData.siteAppearance.cardStyle ||
                  liveDraft.splashScreen !== appData.siteAppearance.splashScreen ||
                  liveDraft.customTexts !== appData.siteAppearance.customTexts;
                  
                setHasUnpublishedChanges(isDraftDifferent);
                // --- TERAPKAN DATA DRAFT KE STATE EDITOR AGAR PERUBAHAN TIDAK HILANG SAAT REFRESH ---
                setActiveTheme(liveDraft.themeTemplate);
                setThemeColor(liveDraft.themeColor);
                setFontHeading(liveDraft.fontHeading);
                setFontBody(liveDraft.fontBody);
                setButtonShape(liveDraft.buttonShape);
                setCardStyle(liveDraft.cardStyle);
                setSplashScreen(liveDraft.splashScreen);
                
                const parsedTexts: any = safeParseJson(liveDraft.customTexts, {});
                setCustomTexts(parsedTexts);
                
                const baseBlocks = appData.pageBlocks ? appData.pageBlocks.filter((b: PageBlock) => !b.blockType.includes('INTEGRATIONS')) : [];
                let draftBlocks = baseBlocks;
                
                if (parsedTexts.draftBlocksConfig) {
                  draftBlocks = baseBlocks.map((b: PageBlock) => {
                    const draftCfg = parsedTexts.draftBlocksConfig.find((d: DraftBlocksConfig) => 
                      d.id === b.id || (d.blockType && d.blockType === b.blockType)
                    );
                    if (draftCfg) {
                      return { ...b, orderIndex: draftCfg.orderIndex, isVisible: draftCfg.isVisible, isLocked: draftCfg.isLocked };
                    }
                    return { ...b };
                  }).sort((a: PageBlock, b: PageBlock) => a.orderIndex - b.orderIndex);
                  
                  setPageBlocks(draftBlocks);
                }

                // Update pelacak isDirty agar tidak "berubah" padahal baru di-load
                setLastSavedState((prev: any) => ({
                  ...prev,
                  activeTheme: liveDraft.themeTemplate,
                  themeColor: liveDraft.themeColor,
                  fontHeading: liveDraft.fontHeading,
                  fontBody: liveDraft.fontBody,
                  buttonShape: liveDraft.buttonShape,
                  cardStyle: liveDraft.cardStyle,
                  splashScreen: liveDraft.splashScreen,
                  customTexts: parsedTexts,
                  pageBlocks: draftBlocks
                }));
              }
            }
          }
        } catch (e) {
          console.error(e);
        }

      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          dataLoaded.current = true;
        }, 500);
      }
    };
    fetchData();
  }, [previewTheme]); // Re-run jika previewTheme berubah

  // Toggle favorit via API baru (ThemeFavorite table) + optimistic update
  const toggleFavorite = async (themeId: string) => {
    const isFav = favorites.includes(themeId);
    const updated = isFav ? favorites.filter(id => id !== themeId) : [...favorites, themeId];
    setFavorites(updated);
    toast(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ❤️', {
      id: `fav-${themeId}`,
      style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '12px' }
    });
    try {
      await fetch('/api/themes/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
    } catch {
      setFavorites(favorites); // rollback
    }
  };

  // Listener untuk pesan dari iframe preview (Inline Editing)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // SECURITY: Cegah injeksi dari domain asing
      if (event.origin !== window.location.origin && !event.origin.includes('localhost') && !event.origin.includes('127.0.0.1')) return;

      if (event.data?.type === 'INLINE_EDIT' && event.data?.entity === 'profile') {
        const { field, value } = event.data;
        
        let finalField = field;
        let finalValue = value;

        // Gabungkan firstName dan lastName menjadi fullName
        if (field === 'firstName') {
          finalField = 'fullName';
          const lastName = fullNameRef.current.split(' ').slice(1).join(' ');
          finalValue = `${value} ${lastName}`.trim();
          setFullName(finalValue);
        } else if (field === 'lastName') {
          finalField = 'fullName';
          const firstName = fullNameRef.current.split(' ')[0];
          finalValue = `${firstName} ${value}`.trim();
          setFullName(finalValue);
        } else {
          // 1. Update State Lokal agar UI berubah seketika
          if (field === 'fullName') setFullName(value);
          if (field === 'bio') setBio(value);
          if (field === 'profession') setProfession(value);
          if (field === 'location') setLocation(value);
        }
      } else if (event.data?.type === 'INLINE_EDIT' && event.data?.entity === 'appearance') {
        const { field, value } = event.data;
        setCustomTexts({ ...customTextsRef.current, [field]: value });
      } else if (event.data?.type === 'BLOCK_MOVE_UP') {
        setPageBlocks(prev => {
          const index = prev.findIndex(b => b.id === event.data.blockId);
          if (index > 0 && !prev[index - 1].blockType.includes('HERO')) {
            const newBlocks = [...prev];
            const temp = newBlocks[index];
            newBlocks[index] = newBlocks[index - 1];
            newBlocks[index - 1] = temp;
            
            const updated = newBlocks.map((b, i) => ({ ...b, orderIndex: i }));
            return updated;
          }
          return prev;
        });
      } else if (event.data?.type === 'BLOCK_MOVE_DOWN') {
        setPageBlocks(prev => {
          const index = prev.findIndex(b => b.id === event.data.blockId);
          if (index >= 0 && index < prev.length - 1 && !prev[index + 1].blockType.includes('HERO')) {
            const newBlocks = [...prev];
            const temp = newBlocks[index];
            newBlocks[index] = newBlocks[index + 1];
            newBlocks[index + 1] = temp;
            
            const updated = newBlocks.map((b, i) => ({ ...b, orderIndex: i }));
            return updated;
          }
          return prev;
        });
      } else if (event.data?.type === 'BLOCK_TOGGLE_VISIBILITY') {
        const { blockId, currentVisibility } = event.data;
        setPageBlocks(prev => {
          const updated = prev.map(b => b.id === blockId ? { ...b, isVisible: !currentVisibility } : b);
          return updated;
        });
      } else if (event.data?.type === 'BLOCK_TOGGLE_LOCK') {
        const { blockId, currentLockState } = event.data;
        setPageBlocks(prev => {
          const updated = prev.map(b => b.id === blockId ? { ...b, isLocked: !currentLockState } : b);
          return updated;
        });
      } else if (event.data?.type === 'BLOCK_DELETE') {
        const { blockId } = event.data;
        setPageBlocks(prev => prev.filter(b => b.id !== blockId));
      } else if (event.data?.type === 'BLOCK_ADD') {
        const { blockType, insertIndex } = event.data;
        const newId = `blk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setPageBlocks(prev => {
          const newBlock = { id: newId, blockType, orderIndex: prev.length, isVisible: true, isLocked: false };
          let newBlocks = [...prev];
          if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= prev.length) {
            newBlocks.splice(insertIndex, 0, newBlock);
          } else {
            newBlocks.push(newBlock);
          }
          // Re-index all blocks to ensure orderIndex is correct
          return newBlocks.map((b, i) => ({ ...b, orderIndex: i }));
        });
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const generateFreshBlocks = (themeId: string, currentBlocks: PageBlock[]) => {
    const targetPreset = THEME_BLOCK_PRESETS[themeId] || THEME_BLOCK_PRESETS['default'];
    
    const freshBlocks = targetPreset.map((type, index) => {
      const existingBlock = currentBlocks.find(b => b.blockType === type);
      if (existingBlock) {
        return { ...existingBlock, orderIndex: index, isLocked: false, isVisible: true };
      }
      return {
        id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`,
        blockType: type,
        orderIndex: index,
        isVisible: true,
        isLocked: false
      };
    });

    // PERMINTAAN USER: Blok opsional seperti FAQ harus benar-benar hilang saat pindah tema, bukan di-hide
    return freshBlocks;
  };

  const changeThemeWithPreset = (themeId: string) => {
    setActiveTheme(themeId);
    
    // PERMINTAAN USER: saat pindah tema, tidak mewarisi kondisi opsional apapun (FAQ benar-benar hilang)
    setPageBlocks(prev => generateFreshBlocks(themeId, prev));
  };

  const resetToThemePreset = () => {
    setPageBlocks(prev => generateFreshBlocks(activeTheme, prev));
    toast.success('BERHASIL! Susunan blok dikembalikan ke setelan pabrik (segar)!', {
      id: 'reset-theme-toast', // ID UNIK ANTI-SPAM: Akan mereplace toast lama yang punya ID sama, bukan menumpuk
      style: { borderRadius: '0px', background: '#09090b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }
    });
  };

  const updateCustomText = (field: string, value: string) => {
    setCustomTexts((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveDraft = async (draftName?: string, draftDescription?: string) => {
    setIsSavingDraft(true);
    const toastId = toast.loading(activeDraftId ? 'Menyimpan perubahan draft...' : 'Menyimpan draft baru...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const payload = { 
        id: activeDraftId || undefined,
        name: draftName,
        description: draftDescription,
        themeTemplate: activeTheme, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle, 
        splashScreen,
        customTexts: {
          ...customTexts,
          draftBlocksConfig: pageBlocks.map((b: PageBlock) => ({ 
            id: b.id, 
            blockType: b.blockType, 
            orderIndex: b.orderIndex, 
            isVisible: b.isVisible,
            isLocked: b.isLocked
          }))
        } 
      };

      const method = activeDraftId ? 'PUT' : 'POST';
      const res = await fetch('/api/appearance/drafts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.dismiss(toastId);
        showToast({ message: activeDraftId ? 'Perubahan disimpan!' : 'Draft baru berhasil dibuat!', id: toastId, icon: 'fa-check-circle' });
        
        // Refresh drafts
        const draftsRes = await fetch('/api/appearance/drafts');
        if (draftsRes.ok) {
          setDrafts(await draftsRes.json());
        }
        
        setActiveDraftId(data.id);
        setActiveDraftName(data.name);
        setIsSaveDraftModalOpen(false);
        setLastSavedState({
          activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts, pageBlocks: [...pageBlocks],
          fullName, profession, bio, location
        });
        
        // Tandai bahwa draft telah diubah dan belum dipublish
        setHasUnpublishedChanges(true);
      } else {
        if (res.status === 403 && data.code === 'FEATURE_LOCKED') {
          toast.dismiss(toastId);
          setShowProModal(true);
          return;
        }
        throw new Error(data.error || 'Gagal menyimpan draft');
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || 'Terjadi kesalahan server.', { style: { background: '#333', color: '#fff' }});
    } finally {
      setIsSavingDraft(false);
    }
  };

  const publishDesign = async () => {
    setIsPublishing(true);
    const toastId = toast.loading('Menyimpan & menayangkan desain...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const payload = { 
        themeTemplate: activeTheme, 
        themeColor, 
        fontHeading, 
        fontBody, 
        buttonShape, 
        cardStyle, 
        splashScreen,
        customTexts: {
          ...customTexts,
          draftBlocksConfig: pageBlocks.map((b: PageBlock) => ({ 
            id: b.id, 
            blockType: b.blockType, 
            orderIndex: b.orderIndex, 
            isVisible: b.isVisible,
            isLocked: b.isLocked
          }))
        },
        publishedDraftId: activeDraftId || null // Set pelacak draft yang sedang tayang
      };
      
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      const appearancePromise = fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const profilePromise = fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, profession, bio, location })
      });

      const blocksPromise = fetch('/api/blocks/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: pageBlocks.map((b: PageBlock) => ({ id: b.id, blockType: b.blockType, orderIndex: b.orderIndex, isVisible: b.isVisible, isLocked: b.isLocked })) })
      });

      const promises: Promise<any>[] = [appearancePromise, profilePromise, blocksPromise, delayPromise];

      // JIKA SEDANG BERADA DI DALAM DRAFT, UPDATE DRAFT TERSEBUT JUGA!
      if (activeDraftId) {
        const draftPromise = fetch('/api/appearance/drafts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: activeDraftId })
        });
        promises.push(draftPromise);
      }

      const results = await Promise.all(promises);
      const resApp = results[0];
      const resProf = results[1];
      const resBlocks = results[2];

      if (resApp.ok && resProf.ok && resBlocks.ok) {
        mutate('/api/dashboard/sync');
        toast.dismiss(toastId);
        setIsPublishModalOpen(true);
        
        setPublishedDraftId(activeDraftId || null);
        setLastSavedState({
          activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts, pageBlocks: [...pageBlocks],
          fullName, profession, bio, location
        });
        setHasUnpublishedChanges(false);

      } else {
        if (!resApp.ok) {
          const errorData = await resApp.json().catch(() => ({}));
          if (resApp.status === 403 && (errorData.code === 'THEME_LOCKED' || errorData.code === 'FEATURE_LOCKED')) {
            toast.dismiss(toastId);
            setShowProModal(true); 
            return;
          }
        }
        throw new Error('Gagal publish');
      }
    } catch (error) {
      showToast({ message: 'Terjadi kesalahan server.', id: toastId, icon: 'fa-exclamation-triangle' });
    } finally {
      setIsPublishing(false);
    }
  };

  const loadDraft = async (draft: any) => {
    setIsDraftsModalOpen(false);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setActiveTheme(draft.themeTemplate);
    setThemeColor(draft.themeColor);
    setFontHeading(draft.fontHeading);
    setFontBody(draft.fontBody);
    setButtonShape(draft.buttonShape);
    setCardStyle(draft.cardStyle);
    setSplashScreen(draft.splashScreen);
    
    const parsedTexts: any = safeParseJson(draft.customTexts, {});
    setCustomTexts(parsedTexts);
    
    let draftBlocks = pageBlocks;
    const baseBlocks = dbData.pageBlocks || pageBlocks;
    
    if (parsedTexts.draftBlocksConfig) {
      const updatedBlocks = baseBlocks.map((b: PageBlock) => {
        // Coba cocokkan berdasarkan ID. Jika tidak ketemu (misal karena migrasi), coba cocokkan berdasarkan blockType
        const draftCfg = parsedTexts.draftBlocksConfig.find((d: DraftBlocksConfig) => 
          d.id === b.id || (d.blockType && d.blockType === b.blockType)
        );
        
        if (draftCfg) {
          return { ...b, orderIndex: draftCfg.orderIndex, isVisible: draftCfg.isVisible, isLocked: draftCfg.isLocked };
        }
        
        // Jika tidak ada di draft, kembali ke susunan asli dari database, jangan pakai susunan memori yang bocor
        return { ...b };
      }).sort((a: PageBlock, b: PageBlock) => a.orderIndex - b.orderIndex);
      
      setPageBlocks(updatedBlocks);
      draftBlocks = updatedBlocks;
    }
    
    setActiveDraftId(draft.id);
    setActiveDraftName(draft.name);
    // Hitung apakah draft ini memiliki perubahan yang belum dipublish dengan membandingkan dengan Live DB
    const isDraftDifferent = 
      draft.themeTemplate !== dbData.siteAppearance?.themeTemplate ||
      draft.themeColor !== dbData.siteAppearance?.themeColor ||
      draft.fontHeading !== dbData.siteAppearance?.fontHeading ||
      draft.fontBody !== dbData.siteAppearance?.fontBody ||
      draft.buttonShape !== dbData.siteAppearance?.buttonShape ||
      draft.cardStyle !== dbData.siteAppearance?.cardStyle ||
      draft.splashScreen !== dbData.siteAppearance?.splashScreen ||
      draft.customTexts !== dbData.siteAppearance?.customTexts;
      
    setHasUnpublishedChanges(draft.id === publishedDraftId ? isDraftDifferent : true);
    
    setLastSavedState((prev: any) => ({
      ...prev,
      activeTheme: draft.themeTemplate,
      themeColor: draft.themeColor,
      fontHeading: draft.fontHeading,
      fontBody: draft.fontBody,
      buttonShape: draft.buttonShape,
      cardStyle: draft.cardStyle,
      splashScreen: draft.splashScreen,
      customTexts: parsedTexts,
      pageBlocks: draftBlocks
    }));

    setIsLoading(false);
  };

  const exitDraft = () => {
    setActiveDraftId(null);
    setActiveDraftName(null);
    setHasUnpublishedChanges(false);

    // Kembalikan ke state Live DB
    let parsedTexts: any = {};
    if (dbData.siteAppearance) {
      setActiveTheme(dbData.siteAppearance.themeTemplate || 'minimalist');
      setThemeColor(dbData.siteAppearance.themeColor || '#000000');
      setFontHeading(dbData.siteAppearance.fontHeading || 'Inter');
      setFontBody(dbData.siteAppearance.fontBody || 'Inter');
      setButtonShape(dbData.siteAppearance.buttonShape || 'rounded');
      setCardStyle(dbData.siteAppearance.cardStyle || 'flat');
      setSplashScreen(dbData.siteAppearance.splashScreen || false);
      
      parsedTexts = safeParseJson(dbData.siteAppearance.customTexts, {});
      setCustomTexts(parsedTexts);
      
      // Update dirty tracking
      setLastSavedState((prev: any) => ({
        ...prev,
        activeTheme: dbData.siteAppearance.themeTemplate || 'minimalist',
        themeColor: dbData.siteAppearance.themeColor || '#000000',
        fontHeading: dbData.siteAppearance.fontHeading || 'Inter',
        fontBody: dbData.siteAppearance.fontBody || 'Inter',
        buttonShape: dbData.siteAppearance.buttonShape || 'rounded',
        cardStyle: dbData.siteAppearance.cardStyle || 'flat',
        splashScreen: dbData.siteAppearance.splashScreen || false,
        customTexts: parsedTexts,
        pageBlocks: dbData.pageBlocks || []
      }));
    }

    if (dbData.pageBlocks) {
      let validBlocks = dbData.pageBlocks.filter((b: PageBlock) => !b.blockType.includes('INTEGRATIONS'));
      
      if (parsedTexts?.draftBlocksConfig) {
        validBlocks = validBlocks.map((b: PageBlock) => {
          const config = parsedTexts.draftBlocksConfig.find((d: DraftBlocksConfig) => d.id === b.id);
          return config ? { ...b, isLocked: config.isLocked, orderIndex: config.orderIndex, isVisible: config.isVisible } : b;
        }).sort((a: PageBlock, b: PageBlock) => a.orderIndex - b.orderIndex);
      }
      
      setPageBlocks(validBlocks);
    }
  };

  // Persiapan data untuk Live Preview
  const livePreviewData = {
    ...dbData,
    profile: { fullName, profession, bio, avatarUrl, subdomain, location },
    pageBlocks
  };
  
  const livePreviewTheme = { 
    themeTemplate: activeTheme, 
    themeColor, 
    fontHeading, 
    fontBody, 
    buttonShape, 
    cardStyle, 
    splashScreen,
    customTexts
  };

  return {
    state: {
      isLoading,
      isSavingDraft,
      isPublishing,
      isEditorCollapsed,
      showOfflineModal,
      isLive,
      subdomain,
      
      activeTheme,
      themeColor,
      fontHeading,
      fontBody,
      buttonShape,
      cardStyle,
      splashScreen,
      isThemeModalOpen,
      showProModal,

      livePreviewData,
      livePreviewTheme,
      favorites,
      drafts,
      activeDraftId,
      activeDraftName,
      publishedDraftId,
      isDraftsModalOpen,
      isSaveDraftModalOpen,
      isPublishModalOpen,
      isDirty,
      hasUnpublishedChanges,
      pageBlocks,
      previewMode,
      desktopZoom,
      ZOOM_MIN,
      ZOOM_MAX,
      canUndo: pastStatesRef.current.length > 0,
      canRedo: futureStatesRef.current.length > 0
    },
    actions: {
      setIsEditorCollapsed,
      setShowOfflineModal,
      setActiveTheme: changeThemeWithPreset,
      setThemeColor,
      setFontHeading,
      setFontBody,
      setButtonShape,
      setCardStyle,
      setSplashScreen,
      setIsThemeModalOpen,
      setShowProModal,
      setIsDraftsModalOpen,
      setIsSaveDraftModalOpen,
      setIsPublishModalOpen,
      setPreviewMode,
      zoomIn,
      zoomOut,
      saveDraft,
      publishDesign,
      loadDraft,
      exitDraft,
      toggleFavorite,
      updateCustomText,
      setPageBlocks,
      resetToThemePreset,
      undo,
      redo
    }
  };
}
