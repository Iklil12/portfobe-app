"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurRight = {
  hidden: { opacity: 0, x: -40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    x: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const imageReveal = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    scale: 1,
    
    transition: { duration: 1.6, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const MinimalistHeroBlock = ({ data, theme, isEditor }: any) => {
  const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
  const profession = data?.profile?.profession || data?.profession || "Director & Editor";
  const bio = data?.profile?.bio || data?.bio || "A visual storyteller based in Jakarta. I craft meticulous, high-end visual narratives for commercial brands and independent films.";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop`;

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);
  const themeColor = isValidHexColor(theme?.themeColor) ? theme?.themeColor : undefined;

  return (
    <motion.aside
      initial="hidden" animate="visible" variants={getStaggerContainer(0.1, 0.15)}
      className={`bg-gray-50 border-gray-200 p-8 flex flex-col justify-between z-10 @lg:overflow-y-auto w-full @lg:w-[35%] @lg:fixed @lg:top-0 @lg:h-screen @lg:border-r @lg:p-12`}
      data-lenis-prevent="true"
    >
      <div>
        <div className="flex justify-between items-start mb-10 @container">
          <motion.h1 variants={cinematicBlurRight} className="text-2xl font-black tracking-tighter uppercase leading-none min-heading flex flex-col">
            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" className="min-heading" maxLength={10} />
            <EditableText value={lastName || '.'} field="lastName" entity="profile" isEditor={isEditor} as="span" className="min-heading" maxLength={10} />
          </motion.h1>
          <motion.div variants={cinematicBlurRight} className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Available</span>
          </motion.div>
        </div>

        <motion.div variants={imageReveal} className="w-full aspect-square mb-8 relative group">
          <div className="w-full h-full overflow-hidden border border-gray-200 relative">
            <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover grayscale transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
          {(data?.plan !== 'FREE' || data?.userPlan !== 'FREE') && (data?.plan || data?.userPlan) && (
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${themeColor ? 'text-white' : 'bg-blue-500 text-white'} rounded-full border-[3px] border-white flex items-center justify-center text-[10px] shadow-lg z-20`} style={themeColor ? { backgroundColor: themeColor } : {}}>
              <i className="fas fa-check"></i>
            </div>
          )}
        </motion.div>

        <motion.h2 variants={cinematicBlurUp} className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3 min-heading">
          <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" className="min-heading" maxLength={20} />
        </motion.h2>
        <motion.p variants={cinematicBlurUp} className="text-gray-600 text-sm leading-relaxed mb-6 min-body">
          <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" className="min-body" maxLength={250} />
        </motion.p>

        <motion.ul variants={cinematicBlurUp} className="text-xs font-mono text-gray-500 space-y-2 mb-8 opacity-80">
          {[
            { id: 'skill_1', default: 'Minimalist Layout' },
            { id: 'skill_2', default: 'Clean Typography' },
            { id: 'skill_3', default: 'High-end Visuals' }
          ].map((item, idx) => (
            <motion.li key={idx} whileHover={{ x: 5, color: "#000" }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="cursor-default flex items-center gap-1.5">
              <span>→</span>
              <EditableText 
                value={theme?.customTexts?.[item.id] || item.default} 
                field={item.id} 
                entity="appearance" 
                isEditor={isEditor} 
                maxLength={30} 
                as="span"
                className="min-body"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <motion.div variants={cinematicBlurUp} className={`pt-8 border-t border-gray-200 mt-8`}>
        <motion.a whileHover={{ scale: 1.02, originX: 0 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href={`mailto:${userEmail}`} className="inline-block text-xl font-bold tracking-tight hover:text-gray-500 transition-colors mb-6 truncate min-heading">
          {userEmail}
        </motion.a>
        <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
          {links.map((l: any, i: number) => (
            <motion.a key={i} href={l.url} target="_blank" rel="noreferrer" whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }} className="text-gray-500 hover:text-black transition-colors relative inline-block group">
              {l.platform}
              <span className="absolute bottom-[-2px] left-0 w-0 h-px bg-black transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
};
