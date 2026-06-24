//app/dashboard/profile/page.tsx
"use client";

import React from 'react';
import { useProfile } from '@/entities/user/model/useProfile';
import { ProfileSkeleton } from '@/features/profile';
import { ProfileHeader } from '@/features/profile';
import { AvatarUpload } from '@/features/profile';
import { ProfileForm } from '@/features/profile';

export default function ProfilePage() {
  const { state, actions } = useProfile();

  if (state.status === "loading" || state.isLoadingData) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-[#ff9e00]/30 selection:text-white pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px) scale(0.99); filter: blur(2px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}} />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        <ProfileHeader />

        <div className="bg-zinc-900/40 p-6 sm:p-10 md:p-12 rounded-none border border-white/10 shadow-none transition-all duration-500 relative animate-enter overflow-hidden" style={{animationDelay: '200ms'}}>
          <AvatarUpload state={state} actions={actions} />
          <ProfileForm state={state} actions={actions} />
        </div>
      </div>
    </main>
  );
}