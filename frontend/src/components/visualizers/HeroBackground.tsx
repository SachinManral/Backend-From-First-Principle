'use client';

import React from 'react';
import { Network, Database, ShieldCheck, Cpu, Zap, Layers, Server, Terminal } from 'lucide-react';

export default function HeroBackground() {
  const stickers = [
    { label: 'TCP 3-Way Handshake', icon: Network, pos: 'top-8 left-[8%]', color: 'text-brand-blue border-brand-blue/30 bg-brand-blue/10' },
    { label: 'SQLite WAL Mode', icon: Database, pos: 'top-16 right-[10%]', color: 'text-brand-emerald border-brand-emerald/30 bg-brand-emerald/10' },
    { label: 'CORS Preflight (OPTIONS)', icon: ShieldCheck, pos: 'bottom-12 left-[12%]', color: 'text-brand-purple border-brand-purple/30 bg-brand-purple/10' },
    { label: '304 Not Modified & ETag', icon: Zap, pos: 'bottom-16 right-[12%]', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
    { label: 'Libuv Event Loop Threadpool', icon: Cpu, pos: 'top-[42%] left-[4%]', color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10' },
    { label: 'Chunked SSE Stream', icon: Layers, pos: 'top-[45%] right-[5%]', color: 'text-rose-400 border-rose-400/30 bg-rose-400/10' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Radial Gradient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-blue/20 via-brand-purple/15 to-transparent rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[200px] bg-brand-blue/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[200px] bg-brand-purple/15 rounded-full blur-3xl" />

      {/* Subtle Geometric Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Floating Classy Tech Stickers (Desktop Only) */}
      <div className="hidden lg:block relative w-full h-full max-w-7xl mx-auto">
        {stickers.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className={`absolute ${st.pos} flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md text-[11px] font-mono font-medium transition duration-500 hover:scale-105 ${st.color}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
