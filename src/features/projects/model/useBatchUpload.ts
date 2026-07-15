import { useState, useCallback } from 'react';
import { showToast } from '@/shared/lib/customToast';

export interface BatchFileItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  mediaUrl?: string;
  errorMessage?: string;
  title: string;
}

export function useBatchUpload({ userPlan, onSuccess }: { userPlan: string, onSuccess?: () => void }) {
  const [items, setItems] = useState<BatchFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);

  const addFiles = useCallback((files: FileList | File[]) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxImageSize = userPlan === 'SUPREME' ? 15 * 1024 * 1024 : userPlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxImageLabel = userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB';
    
    let currentItemCount = items.length;
    const newItems: BatchFileItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      if (currentItemCount >= 10) {
        showToast({ message: "Maximum 10 files per batch upload", id: "batch-max", icon: "⚠️" });
        break;
      }
      
      const file = files[i];
      if (!validMimeTypes.includes(file.type)) {
        showToast({ message: `Format not supported for ${file.name}`, id: "batch-type-" + i, icon: "⚠️" });
        continue;
      }
      
      if (file.size > maxImageSize) {
        showToast({ message: `File ${file.name} is too large (Max ${maxImageLabel})`, id: "batch-size-" + i, icon: "⚠️" });
        continue;
      }
      
      // Extract title from filename (remove extension and replace underscores/dashes with spaces)
      let title = file.name.split('.').slice(0, -1).join('.');
      title = title.replace(/[_-]/g, ' ');
      // Capitalize first letters
      title = title.replace(/\b\w/g, l => l.toUpperCase());
      
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: 'pending',
        title
      });
      
      currentItemCount++;
    }
    
    setItems(prev => [...prev, ...newItems]);
  }, [items.length, userPlan]);

  const removeFile = useCallback((id: string) => {
    if (isUploading) return;
    setItems(prev => prev.filter(item => item.id !== id));
  }, [isUploading]);

  const uploadFile = async (item: BatchFileItem): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', item.file);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const startBatchUpload = async (projectType: 'photo' | 'certificate' = 'photo') => {
    if (items.length === 0) return;
    setIsUploading(true);
    setGlobalProgress(0);

    const pendingItems = items.filter(i => i.status === 'pending' || i.status === 'error');
    if (pendingItems.length === 0) {
      setIsUploading(false);
      return;
    }

    let successCount = 0;
    const finalDataPayload: any[] = [];

    // Process file uploads sequentially to avoid rate limits or memory spikes
    for (let i = 0; i < pendingItems.length; i++) {
      const currentItem = pendingItems[i];
      
      setItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, status: 'uploading' } : item));
      
      try {
        const url = await uploadFile(currentItem);
        if (url) {
          setItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, status: 'success', mediaUrl: url, progress: 100 } : item));
          successCount++;
          finalDataPayload.push({
            title: currentItem.title,
            mediaUrl: url,
            projectType: projectType,
            tags: [],
            description: ""
          });
        }
      } catch (error: any) {
        setItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, status: 'error', errorMessage: error.message } : item));
      }
      
      setGlobalProgress(Math.round(((i + 1) / pendingItems.length) * 50)); // First 50% is image upload
    }

    // If at least one file succeeded, submit to batch API
    if (finalDataPayload.length > 0) {
      try {
        setGlobalProgress(75);
        const res = await fetch('/api/projects/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: finalDataPayload })
        });
        
        const resData = await res.json();
        
        if (res.ok) {
          setGlobalProgress(100);
          showToast({ message: `Berhasil mengunggah ${resData.count} item!`, id: "batch-succ", icon: "✅" });
          if (onSuccess) onSuccess();
        } else {
          showToast({ message: resData.error || "Gagal menyimpan data proyek", id: "batch-err", icon: "❌" });
        }
      } catch (err) {
        showToast({ message: "Network error occurred", id: "batch-net-err", icon: "⚠️" });
      }
    }

    setIsUploading(false);
  };
  
  const resetBatch = useCallback(() => {
    if (isUploading) return;
    setItems([]);
    setGlobalProgress(0);
  }, [isUploading]);

  return {
    items,
    addFiles,
    removeFile,
    isUploading,
    globalProgress,
    startBatchUpload,
    resetBatch
  };
}
