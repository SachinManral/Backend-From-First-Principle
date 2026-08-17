'use client';

import React from 'react';
import { Terminal, Database, Network, Cpu, Sparkles, ShieldCheck, Layers, Layers2 } from 'lucide-react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      
      {/* 1. Deep Obsidian Atmosphere & Radial Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[420px] bg-gradient-to-tr from-brand-blue/25 via-brand-purple/20 to-transparent rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[360px] h-[260px] bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[360px] h-[260px] bg-purple-600/15 rounded-full blur-[90px] pointer-events-none" />

      {/* 2. Orbiting Elliptical Dashed Curves */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
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

      {/* 5. Floating Project-Specific Sticker Cards (Desktop View) */}
      <div className="hidden lg:block relative w-full h-full max-w-6xl mx-auto pointer-events-auto">

        {/* CARD 1 (Top-Left): Raw Wire & Sockets */}
        <div className="absolute top-8 left-2 animate-float-slow">
          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-brand-blue/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 p-0.5 shadow-md shadow-brand-blue/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Network className="w-5 h-5 text-brand-blue" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>TCP Wire Protocol</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                Master raw \r\n byte streams behind HTTP.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 2 (Top-Right): 3-Phase Mental Models */}
        <div className="absolute top-10 right-4 animate-float-reverse">
          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-brand-purple/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-pink-500 p-0.5 shadow-md shadow-brand-purple/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-brand-purple" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">
                Zero Syntax Fatigue
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                Concepts transfer 1:1 across Node, Go & Rust.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3 (Bottom-Left): Live SQLite Disk Persistence */}
        <div className="absolute bottom-24 left-4 animate-float-gentle">
          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-emerald-500/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">
                On-Disk SQL & WAL
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                ACID persistence, B-Trees & relations.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 4 (Bottom-Right): Live Interactive API Lab */}
        <div className="absolute bottom-24 right-4 animate-float-slow">
          <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-[#232f4e]/80 shadow-2xl shadow-black/50 hover:border-cyan-400/60 transition duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md shadow-cyan-400/30 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight">
                Live Interactive Lab
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                Real HTTP requests & wire byte validation.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
