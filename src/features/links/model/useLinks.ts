import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';

export interface LinkData {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export function useLinks() {
  // Baca plan dari cache SWR yang sudah ada — TANPA network request baru
  const { data: syncData } = useSWR('/api/dashboard/sync');
  const cachedPlan = (syncData?.layout?.plan || 'FREE') as 'FREE' | 'PRO';

  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [originalLinks, setOriginalLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [linkCount, setLinkCount] = useState(0);

  const isAddingRef = useRef(false);
  const isSavingRef = useRef(false);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const linksRes = await fetch('/api/links');

      if (linksRes.ok) {
        const jsonResult = await linksRes.json();
        const linksArray = Array.isArray(jsonResult.data) ? jsonResult.data : (Array.isArray(jsonResult) ? jsonResult : []);
        setLinks(linksArray);
        setLinkCount(jsonResult.meta?.total || linksArray.length);
        setOriginalLinks(JSON.parse(JSON.stringify(linksArray)));
      }
      // Plan diambil dari SWR cache, tidak perlu fetch /api/layout-sync
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };
  const hasChanges = JSON.stringify(links) !== JSON.stringify(originalLinks);

  const updateLocalLink = (id: string, data: Partial<LinkData>) => {
    // Validasi Limit 4 Link Aktif di Frontend
    if (data.isActive === true) {
      const activeCount = links.filter(l => l.isActive).length;
      const targetLink = links.find(l => l.id === id);
      
      if (activeCount >= 4 && targetLink && !targetLink.isActive) {
        toast.error("Maximum of 4 links can be displayed on profile.", {
          id: 'active-limit',
          icon: '⚠️',
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
        });
        return; // Batalkan update
      }
    }
    
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const saveAllChanges = async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    toast.loading('Saving changes...', {
        id: 'save-links',
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
    try {
      const changedLinks = links.filter((link, index) => {
        return JSON.stringify(link) !== JSON.stringify(originalLinks[index]);
      });

      await Promise.all(changedLinks.map(async (link) => {
        const res = await fetch(`/api/links/${link.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(link)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to save changes");
        }
        return res.json();
      }));

      setOriginalLinks(JSON.parse(JSON.stringify(links)));
      toast.success("Changes saved!", { 
          id: 'save-links',
          iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' },
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      });
    } catch (error: any) {
    toast.error(error.message || "Failed to save", { id: 'save-links' });
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  const addLink = async () => {
    if (isAddingRef.current) return;
    isAddingRef.current = true;
    setIsAdding(true); 
    try {
      const res = await fetch('/api/links', { method: 'POST' });
      if (res.ok) {
        const newLink = await res.json();
        const updated = [...links, newLink];
        setLinks(updated);
        setLinkCount(prev => prev + 1); 
        setOriginalLinks(JSON.parse(JSON.stringify(updated)));
        toast.success("Link added", {
            id: 'add-link',
            icon: '🔗',
            style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
        });
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to add link", { id: 'add-link' });
      }
    } catch (err) {
      toast.error("Network error", { id: 'add-link' });
    } finally {
      setIsAdding(false); 
      isAddingRef.current = false;
    }
  };

  const confirmDelete = async () => {
    if (!linkToDelete || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/links/${linkToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = links.filter(l => l.id !== linkToDelete);
        setLinks(updated);
        setLinkCount(prev => Math.max(0, prev - 1)); // Update Count Real-time
        setOriginalLinks(JSON.parse(JSON.stringify(updated)));
        toast.success("Link deleted", {
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' }
        });
      }
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
      setLinkToDelete(null);
    }
  };

  return {
    state: {
      mounted,
      links,
      isLoading,
      linkToDelete,
      isDeleting,
      isSaving,
      isAdding,
      hasChanges,
      userPlan: cachedPlan,
      linkCount
    },
    actions: {
      setLinkToDelete,
      updateLocalLink,
      addLink,
      confirmDelete,
      saveAllChanges,
    }
  };
}



export type LinksState = ReturnType<typeof useLinks>['state'];
export type LinksActions = ReturnType<typeof useLinks>['actions'];
