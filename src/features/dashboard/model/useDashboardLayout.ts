"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

export interface NotificationItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'promo' | 'announcement';
  icon: string;
  title: string;
  desc: string;
  link: string;
  btnText?: string;
  btnColor?: string;
  color: string;
  bg: string;
  border: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const error: any = new Error("API Error");
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export function useDashboardLayout() {
  const { data: session, status } = useSession(); 
  const router = useRouter();

  // Gunakan BFF API: Gabungan dari Layout, Announcements, dan Stats
  const { data: dashboardSyncData, error: syncError, isLoading: isSyncLoading } = useSWR(status === "authenticated" ? '/api/dashboard/sync' : null, fetcher, {
    revalidateOnFocus: true, 
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    focusThrottleInterval: 10000,
  });

  useEffect(() => {
    if (status === "unauthenticated" || syncError?.status === 401) {
      router.push("/login");
    }
  }, [status, syncError, router]);

  // Destructure data agar UI tidak error
  const syncData = dashboardSyncData?.layout;
  const announcementsData = dashboardSyncData?.announcements;
  const overviewData = dashboardSyncData?.overview;

  const isLoading = status === "loading" || status === "unauthenticated" || syncError?.status === 401 || (status === "authenticated" && !syncData && !syncError);
  
  const userName = syncData?.fullName || session?.user?.name || "Creator";
  const userEmail = session?.user?.email || "user@portfo.be";
  const userPlan = syncData?.plan ? String(syncData.plan).toUpperCase() : (typeof session?.user?.plan === 'string' ? session?.user?.plan.toUpperCase() : "FREE");
  const isWebLive = syncData && syncData.isLive !== undefined ? syncData.isLive : (session?.user?.isLive !== false);
  const userSubdomain = syncData ? syncData.subdomain : session?.user?.subdomain;
  const userProfession = syncData ? syncData.profession : session?.user?.profession;
  const userBio = syncData ? syncData.bio : session?.user?.bio;
  const userAvatar = syncData ? syncData.avatar : (session?.user?.avatar || session?.user?.image);
  const userRole = syncData?.role || session?.user?.role || "USER";
  const canClaimTrial = syncData?.canClaimTrial === true;

  const planExpiredAtStr = syncData?.planExpiredAt || (session?.user as any)?.planExpiredAt;
  const planExpiredAt = planExpiredAtStr ? new Date(planExpiredAtStr) : null;
  
  let isGracePeriod = false;
  let remainingGraceDays = 0;
  if (userPlan !== 'FREE' && planExpiredAt) {
    const expiredTime = planExpiredAt.getTime();
    const now = Date.now();
    if (expiredTime <= now) {
      const remainingMs = expiredTime + (3 * 24 * 60 * 60 * 1000) - now;
      if (remainingMs > 0) {
        isGracePeriod = true;
        remainingGraceDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
      }
    }
  }

  const isSubdomainEmpty = !userSubdomain || String(userSubdomain).trim() === '' || String(userSubdomain) === 'null';
  const isProfessionEmpty = !userProfession || String(userProfession).trim() === '' || String(userProfession) === 'null';
  const isBioEmpty = !userBio || String(userBio).trim() === '' || String(userBio) === 'null';
  const isBioShort = !isBioEmpty && String(userBio).trim().length < 30;
  const isAvatarEmpty = !userAvatar || String(userAvatar).includes('ui-avatars.com') || String(userAvatar).trim() === '' || String(userAvatar) === 'null';

  const notifications: NotificationItem[] = [];

  if (!isWebLive) notifications.push({ id: 'offline', type: 'critical', icon: 'fa-eye-slash', title: 'Website Inactive', desc: 'Your portfolio is hidden. Activate it to make it publicly accessible.', link: '/dashboard/settings', btnText: 'Activate Web', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' });
  if (isSubdomainEmpty) notifications.push({ id: 'subdomain', type: 'warning', icon: 'fa-link', title: 'Subdomain Empty', desc: 'Claim your unique URL now before someone else takes it.', link: '/dashboard/profile', btnText: 'Set URL', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' });
  if (isAvatarEmpty) notifications.push({ id: 'avatar', type: 'warning', icon: 'fa-camera', title: 'No Profile Picture', desc: 'Upload your real photo so clients can easily recognize you.', link: '/dashboard/profile', btnText: 'Upload Photo', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' });
  if (isProfessionEmpty) notifications.push({ id: 'profession', type: 'info', icon: 'fa-briefcase', title: 'Profession Not Set', desc: 'Add your main profession or expertise.', link: '/dashboard/profile', btnText: 'Set Profession', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' });
  if (isBioEmpty) notifications.push({ id: 'bio-empty', type: 'info', icon: 'fa-align-left', title: 'Bio is Empty', desc: 'Tell visitors a bit about your career journey.', link: '/dashboard/profile', btnText: 'Write Bio', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' });
  else if (isBioShort) notifications.push({ id: 'bio-short', type: 'info', icon: 'fa-pen-to-square', title: 'Bio Too Short', desc: 'A more detailed bio (min. 30 characters) looks more professional.', link: '/dashboard/profile', btnText: 'Expand', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' });
  if (canClaimTrial) {
    notifications.push({ id: 'trial-promo', type: 'promo', icon: 'fa-gift', title: 'Claim Free PRO Trial', desc: 'Enjoy all PRO features for 14 days for free! No credit card required.', link: '/dashboard/billing', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', btnText: 'Claim Trial' });
  } else if (isGracePeriod) {
    notifications.unshift({ id: 'grace-period', type: 'warning', icon: 'fa-triangle-exclamation', title: 'PRO Grace Period', desc: `Your PRO plan has expired. We give you an additional ${remainingGraceDays} days before reverting to the FREE plan.`, link: '/pricing', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', btnText: 'Extend' });
  } else if (userPlan === 'FREE') {
    notifications.push({ id: 'promo', type: 'promo', icon: 'fa-crown', title: 'Upgrade to Pro', desc: 'Get in-depth analytics and custom domain as you like.', link: '/pricing', color: 'text-[#ff9e00]', bg: 'bg-[#ff9e00]/10', border: 'border-[#ff9e00]/20' });
  }
  
  // Sisipkan pengumuman dari Superadmin ke lonceng (hanya yang channel BELL atau BOTH)
  if (Array.isArray(announcementsData)) {
    announcementsData
      .filter((ann: any) => {
        const ch = ann.channel || 'BOTH';
        const tp = ann.targetPlan || 'ALL';
        const channelMatch = ch === 'BELL' || ch === 'BOTH';
        const planMatch = tp === 'ALL' || tp === userPlan;
        return channelMatch && planMatch;
      })
      .forEach((ann: any) => {
        const typeMap: Record<string, { icon: string; color: string; bg: string; border: string }> = {
          INFO:    { icon: 'fa-bullhorn',              color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200' },
          SUCCESS: { icon: 'fa-circle-check',          color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          WARNING: { icon: 'fa-triangle-exclamation',  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
          DANGER:  { icon: 'fa-circle-exclamation',    color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200' },
        };
        const style = typeMap[ann.type] || typeMap.INFO;
        notifications.push({
          id: `broadcast-${ann.id}`,
          type: 'announcement',
          icon: style.icon,
          title: ann.title,
          desc: ann.message,
          link: '/dashboard',
          color: style.color,
          bg: style.bg,
          border: style.border,
        });
      });
  }

  const topBanner = notifications.find(n => n.type === 'critical' || n.type === 'warning' || n.type === 'info');

  return {
    isLoading,
    userName,
    userEmail,
    userPlan,
    userAvatar,
    userSubdomain,
    isSubdomainEmpty,
    canClaimTrial,
    isGracePeriod,
    remainingGraceDays,
    notifications,
    topBanner,
    announcementsData, // expose for banner component
    projectsCount: overviewData?.projectsCount || 0,
    certificatesCount: overviewData?.certificatesCount || 0,
    linksCount: overviewData?.linksCount || 0,
    testimonialsCount: overviewData?.testimonialsCount || 0,
    userRole,
  };
}

