"use client";

import { MARQUEE_TEXTS } from '@/lib/constants';
import { motion } from 'framer-motion';

export function MarqueeSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, scaleY: 0.3, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scaleY: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
      style={{ transformOrigin: "center center" }}
      className="py-8 border-y border-slate-200 bg-white overflow-hidden relative z-30"
    >
      <motion.div 
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.3 }}
        className="flex space-x-12 marquee w-max text-slate-300 font-extrabold tracking-widest text-lg md:text-xl uppercase"
      >
        {[1, 2, 3].map((group) => (
            <div key={group} className="flex items-center space-x-12">
                {MARQUEE_TEXTS.map((txt, i) => (
                    <span key={i} className="flex items-center gap-12 hover:text-[#ff9e00] transition-colors cursor-default">
                        <span className="text-[#ff9e00]/50">*</span>
                        <span>{txt}</span>
                    </span>
                ))}
            </div>
        ))}
      </motion.div>
    </motion.section>
  );
}
