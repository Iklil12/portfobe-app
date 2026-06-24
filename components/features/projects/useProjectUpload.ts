import { useState, useRef } from 'react';
import { showToast } from '@/lib/customToast';
import * as tus from 'tus-js-client';

export function useProjectUpload({ userPlan, projectTitle, projectType, setMediaUrl, setShowUpgradeModal }: any) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file3d, setFile3d] = useState<File | null>(null);
  const file3dInputRef = useRef<HTMLInputElement>(null);
  const [isUploading3D, setIsUploading3D] = useState(false);
  const [upload3DProgress, setUpload3DProgress] = useState(0);
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileImageInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const processImageUpload = async (f: File) => {
    const maxImageSize = userPlan === 'SUPREME' ? 15 * 1024 * 1024 : userPlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxImageLabel = userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB';
    
    if (f.size > maxImageSize) {
      showToast({ message: `Maksimal ukuran gambar ${maxImageLabel}`, id: "err-img", icon: "⚠️" });
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    
    if (!cloudName || !uploadPreset) {
      showToast({ message: "Konfigurasi Cloudinary tidak ditemukan", id: "upload-asset-fail", icon: "❌" });
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', f);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setMediaUrl(data.secure_url);
        showToast({ message: "Gambar berhasil diunggah dengan cepat", id: "upload-asset-success", icon: "✨" });
      } else {
        showToast({ message: data.error?.message || "Failed to upload image", id: "upload-asset-fail", icon: "❌" });
      }
    } catch (err) {
      showToast({ message: "Network error occurred during upload", id: "upload-asset-err", icon: "⚠️" });
    } finally {
      setIsUploadingImage(false);
      if (fileImageInputRef.current) fileImageInputRef.current.value = '';
    }
  };

  const processVideoUpload = async (f: File) => {
    if (userPlan === 'FREE') {
      setShowUpgradeModal(true);
      return;
    }

    const maxVideoSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    const maxVideoSizeLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';

    if (f.size > maxVideoSize) {
      showToast({ message: `Ukuran video maksimal ${maxVideoSizeLabel}`, id: "err-video-size", icon: "⚠️" });
      return;
    }

    setIsUploadingVideo(true);
    setUploadProgress(0);

    try {
      const ticketRes = await fetch('/api/projects/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: projectTitle || f.name })
      });

      const ticketData = await ticketRes.json();

      if (!ticketRes.ok || !ticketData.guid) {
        throw new Error(ticketData.error || "Failed to get upload ticket");
      }

      const { guid, libraryId, signature, expirationTime } = ticketData;

      const upload = new tus.Upload(f, {
        endpoint: 'https://video.bunnycdn.com/tusupload',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          AuthorizationSignature: signature,
          AuthorizationExpire: expirationTime.toString(),
          VideoId: guid,
          LibraryId: libraryId.toString(),
        },
        metadata: {
          filename: f.name,
          filetype: f.type,
        },
        onError: function (error) {
          console.error("Failed because: " + error);
          showToast({ message: "Failed to upload video.", id: "upload-edge-fail", icon: "❌" });
          setIsUploadingVideo(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
          setUploadProgress(percentage);
        },
        onSuccess: function () {
          setMediaUrl(guid);
          showToast({ message: "Video 100% berhasil diunggah", id: "upload-edge-success", icon: "🚀" });
          setIsUploadingVideo(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      });

      upload.start();

    } catch (error: any) {
      console.error(error);
      showToast({ message: error.message || "Failed to process video", id: "upload-exception", icon: "⚠️" });
      setIsUploadingVideo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const process3DFile = (f: File) => {
    const max3DSize = userPlan === 'SUPREME' ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    const max3DLabel = userPlan === 'SUPREME' ? '100MB' : '50MB';
    if (f.size > max3DSize) {
       showToast({ message: `Maksimal ${max3DLabel}`, id: "err-3d", icon: "⚠️" });
       return;
    }
    setFile3d(f);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (projectType === 'photo') {
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validMimeTypes.includes(file.type)) {
        showToast({ message: "Format tidak didukung. Harap unggah JPG, PNG, WEBP, atau GIF.", id: "err-img-type", icon: "⚠️" });
        return;
      }
      await processImageUpload(file);
    } else if (projectType === 'video') {
      if (!file.type.startsWith('video/')) {
        showToast({ message: "Harap unggah file video yang valid.", id: "err-video-type", icon: "⚠️" });
        return;
      }
      await processVideoUpload(file);
    } else if (projectType === '3d') {
      const isGlb = file.name.endsWith('.glb') || file.name.endsWith('.gltf');
      if (!isGlb) {
        showToast({ message: "Harap unggah file 3D berformat .GLB atau .GLTF.", id: "err-3d-type", icon: "⚠️" });
        return;
      }
      process3DFile(file);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processVideoUpload(file);
  };

  return {
    uploadProgress,
    isUploadingVideo,
    fileInputRef,
    file3d,
    setFile3d,
    file3dInputRef,
    isUploading3D,
    setIsUploading3D,
    upload3DProgress,
    setUpload3DProgress,
    isUploadingImage,
    setIsUploadingImage,
    fileImageInputRef,
    isDragActive,
    processImageUpload,
    processVideoUpload,
    process3DFile,
    handleDrag,
    handleDrop,
    handleVideoUpload
  };
}
