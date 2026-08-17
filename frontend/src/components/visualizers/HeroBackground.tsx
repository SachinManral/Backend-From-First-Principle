'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      
      {/* 1. Deep Obsidian Atmosphere & Radial Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[420px] bg-gradient-to-tr from-brand-blue/25 via-brand-purple/20 to-transparent rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[360px] h-[260px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[360px] h-[260px] bg-purple-600/15 rounded-full blur-[90px] pointer-events-none" />

      {/* 2. Orbiting Elliptical Dashed Curves */}
      <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50%" cy="45%" rx="540" ry="230" fill="none" stroke="#5c77db" strokeWidth="1" strokeDasharray="6 10" transform="rotate(-5 600 350)" />
        <ellipse cx="50%" cy="45%" rx="450" ry="190" fill="none" stroke="#ac84eb" strokeWidth="1" strokeDasharray="4 8" transform="rotate(7 600 350)" />
      </svg>

      {/* 3. Twinkling Ambient Star Pixels */}
      <div className="absolute top-[16%] left-[28%] text-brand-blue opacity-70 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="absolute top-[20%] right-[26%] text-brand-purple opacity-60 animate-pulse delay-700">
        <Sparkles className="w-3 h-3" />
      </div>
      <div className="absolute top-[64%] right-[14%] text-indigo-400 opacity-60 animate-pulse delay-1000">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute top-[67%] left-[16%] text-cyan-400 opacity-50 animate-pulse delay-500">
        <Sparkles className="w-3 h-3" />
      </div>

      {/* 4. Perspective Wireframe Horizon Grid Floor */}
      <div className="absolute bottom-0 inset-x-0 h-64 overflow-hidden pointer-events-none">
        {/* Glowing Horizon Arc */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[1px] bg-gradient-to-r from-transparent via-brand-purple/70 to-transparent shadow-[0_0_20px_#ac84eb]" />
        
        {/* Perspective Grid Floor */}
        <div 
          className="w-full h-full opacity-25"
          style={{
            backgroundImage: `linear-gradient(to right, #5c77db 1px, transparent 1px), linear-gradient(to bottom, #5c77db 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(350px) rotateX(65deg)',
            transformOrigin: 'top center'
          }}
        />
        {/* Fade Out Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060813] via-[#060813]/60 to-transparent" />
      </div>

    </div>
  );
}
