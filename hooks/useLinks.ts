//file hook/useLinks.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface LinkData {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export function useLinks() {
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [originalLinks, setOriginalLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const jsonResult = await res.json();
        
        // Jaring pengaman: Ambil array dari properti .data, atau fallback ke array kosong
        const linksArray = Array.isArray(jsonResult.data) 
          ? jsonResult.data 
          : (Array.isArray(jsonResult) ? jsonResult : []);

        setLinks(linksArray);
        setOriginalLinks(JSON.parse(JSON.stringify(linksArray)));
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };
  const hasChanges = JSON.stringify(links) !== JSON.stringify(originalLinks);

  const updateLocalLink = (id: string, data: Partial<LinkData>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const saveAllChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan perubahan...', {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
    try {
      const changedLinks = links.filter((link, index) => {
        return JSON.stringify(link) !== JSON.stringify(originalLinks[index]);
      });

      await Promise.all(changedLinks.map(link => 
        fetch(`/api/links/${link.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(link)
        })
      ));

      setOriginalLinks(JSON.parse(JSON.stringify(links)));
      toast.success("Perubahan tersimpan!", { 
          id: toastId,
          iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' },
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      });
    } catch (error) {
      toast.error("Gagal menyimpan", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = async () => {
    setIsAdding(true); 
    try {
      const res = await fetch('/api/links', { method: 'POST' });
      if (res.ok) {
        const newLink = await res.json();
        const updated = [...links, newLink];
        setLinks(updated);
        setOriginalLinks(JSON.parse(JSON.stringify(updated)));
        toast.success("Link ditambahkan", {
            icon: '🔗',
            style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
        });
      }
    } finally {
      setIsAdding(false); 
    }
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/links/${linkToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = links.filter(l => l.id !== linkToDelete);
        setLinks(updated);
        setOriginalLinks(JSON.parse(JSON.stringify(updated)));
        toast.success("Link terhapus", {
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' }
        });
      }
    } finally {
      setIsDeleting(false);
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
