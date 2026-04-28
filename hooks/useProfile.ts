import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { showToast } from '@/lib/customToast';

export function useProfile() {
  const { data: session, status, update } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subdomain, setSubdomain] = useState(""); 
  const [initialSubdomain, setInitialSubdomain] = useState(""); 
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const isFormValid = firstName.trim() !== "" && profession.trim() !== "" && subdomainStatus !== 'taken';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const names = (data.fullName || session?.user?.name || "").split(" ");
            setFirstName(names[0] || "");
            setLastName(names.slice(1).join(" ") || "");
            
            const dbSubdomain = data.profile?.subdomain || data.subdomain || "";
            const emailPrefix = (session?.user?.email || "").split('@')[0] || "user";
            const finalSubdomain = dbSubdomain || emailPrefix;
            
            setSubdomain(finalSubdomain); 
            setInitialSubdomain(finalSubdomain); 
            
            setProfession(data.profession || data.profile?.profession || "");
            setBio(data.bio || data.profile?.bio || "");
            
            if (data.avatarUrl || data.avatar || data.profile?.avatarUrl) {
              setAvatarUrl(data.avatarUrl || data.avatar || data.profile?.avatarUrl);
            } else {
              setAvatarUrl((session?.user as any)?.avatar || session?.user?.image || "");
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        // Delay tipis agar skeleton shimmer terlihat elegan
        setTimeout(() => setIsLoadingData(false), 500);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoadingData(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (!subdomain || subdomain === initialSubdomain) {
      setSubdomainStatus('idle');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSubdomainStatus('checking');
      try {
        const res = await fetch(`/api/profile/check-subdomain?subdomain=${subdomain}`);
        const data = await res.json();
        if (data.available) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
        }
      } catch (error) {
        setSubdomainStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [subdomain, initialSubdomain]);

  const handleRemoveAvatar = () => {
    setAvatarUrl(""); 
    showToast({
      message: "Foto dihapus. Klik Simpan untuk memperbarui database.",
      id: "remove-avatar-toast",
      icon: "fa-trash-alt"
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!isFormValid) {
      showToast({
        message: "Formulir tidak valid. Periksa kembali isian Anda.",
        id: "invalid-form-toast",
        icon: "fa-exclamation-triangle"
      });
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan profil...', {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          subdomain, 
          profession,
          bio,
          avatar: avatarUrl 
        }),
      });

      if (response.ok) {
        toast.success("Profil berhasil diperbarui!", {
          id: toastId, 
          duration: 3000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' }
        });
        setInitialSubdomain(subdomain); 
        
        mutate('/api/layout-sync');

        await update({
          ...session,
          user: {
            ...session?.user,
            image: avatarUrl, 
            avatar: avatarUrl, 
            name: `${firstName} ${lastName}`.trim(),
            subdomain: subdomain,      
            profession: profession,    
            bio: bio                   
          }
        });

      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Gagal menyimpan perubahan.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Kesalahan jaringan. Coba lagi.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    state: {
      session,
      status,
      firstName,
      lastName,
      subdomain,
      subdomainStatus,
      profession,
      bio,
      avatarUrl,
      isSaving,
      isLoadingData,
      isFormValid
    },
    actions: {
      setFirstName,
      setLastName,
      setSubdomain,
      setProfession,
      setBio,
      setAvatarUrl,
      handleRemoveAvatar,
      handleSave
    }
  };
}
