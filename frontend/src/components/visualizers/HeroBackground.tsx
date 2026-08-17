'use client';

import React from 'react';
import { Zap, Globe, Database, Terminal, Cloud, Sparkles } from 'lucide-react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      
      {/* 1. Deep Obsidian Atmosphere & Radial Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-blue/25 via-brand-purple/20 to-transparent rounded-full blur-[110px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[250px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[250px] bg-purple-600/15 rounded-full blur-[90px] pointer-events-none" />

      {/* 2. Orbiting Elliptical Dashed Curves */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50%" cy="45%" rx="520" ry="220" fill="none" stroke="#5c77db" strokeWidth="1" strokeDasharray="6 10" transform="rotate(-6 600 350)" />
        <ellipse cx="50%" cy="45%" rx="440" ry="180" fill="none" stroke="#ac84eb" strokeWidth="1" strokeDasharray="4 8" transform="rotate(8 600 350)" />
      </svg>

      {/* 3. Twinkling Ambient Star Pixels */}
      <div className="absolute top-[18%] left-[28%] text-brand-blue opacity-60 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="absolute top-[22%] right-[25%] text-brand-purple opacity-50 animate-pulse delay-700">
        <Sparkles className="w-3 h-3" />
      </div>
      <div className="absolute top-[65%] right-[15%] text-indigo-400 opacity-60 animate-pulse delay-1000">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute top-[68%] left-[18%] text-cyan-400 opacity-50 animate-pulse delay-500">
        <Sparkles className="w-3 h-3" />
      </div>

      {/* 4. Perspective Wireframe Horizon Grid at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-64 overflow-hidden pointer-events-none">
        {/* Glowing Horizon Arc */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[1px] bg-gradient-to-r from-transparent via-brand-purple/70 to-transparent shadow-[0_0_20px_#ac84eb]" />
        
        {/* Perspective Grid Floor */}
        <div 
          className="w-full h-full opacity-20"
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

      {/* 5. Floating Glassmorphic Sticker Cards (Desktop View) */}
      <div className="hidden lg:block relative w-full h-full max-w-6xl mx-auto pointer-events-auto">

        {/* TOP-LEFT CARD: Kernel Sockets */}
        <div className="absolute top-8 left-2 animate-float-slow">
          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-brand-blue/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-md shadow-brand-blue/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-blue fill-brand-blue/20" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Kernel Sockets</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[150px] leading-tight">
                Understand the backbone of real-time systems.
              </p>
            </div>
          </div>
        </div>

        {/* TOP-RIGHT CARD: HTTP Lifecycle + Floating 3D Cloud */}
        <div className="absolute top-10 right-4 animate-float-reverse">
          {/* Small Floating 3D Cloud Above */}
          <div className="absolute -top-6 -right-3 text-brand-purple/70 animate-float-gentle">
            <div className="p-2 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 backdrop-blur-md shadow-lg shadow-brand-purple/20">
              <Cloud className="w-4 h-4 text-brand-purple fill-brand-purple/30" />
            </div>
          </div>

          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-brand-purple/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-indigo-500 p-0.5 shadow-md shadow-brand-purple/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-brand-purple" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">
                HTTP Lifecycle
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[150px] leading-tight">
                See how a request travels end-to-end.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM-LEFT: Glowing 3D Isometric Database Cylinder + Terminal Prompt */}
        <div className="absolute bottom-28 left-4 animate-float-gentle">
          {/* Mini Terminal Badge */}
          <div className="absolute -top-7 left-6 px-2.5 py-1 rounded-lg bg-[#090e1c] border border-brand-blue/40 shadow-lg text-[10px] font-mono text-brand-blue font-bold flex items-center gap-1">
            <span>&gt;_</span>
          </div>

          {/* Glowing Isometric Database Stack */}
          <div className="w-16 h-20 relative flex flex-col items-center justify-center group cursor-pointer">
            <div className="w-14 h-6 rounded-full bg-gradient-to-r from-brand-blue to-indigo-600 border border-cyan-400/50 shadow-[0_0_20px_#5c77db] relative z-20" />
            <div className="w-14 h-8 bg-gradient-to-b from-blue-700 via-indigo-900 to-[#0c1326] border-x border-cyan-400/40 -mt-3 relative z-10" />
            <div className="w-14 h-6 rounded-full bg-indigo-950 border border-cyan-400/40 -mt-3 shadow-xl relative z-10" />
            <div className="w-14 h-8 bg-gradient-to-b from-blue-700 via-indigo-900 to-[#0c1326] border-x border-cyan-400/40 -mt-3 relative z-0" />
            <div className="w-14 h-6 rounded-full bg-[#080d1a] border border-cyan-400/40 -mt-3 shadow-2xl relative z-0" />
          </div>
        </div>

        {/* BOTTOM-RIGHT CARD: SQL Persistence */}
        <div className="absolute bottom-24 right-4 animate-float-slow">
          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-emerald-500/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">
                SQL Persistence
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[150px] leading-tight">
                Store data that scales. Query like a pro.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
