import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { useSearchParams } from 'next/navigation';
import { showToast } from '@/lib/customToast';
import { safeParseJson, safeStringifyJson } from '@/lib/safeJson';

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
  const dataLoaded = useRef(false);

  // --- STATE DRAFTS & PUBLISHING ---
  const [drafts, setDrafts] = useState<any[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [activeDraftName, setActiveDraftName] = useState<string | null>(null);
  const [publishedDraftId, setPublishedDraftId] = useState<string | null>(null);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  
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
    safeStringifyJson(customTexts) !== safeStringifyJson(lastSavedState.customTexts)
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
              const texts = sa.customTexts ? safeParseJson(sa.customTexts, {}) : {};
              setLastSavedState({
                activeTheme: sa.themeTemplate || 'minimalist',
                themeColor: sa.themeColor || '#000000',
                fontHeading: sa.fontHeading || 'Inter',
                fontBody: sa.fontBody || 'Inter',
                buttonShape: sa.buttonShape || 'rounded',
                cardStyle: sa.cardStyle || 'flat',
                splashScreen: sa.splashScreen || false,
                customTexts: texts
              });
            }
          }
        }

        setDbData(appData);

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
            setDrafts(Array.isArray(draftsData) ? draftsData : []);
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
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
        customTexts 
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
          activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts
        });
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
        customTexts,
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

      const [resApp, resProf] = await Promise.all([appearancePromise, profilePromise, delayPromise]);

      if (resApp.ok && resProf.ok) {
        mutate('/api/dashboard/sync');
        toast.dismiss(toastId);
        showToast({ message: 'Desain berhasil dipublikasikan!', id: toastId, icon: 'fa-rocket' });
        
        setPublishedDraftId(activeDraftId || null);
        setLastSavedState({
          activeTheme, themeColor, fontHeading, fontBody, buttonShape, cardStyle, splashScreen, customTexts
        });

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
    
    const parsedTexts = safeParseJson(draft.customTexts, {});
    setCustomTexts(parsedTexts);
    
    setActiveDraftId(draft.id);
    setActiveDraftName(draft.name);
    setLastSavedState({
      activeTheme: draft.themeTemplate,
      themeColor: draft.themeColor,
      fontHeading: draft.fontHeading,
      fontBody: draft.fontBody,
      buttonShape: draft.buttonShape,
      cardStyle: draft.cardStyle,
      splashScreen: draft.splashScreen,
      customTexts: parsedTexts
    });

    setIsLoading(false);
  };



  // Persiapan data untuk Live Preview
  const livePreviewData = {
    ...dbData,
    profile: { fullName, profession, bio, avatarUrl, subdomain, location }
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
      isDirty
    },
    actions: {
      setIsEditorCollapsed,
      setShowOfflineModal,
      setActiveTheme,
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
      saveDraft,
      publishDesign,
      loadDraft,
      toggleFavorite,
      updateCustomText
    }
  };
}
