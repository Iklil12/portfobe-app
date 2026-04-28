import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { showToast } from '@/lib/customToast';

export type ProjectType = 'video' | 'photo' | 'certificate' | null;

export function useProjects() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectType, setProjectType] = useState<ProjectType>(null);
  
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'photo' | 'certificate'>('all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certStatus, setCertStatus] = useState(""); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, title: string, type: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [projRes, certRes] = await Promise.all([
        fetch('/api/projects').catch(() => null),
        fetch('/api/certificates').catch(() => null) 
      ]);

      const projData = projRes?.ok ? await projRes.json() : [];
      const certData = certRes?.ok ? await certRes.json() : [];

      const formattedProj = Array.isArray(projData) ? projData.map(p => ({ ...p, itemType: 'project' })) : [];
      const formattedCert = Array.isArray(certData) ? certData.map(c => ({ ...c, itemType: 'certificate', projectType: 'certificate' })) : [];

      const combined = [...formattedProj, ...formattedCert].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setItems(combined);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAllData(); 
  }, []);

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setProjectType(item.projectType as ProjectType);
      setProjectTitle(item.title);
      setProjectDescription(item.description || "");
      setMediaUrl(item.mediaUrl || "");
      
      if (item.itemType === 'certificate') {
        setCertIssuer(item.issuer || "");
        setCertYear(item.year || "");
        setCertStatus(item.status || ""); 
      } else {
        setCertIssuer("");
        setCertYear("");
        setCertStatus("");
      }
    } else {
      setEditingId(null);
      setProjectType(null);
      setProjectTitle("");
      setProjectDescription("");
      setMediaUrl("");
      setCertIssuer("");
      setCertYear("");
      setCertStatus("");
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setProjectType(null);
    }, 300); 
    document.body.style.overflow = 'unset'; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle) {
      showToast({ message: 'Judul wajib diisi!', id: 'err-title', icon: 'fa-exclamation-circle' });
      return;
    }
    if (!mediaUrl) {
      showToast({ message: 'Aset visual wajib dilampirkan!', id: 'err-media', icon: 'fa-image' });
      return;
    }
    if (projectType === 'certificate' && (!certIssuer || !certYear || !certStatus)) {
      showToast({ message: 'Lembaga, Tahun, dan Pencapaian/Status wajib diisi untuk sertifikat!', id: 'err-cert', icon: 'fa-exclamation-triangle' });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Menyimpan perubahan...' : 'Mempublikasikan data...');
    const endpoint = projectType === 'certificate' ? '/api/certificates' : '/api/projects';
    const method = editingId ? 'PATCH' : 'POST';

    const payload = projectType === 'certificate' 
      ? { id: editingId, title: projectTitle, description: projectDescription, mediaUrl, issuer: certIssuer, year: certYear, status: certStatus }
      : { id: editingId, title: projectTitle, description: projectDescription, mediaUrl, projectType };
    
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingId ? 'Data diperbarui!' : 'Data berhasil dipublikasikan!', { id: toastId });
        handleCloseModal();
        fetchAllData(); 
        setActiveTab(projectType || 'all'); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Terjadi kesalahan sistem.', { id: toastId });
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: string, title: string, type: string) => {
    setItemToDelete({ id, title, type });
    document.body.style.overflow = 'hidden'; 
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    document.body.style.overflow = 'unset';
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    const endpoint = itemToDelete.type === 'certificate' 
      ? `/api/certificates?id=${itemToDelete.id}` 
      : `/api/projects?id=${itemToDelete.id}`;
    
    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      if (response.ok) {
        showToast({ message: 'Data berhasil dihapus.', id: 'del-success', icon: 'fa-trash-alt' });
        fetchAllData(); 
      } else {
        const errorData = await response.json();
        showToast({ message: errorData.error || 'Gagal menghapus data.', id: 'del-err', icon: 'fa-exclamation-triangle' });
      }
    } catch (error) {
      showToast({ message: 'Gagal terhubung ke server.', id: 'del-net-err', icon: 'fa-wifi' });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
      document.body.style.overflow = 'unset';
    }
  };

  const filteredItems = items.filter(p => activeTab === 'all' || p.projectType === activeTab);

  return {
    state: {
      mounted,
      isModalOpen,
      projectType,
      items,
      isLoading,
      activeTab,
      editingId,
      projectTitle,
      projectDescription,
      mediaUrl,
      certIssuer,
      certYear,
      certStatus,
      isSubmitting,
      itemToDelete,
      isDeleting,
      filteredItems
    },
    actions: {
      setProjectType,
      setActiveTab,
      setProjectTitle,
      setProjectDescription,
      setMediaUrl,
      setCertIssuer,
      setCertYear,
      setCertStatus,
      handleOpenModal,
      handleCloseModal,
      handleSubmit,
      confirmDelete,
      cancelDelete,
      executeDelete
    }
  };
}
