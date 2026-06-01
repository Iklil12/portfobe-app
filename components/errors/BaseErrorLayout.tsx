"use client";

import React, { useState } from 'react';

export function BaseErrorLayout({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-sans selection:bg-white selection:text-black"
    >
      {/* Flashlight Effect */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300" 
        style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)` }} 
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="relative z-20 flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}
