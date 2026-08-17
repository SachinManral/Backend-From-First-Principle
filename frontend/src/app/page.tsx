import React from 'react';
import Link from 'next/link';
import HeroBackground from '@/components/visualizers/HeroBackground';
import { ArrowRight, Terminal, BookOpen, Layers, ShieldCheck, Zap, Sparkles, Network, Database, Cpu, Flame, Check, HelpCircle, TerminalSquare, Globe } from 'lucide-react';

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
      icon: Cpu,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Showcase with Freely Floating Tech Cards */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center text-center pt-6 sm:pt-12 pb-10">
        <HeroBackground />

        {/* Hero Central Wrapper with Floating Badges Attached */}
        <div className="relative w-full max-w-5xl mx-auto px-4 z-10 flex flex-col items-center">
          
          {/* FLOATING CARD 1: Top-Left (Visible on LG screens) */}
          <div className="hidden lg:block absolute -top-4 -left-12 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/90 backdrop-blur-xl border border-[#232f4e] shadow-2xl shadow-black/60 hover:border-brand-blue/60 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-indigo-600 p-0.5 shadow-md shadow-brand-blue/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Network className="w-5 h-5 text-brand-blue" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  TCP Wire Protocol
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                  Master raw \r\n byte streams behind HTTP.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 2: Top-Right (Visible on LG screens) */}
          <div className="hidden lg:block absolute -top-2 -right-12 animate-float-reverse z-20 pointer-events-auto">
            <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/90 backdrop-blur-xl border border-[#232f4e] shadow-2xl shadow-black/60 hover:border-brand-purple/60 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-pink-500 p-0.5 shadow-md shadow-brand-purple/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-brand-purple" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  Zero Syntax Fatigue
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                  Concepts transfer 1:1 across Node, Go & Rust.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 3: Bottom-Left (Visible on LG screens) */}
          <div className="hidden lg:block absolute bottom-4 -left-16 animate-float-gentle z-20 pointer-events-auto">
            <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/90 backdrop-blur-xl border border-[#232f4e] shadow-2xl shadow-black/60 hover:border-emerald-500/60 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  On-Disk SQL & WAL
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                  ACID persistence, B-Trees & relations.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 4: Bottom-Right (Visible on LG screens) */}
          <div className="hidden lg:block absolute bottom-2 -right-16 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3.5 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/90 backdrop-blur-xl border border-[#232f4e] shadow-2xl shadow-black/60 hover:border-cyan-400/60 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md shadow-cyan-400/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-300" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  Live Interactive Lab
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[155px] leading-tight">
                  Real HTTP requests & wire byte validation.
                </p>
              </div>
            </div>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Master Backend <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Engineering.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Understand how distributed systems work beneath the frameworks. From raw TCP sockets and HTTP byte streams to persistent SQL databases and scalable architecture.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/lectures/01-roadmap"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 shadow-xl shadow-brand-blue/25 transition duration-200 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-[#0d1222]/90 hover:bg-[#151c33] border border-[#243050] hover:border-brand-blue/50 shadow-lg backdrop-blur-md transition duration-200 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-brand-blue" />
                <span>Launch Interactive Lab</span>
              </Link>
            </div>
          </div>

        </div>

        {/* 2. Feature Badges Pill Bar (Just above the Horizon Grid / Stats) */}
        <div className="w-full max-w-3xl mx-auto mt-16 sm:mt-20 z-10 px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-3 px-6 rounded-full bg-[#0b1020]/90 border border-[#1e2a4a]/80 shadow-2xl backdrop-blur-xl text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Layers className="w-3.5 h-3.5 text-brand-purple" />
              <span>3-Phase Mental Models</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Network className="w-3.5 h-3.5 text-brand-blue" />
              <span>Raw Sockets & Wire Protocol</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>SQLite WAL Disk Persistence</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <TerminalSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live API Sandbox</span>
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
                className="p-6 rounded-2xl bg-[#090e1c]/90 border border-[#1b2644] shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-brand-blue/50 transition duration-300 group"
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
          <div className="p-8 rounded-2xl bg-[#090e1c]/90 border border-[#1b2644] shadow-xl space-y-4 hover:border-brand-purple/50 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Phase 1: Story & Mental Models</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Understand <em>why</em> backends exist, eliminating syntax fatigue, client-server coordination boundaries, and forming resilient architectural mental maps.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#090e1c]/90 border border-[#1b2644] shadow-xl space-y-4 hover:border-brand-blue/50 transition duration-300">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Phase 2: Build Real Mechanisms</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Construct real HTTP/1.1 byte parsers, routing lookup trees, on-disk SQL storage engines, CORS handshakes, and streaming SSE pipelines from scratch.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#090e1c]/90 border border-[#1b2644] shadow-xl space-y-4 hover:border-emerald-500/50 transition duration-300">
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
      <section className="p-8 md:p-10 rounded-3xl bg-[#090e1c]/90 border border-[#1b2644] shadow-2xl space-y-8 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
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
          <div className="p-6 rounded-2xl bg-[#0c1326]/80 border border-[#202c4c] space-y-3">
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
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Understand OS sockets, file descriptors, and Libuv event loop threadpools.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Simulate and observe exact browser security preflights and header validations live.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
            Start with Lecture 01: Complete 31-Milestone Roadmap or test live API endpoints in the interactive sandbox.
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-zinc-200 bg-[#0d1222]/90 hover:bg-[#151c33] border border-[#243050] hover:border-brand-blue/50 shadow-md backdrop-blur-md transition cursor-pointer"
          >
            <span>Live Lab Console</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
