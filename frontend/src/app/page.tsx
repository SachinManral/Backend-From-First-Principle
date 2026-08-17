import React from 'react';
import Link from 'next/link';
import HeroBackground from '@/components/visualizers/HeroBackground';
import { ArrowRight, Terminal, BookOpen, Layers, Zap, FlaskConical, Box, Shield, Code, Globe, Cloud, Database } from 'lucide-react';

export default function HomePage() {
  const stats = [
    {
      number: '31',
      title: 'Curriculum Milestones',
      subtitle: 'Complete foundational roadmap',
      icon: BookOpen,
      color: 'text-brand-purple bg-brand-purple/10 border-brand-purple/30',
    },
    {
      number: '3-Phase',
      title: 'Mental Model',
      subtitle: 'Story ➔ Mechanics ➔ Scale',
      icon: Layers,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      number: '100%',
      title: 'First Principles',
      subtitle: 'No copy-pasting boilerplates',
      icon: Zap,
      color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/30',
    },
    {
      number: 'Zero',
      title: 'Syntax Fatigue',
      subtitle: 'Concepts transfer to any language',
      icon: Terminal,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Showcase with Natural Freely Floating Spatial Elements */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center text-center pt-6 sm:pt-14 pb-8">
        <HeroBackground />

        {/* Central Hero Container with Natural Floating Stickers */}
        <div className="relative w-full max-w-5xl mx-auto px-4 z-10 flex flex-col items-center">
          
          {/* FLOATING CARD 1: Top-Left (Kernel Sockets) */}
          <div className="hidden xl:block absolute -top-3 -left-10 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(92,119,219,0.15)] hover:border-brand-blue/60 transition duration-300 -rotate-2 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-md shadow-brand-blue/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-blue fill-brand-blue/20" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  Kernel Sockets
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  Understand the backbone of real-time systems.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 2: Top-Right (HTTP Lifecycle + 3D Cloud) */}
          <div className="hidden xl:block absolute -top-1 -right-10 animate-float-reverse z-20 pointer-events-auto">
            {/* Small Floating 3D Cloud */}
            <div className="absolute -top-5 -right-3 text-brand-purple animate-float-gentle">
              <div className="p-1.5 rounded-xl bg-[#141a33]/90 border border-brand-purple/30 backdrop-blur-md shadow-lg shadow-brand-purple/20">
                <Cloud className="w-3.5 h-3.5 text-brand-purple fill-brand-purple/30" />
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(172,132,235,0.15)] hover:border-brand-purple/60 transition duration-300 rotate-2 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-indigo-500 p-0.5 shadow-md shadow-brand-purple/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-purple" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  HTTP Lifecycle
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  See how a request travels end-to-end.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING ELEMENT 3: Bottom-Left (3D Isometric Database Cylinder + Terminal Badge) */}
          <div className="hidden xl:block absolute bottom-6 -left-12 animate-float-gentle z-20 pointer-events-auto">
            {/* Terminal Prompt Badge */}
            <div className="absolute -top-5 left-8 px-2 py-0.5 rounded-md bg-[#090e1c] border border-cyan-400/40 shadow-lg text-[10px] font-mono text-cyan-300 font-bold -rotate-6">
              &gt;_
            </div>

            {/* Glowing 3D Isometric Cylinder Database */}
            <div className="w-14 h-16 relative flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition duration-300 drop-shadow-[0_0_15px_rgba(92,119,219,0.4)]">
              <div className="w-12 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border border-cyan-400/60 shadow-[0_0_15px_#5c77db] relative z-20" />
              <div className="w-12 h-6 bg-gradient-to-b from-blue-700 via-indigo-900 to-[#0a1020] border-x border-cyan-400/40 -mt-2.5 relative z-10" />
              <div className="w-12 h-5 rounded-full bg-indigo-950 border border-cyan-400/40 -mt-2.5 shadow-md relative z-10" />
              <div className="w-12 h-6 bg-gradient-to-b from-blue-700 via-indigo-900 to-[#0a1020] border-x border-cyan-400/40 -mt-2.5 relative z-0" />
              <div className="w-12 h-5 rounded-full bg-[#080d1a] border border-cyan-400/40 -mt-2.5 shadow-xl relative z-0" />
            </div>
          </div>

          {/* FLOATING CARD 4: Bottom-Right (SQL Persistence) */}
          <div className="hidden xl:block absolute bottom-4 -right-12 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 transition duration-300 -rotate-1 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  SQL Persistence
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  Store data that scales. Query like a pro.
                </p>
              </div>
            </div>
          </div>

          {/* Main Hero Typography & Call-to-Actions */}
          <div className="space-y-5 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Master Backend <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Architecture
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed font-normal">
              Learn by building. Understand by doing.<br className="hidden sm:inline" />
              From first principles to production systems.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <Link
                href="/lectures/01-roadmap"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 shadow-xl shadow-brand-blue/30 hover:shadow-brand-purple/40 transition duration-200 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-[#0d1222]/80 hover:bg-[#141b30] border border-white/10 hover:border-brand-blue/50 shadow-lg backdrop-blur-xl transition duration-200 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-brand-blue" />
                <span>Launch Interactive Lab</span>
              </Link>
            </div>
          </div>

        </div>

        {/* 2. Feature Badges Pill Bar (Clean single-line glass bar) */}
        <div className="w-full max-w-3xl mx-auto mt-14 sm:mt-18 z-10 px-4">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-6 py-2.5 px-6 rounded-full bg-[#0b1020]/80 border border-white/10 shadow-2xl backdrop-blur-2xl text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <FlaskConical className="w-3.5 h-3.5 text-brand-blue" />
              <span>Hands-on Labs</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <Box className="w-3.5 h-3.5 text-brand-purple" />
              <span>Real World Concepts</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Production Ready</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats 4-Card Bento Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#090e1c]/80 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-brand-blue/50 transition duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${st.color} group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {st.number}
                  </div>
                  <div className="text-sm font-bold text-zinc-200 mt-1">
                    {st.title}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {st.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Three Pillars of First-Principles Mastery */}
      <section className="space-y-8 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The 3-Phase Mastery Curriculum
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A three-dimensional pedagogical approach combining deep theory, architectural mechanics, and real live code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#090e1c]/80 border border-white/10 shadow-xl space-y-4 hover:border-brand-purple/50 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Phase 1: Story & Mental Models</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Understand <em>why</em> backends exist, eliminating syntax fatigue, client-server coordination boundaries, and forming resilient architectural mental maps.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#090e1c]/80 border border-white/10 shadow-xl space-y-4 hover:border-brand-blue/50 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Phase 2: Build Real Mechanisms</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Construct real HTTP/1.1 byte parsers, routing lookup trees, on-disk SQL storage engines, CORS handshakes, and streaming SSE pipelines from scratch.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#090e1c]/80 border border-white/10 shadow-xl space-y-4 hover:border-emerald-500/50 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Phase 3: Scale to 1M Users</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Master distributed message queues, cache-aside invalidation, database connection pooling, WAL logging, and horizontal load balancing.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Why First Principles Matter Comparison Matrix */}
      <section className="p-8 md:p-10 rounded-3xl bg-[#090e1c]/80 border border-white/10 shadow-2xl space-y-8 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <span>Methodology Comparison</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Why First Principles Matter
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Frameworks come and go every 2 years. Core protocols, socket models, and memory architectures have remained constant for over 30 years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0c1326]/80 border border-white/10 space-y-3">
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Traditional Tutorial Roadmaps
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Copy-pasting Express boilerplates without understanding TCP socket handshakes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Treating CORS errors by blindly adding `cors()` middleware without understanding preflight OPTIONS requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Memorizing status codes without knowing cache revalidation & 304 Not Modified wire byte headers.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 space-y-3">
            <div className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">
              First Principles Mastery
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Understand OS sockets, file descriptors, and Libuv event loop threadpools.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Simulate and observe exact browser security preflights and header validations live.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Inspect exact Content-Length, chunked transfer encoding, and Brotli byte streams in real-time.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-blue/20 via-brand-purple/15 to-transparent border border-brand-blue/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl max-w-6xl mx-auto">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to dive into the architecture?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Start with the foundational roadmap or test live API endpoints in the interactive sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <Link
            href="/lectures/01-roadmap"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 shadow-lg shadow-brand-blue/25 transition cursor-pointer"
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-zinc-200 bg-[#0d1222]/90 hover:bg-[#151c33] border border-white/10 hover:border-brand-blue/50 shadow-md backdrop-blur-md transition cursor-pointer"
          >
            <span>Live Lab Console</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
