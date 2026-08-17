'use client';

import React from 'react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      
      {/* 1. Deep Obsidian Atmosphere & Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-brand-blue/20 via-brand-purple/15 to-transparent rounded-full blur-[130px] opacity-80" />
      <div className="absolute top-1/4 left-1/5 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 right-1/5 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />

      {/* 2. Orbiting Elliptical Dashed Curves */}
      <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50%" cy="46%" rx="560" ry="240" fill="none" stroke="#5c77db" strokeWidth="1.2" strokeDasharray="6 12" transform="rotate(-5 600 350)" />
        <ellipse cx="50%" cy="46%" rx="460" ry="190" fill="none" stroke="#ac84eb" strokeWidth="1" strokeDasharray="4 10" transform="rotate(7 600 350)" />
      </svg>

      {/* 3. Twinkling Ambient Star Points */}
      <div className="absolute top-[18%] left-[25%] w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" />
      <div className="absolute top-[22%] right-[24%] w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse delay-700" />
      <div className="absolute top-[62%] right-[16%] w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_10px_#818cf8] animate-pulse delay-1000" />
      <div className="absolute top-[65%] left-[18%] w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-pulse delay-500" />

      {/* 4. Perspective Wireframe Horizon Grid Floor */}
      <div className="absolute bottom-0 inset-x-0 h-72 overflow-hidden">
        {/* Glowing Horizon Arc */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent shadow-[0_0_25px_#ac84eb]" />
        
        {/* Perspective Grid Floor */}
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #5c77db 1px, transparent 1px), linear-gradient(to bottom, #5c77db 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
            transform: 'perspective(380px) rotateX(68deg)',
            transformOrigin: 'top center'
          }}
        />
        {/* Fade Out Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060813] via-[#060813]/70 to-transparent" />
      </div>

    </div>
  );
}
