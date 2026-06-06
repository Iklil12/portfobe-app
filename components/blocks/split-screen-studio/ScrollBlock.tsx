"use client";

import React, { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useSplitScreenStudio } from './SplitScreenStudioContext';

export function ScrollBlock({ 
    children, bg, index, tag, title, desc, isProject = false, projectData = null 
}: any) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
    const { scrollYProgress: revealProgress } = useScroll({ target: ref, offset: ["start 75%", "start 25%"] });
    
    const { setActiveSection } = useSplitScreenStudio();

    // Parallax effect for image
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const clipPath = useTransform(revealProgress, [0, 1], ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    setActiveSection((prev: any) => {
                        if (prev?.index === index) return prev;
                        return { bg, index, tag, title, desc };
                    });
                }
            },
            { threshold: [0.5] }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [bg, index, tag, title, desc, setActiveSection]);

    return (
        <article ref={ref} className={`w-full p-8 md:p-16 border-b border-white/10 ${isProject ? 'py-16' : 'py-24 md:py-32'}`}>
            {children({ y, clipPath })}
        </article>
    );
}
