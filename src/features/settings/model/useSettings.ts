import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { mutate } from 'swr';

export function useSettings() {
  const { data: session, update } = useSession();
  const [mounted, setMounted] = useState(false);

  // Status
  const [isLive, setIsLive] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Google OAuth Detection
  const [isOAuthLinked, setIsOAuthLinked] = useState(false);
  const [isStrictlyGoogle, setIsStrictlyGoogle] = useState(false);

  // Modals visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ title: "", desc: "" });

  // Action states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
        const u = session.user as any;
        setIsOAuthLinked(u.isOAuthLinked === true);
        setIsStrictlyGoogle(u.isStrictlyGoogle === true);
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const errorMsg = urlParams.get('error');

      if (success) {
        toast.success(success === 'true' ? 'Email successfully verified and updated!' : success, {
          duration: 5000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
        });
        window.history.replaceState(null, '', '/dashboard/settings'); 
      }

      if (errorMsg) {
        toast.error(errorMsg, {
          duration: 5000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
        });
        window.history.replaceState(null, '', '/dashboard/settings');
      }
    }
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/account/status');
        if (res.ok) {
          const data = await res.json();
          setIsLive(data.isLive);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio status");
      } finally {
        setTimeout(() => setIsLoadingStatus(false), 400); 
      }
    };
    fetchStatus();
  }, []);

  const handleInternalForgotPassword = async () => {
    const userEmail = session?.user?.email; 
    const toastId = toast.loading('Sending reset link...', {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email: userEmail }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            toast.dismiss(toastId);
            setIsSuccessModal(true);
            setSuccessData({
                title: "Link Sent!",
                desc: "We have sent reset instructions to your email inbox. Please check to continue."
            });
        } else {
            toast.error("Failed to send reset link.", { id: toastId });
        }
    } catch (error) {
        toast.error("A network error occurred.", { id: toastId });
    }
  };

  const toggleStatus = async () => {
    const newStatus = !isLive;
    setIsLive(newStatus); 
    
    const loadingToast = toast.loading(
      newStatus ? 'Publishing portfolio...' : 'Hiding portfolio...', 
      { style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' } }
    );

    mutate('/api/dashboard/sync', (currentData: any) => {
      return { ...currentData, layout: { ...currentData?.layout, isLive: newStatus } };
    }, { revalidate: false });

    try {
      const res = await fetch('/api/account/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive: newStatus })
      });

      if (res.ok) {
        toast.success(newStatus ? 'Portfolio is now Live!' : 'Portfolio hidden.', { id: loadingToast });
        await update({ isLive: newStatus, isEmailVerified: true });
      } else {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.error === "FORBIDDEN") {
           throw new Error("FORBIDDEN");
        }
        throw new Error("UNKNOWN");
      }
    } catch (error: any) {
    setIsLive(!newStatus); 
      mutate('/api/dashboard/sync', (currentData: any) => {
        return { ...currentData, layout: { ...currentData?.layout, isLive: !newStatus } };
      }, { revalidate: true });

      if (error.message === "FORBIDDEN") {
        toast.error("Email not verified!", { id: loadingToast });
        // Force refresh session state for the client (must match jwt callback root properties)
        await update({ isEmailVerified: false });
      } else {
        toast.error('Failed to change status.', { id: loadingToast });
      }
    }
  };

  const confirmDeletion = async (emailInput: string) => {
    setIsDeleting(true);
    const toastId = toast.loading('Destroying account...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const response = await fetch('/api/account/delete', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailInput })
      });
      if (response.ok) {
        toast.success("Account successfully deleted. Goodbye!", { 
          id: toastId, 
          duration: 4000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' }
        });
        setTimeout(() => { signOut({ callbackUrl: '/register' }); }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete account.", { id: toastId });
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("A network error occurred.", { id: toastId });
      setIsDeleting(false);
    }
  };

  const handleUpdateEmail = async (newEmail: string, emailVerifyPassword: string) => {
    if (!newEmail || !emailVerifyPassword) {
      toast.error("Please enter your new email and password.");
      return false;
    }

    setIsUpdatingEmail(true);
    const toastId = toast.loading('Updating email...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const res = await fetch('/api/account/email', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail, password: emailVerifyPassword })
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(toastId);
        setIsSuccessModal(true);
        setSuccessData({
            title: "Confirmation Sent",
            desc: "We have sent a confirmation link to your new email address. Please check your inbox to complete."
        });
        return true;
      } else {
        toast.error(data.error || "Failed to update email.", { id: toastId });
        return false;
      }
    } catch (error) {
      toast.error("A server error occurred.", { id: toastId });
      return false;
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast.error("Password confirmation does not match!");
      return false;
    }
    if (!isStrictlyGoogle && !currentPassword) {
      toast.error("Please enter your current password.");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return false;
    }

    setIsUpdatingPassword(true);
    const toastId = toast.loading('Saving password...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const res = await fetch('/api/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword: isStrictlyGoogle ? null : currentPassword, 
          newPassword 
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(toastId);
        setIsSuccessModal(true);
        setSuccessData({
            title: isStrictlyGoogle ? "Local Password Created" : "Password Updated",
            desc: "Your account password has been successfully saved. Use this new password for your next login."
        });
        if (isStrictlyGoogle) setIsStrictlyGoogle(false); 
        return true;
      } else {
        toast.error(data.error || "Failed to save password.", { id: toastId });
        return false;
      }
    } catch (error) {
      toast.error("A server error occurred.", { id: toastId });
      return false;
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return {
    state: {
      mounted,
      session,
      isLive,
      isLoadingStatus,
      isOAuthLinked,
      isStrictlyGoogle,
      showDeleteModal,
      showEmailModal,
      showPasswordModal,
      isSuccessModal,
      successData,
      isDeleting,
      isUpdatingEmail,
      isUpdatingPassword,
    },
    actions: {
      setShowDeleteModal,
      setShowEmailModal,
      setShowPasswordModal,
      setIsSuccessModal,
      handleInternalForgotPassword,
      toggleStatus,
      confirmDeletion,
      handleUpdateEmail,
      handleUpdatePassword,
    }
  };
}



export type SettingsState = ReturnType<typeof useSettings>['state'];
export type SettingsActions = ReturnType<typeof useSettings>['actions'];
