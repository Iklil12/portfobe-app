"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  
  const fullName = data?.profile?.fullName || data?.fullName || "JAMAL ARIFIN";
  const profession = data?.profile?.profession || data?.profession || "Cinematographer & Editor";
  const bio = data?.profile?.bio || data?.bio || "Weaving light, shadow, and sound to capture the human experience. Specializing in high-end commercial and narrative films.";
  const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0]?.toUpperCase() || "VISUAL";
  const lastName = nameParts.slice(1).join(' ').toUpperCase() || "STORYTELLER";

  const cinematicEase = [0.16, 1, 0.3, 1] as any;

  return (
    <section className="relative bg-[#050505] vf-crosshair overflow-hidden border-b border-white/10 shrink-0" style={{ minHeight: '100svh' }}>
        <div className="vf-scanline"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center px-6 py-24 mix-blend-difference" style={{ minHeight: '100svh' }}>
            <motion.div
                initial="hidden"
                {...{ [animationTrigger]: "visible" }}
                viewport={{ once: true, amount: 0 }}
                variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 1.2, ease: cinematicEase, staggerChildren: 0.2 }
                    }
                }}
                className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto"
            >
                <motion.p
                    variants={{
                        hidden: { opacity: 0, letterSpacing: '1em' },
                        visible: { opacity: 1, letterSpacing: '0.4em', transition: { duration: 1.5, ease: cinematicEase } }
                    }}
                    className="text-gray-400 mb-3 uppercase vf-hud-text"
                >
                    <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
                </motion.p>

                <motion.h1
                    variants={{
                        hidden: { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
                        visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', transition: { duration: 1.2, ease: cinematicEase } }
                    }}
                    className="font-cinema leading-none tracking-wider text-[#F3F3F1] text-[clamp(48px,18cqw,72px)] @md:text-[clamp(80px,16cqw,192px)]"
                >
                    <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={20} /><br /><EditableText value={lastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
                </motion.h1>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
                    }}
                    className="text-gray-400 max-w-md mx-auto leading-relaxed mt-5 vf-hud-text text-center"
                >
                    "<EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />"
                </motion.p>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="flex justify-center gap-5 mt-6 text-lg text-gray-500"
                >
                    {links.map((link: any, idx: number) => (
                        <motion.a
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                            whileHover={{ scale: 1.3, color: "#F3F3F1" }}
                            whileTap={{ scale: 0.9 }}
                            key={idx} href={link.url} target="_blank" rel="noreferrer"
                            className="transition-colors duration-300"
                        >
                            <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                        </motion.a>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </section>
  );
}
