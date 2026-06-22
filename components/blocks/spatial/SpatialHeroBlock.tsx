"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

const isValidHexColor = (color: string) => /^#([0-9A-Fa-f]{3}){1,2}$/i.test(color);

export function SpatialHeroBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const [isCopied, setIsCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
      if (isCardPreview || isEditor) return;
      const updateTime = () => {
          const now = new Date();
          setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
  }, [isCardPreview, isEditor]);

  const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
  const profession = data?.profile?.profession || data?.profession || "Software Engineer & UI/UX Enthusiast";
  const bio = data?.profile?.bio || data?.bio || "Crafting digital experiences with precision, blending aesthetic design with robust engineering.";
  const location = data?.profile?.location || data?.location || "Indonesia";
  const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
  const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;

  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';

  const handleCopyEmail = (e: React.MouseEvent) => {
      e.preventDefault();
      navigator.clipboard.writeText(userEmail);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const firstName = fullName.split(' ')[0];

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
      : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
      ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
      : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const viewAnim = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

  return (
    <>
      {/* HERO SECTION */}
      <motion.div
          {...viewAnim} variants={staggerContainer}
          className={`flex flex-col items-center text-center px-8 w-full mt-10 @md:mt-0`}
      >
          {/* Status Pill */}
          <motion.div variants={auraAnim} className={`inline-flex items-center gap-3 px-4 py-2 ${radiusClass} glass-panel mb-8`}>
              <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--hl)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--hl)]"></span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                  <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
              </span>
          </motion.div>

          {/* Massive Elegant Typography */}
          <motion.h1 variants={auraAnim} className={`font-semibold tracking-[-0.04em] text-gradient leading-[1.1] max-w-4xl mx-auto text-7xl @md:text-[6rem]`}>
              <EditableText value={theme?.customTexts?.spatial_hero_title1 || 'Building digital experiences that'} field="spatial_hero_title1" entity="appearance" isEditor={isEditor} as="span" maxLength={60} /> <EditableText value={theme?.customTexts?.spatial_hero_title2 || 'inspire.'} field="spatial_hero_title2" entity="appearance" isEditor={isEditor} as="span" className="italic font-light text-white" maxLength={20} />
          </motion.h1>

          <motion.p variants={auraAnim} className={`text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto mt-8 text-xl`}>
              <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />
          </motion.p>

          {/* Action Row & Avatar */}
          <motion.div variants={auraAnim} className={`flex items-center justify-center gap-4 mt-12 w-full flex-row`}>
              {/* Avatar Capsule */}
              <div className={`glass-panel p-1.5 pr-6 ${radiusClass} flex items-center gap-4 hover:scale-105 transition-transform duration-500`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <LazyImage src={displayAvatar} alt={fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-white">
                          <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />
                      </span>
                      <span className="text-[11px] text-slate-400">
                          <EditableText value={location} field="spatial_location" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> {currentTime ? `• ${currentTime}` : ''}
                      </span>
                  </div>
              </div>

              {/* Copy Email Button */}
              <div onClick={handleCopyEmail} className={`glass-panel p-4 px-6 ${radiusClass} flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform duration-500 relative overflow-hidden`}>
                  {isCopied && <motion.div initial={{ opacity: 1, scale: 0 }} animate={{ opacity: 0, scale: 2 }} className="absolute inset-0 bg-[var(--hl)] opacity-20"></motion.div>}
                  <span className={`text-sm font-medium transition-colors ${isCopied ? 'text-[var(--hl)]' : 'text-slate-300 group-hover:text-white'}`}>
                      {isCopied ? 'Email Copied!' : <EditableText value={theme?.customTexts?.spatial_copy_email || 'Copy Email'} field="spatial_copy_email" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />}
                  </span>
                  <i className={`text-sm ${isCopied ? 'fas fa-check text-[var(--hl)]' : 'far fa-copy text-slate-500 group-hover:text-white transition-colors'}`}></i>
              </div>
          </motion.div>
      </motion.div>

      {/* DIVIDER */}
      <motion.div
          initial={isCardPreview ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={isCardPreview ? undefined : { scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-24 @md:my-32"
      ></motion.div>
    </>
  );
}
