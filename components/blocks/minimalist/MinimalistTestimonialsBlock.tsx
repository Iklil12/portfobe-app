"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialSection } from '@/components/features/testimonials/TestimonialSection';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

export const MinimalistTestimonialsBlock = ({ data, theme, isEditor, blockConfig }: any) => {


  const animationTrigger = isEditor ? "animate" : "whileInView";
  const testimonials = data?.testimonials || data?.user?.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-gray-200 bg-white">
      <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={cinematicBlurUp} custom={0.2} className="p-8 @lg:p-12 pb-6">
        <TestimonialSection testimonials={testimonials} variant="grid" isEditor={isEditor} theme={theme} />
      </motion.div>
    </section>
  );
};
