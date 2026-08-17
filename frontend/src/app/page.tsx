import React from 'react';
import Link from 'next/link';
import HeroBackground from '@/components/visualizers/HeroBackground';
import { ArrowRight, Terminal, BookOpen, Layers, Zap, Network, Database, Cpu, ChevronRight, Check, Sparkles, TerminalSquare } from 'lucide-react';

export default function HomePage() {
  const stats = [
    {
      number: '31',
      title: 'Curriculum Milestones',
      subtitle: 'Complete foundational roadmap',
      icon: BookOpen,
      color: 'text-brand-purple bg-brand-purple/10 border-brand-purple/30',
      glow: 'group-hover:border-brand-purple/50 shadow-brand-purple/10',
    },
    {
      number: '3-Phase',
      title: 'Mental Model',
      subtitle: 'Story ➔ Mechanics ➔ Scale',
      icon: Layers,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      glow: 'group-hover:border-emerald-500/50 shadow-emerald-500/10',
    },
    {
      number: '100%',
      title: 'First Principles',
      subtitle: 'Zero boilerplate copying',
      icon: Zap,
      color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/30',
      glow: 'group-hover:border-brand-blue/50 shadow-brand-blue/10',
    },
    {
      number: 'Zero',
      title: 'Syntax Fatigue',
      subtitle: 'Transfer concepts across languages',
      icon: Terminal,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      glow: 'group-hover:border-amber-500/50 shadow-amber-500/10',
    },
  ];

  const phases = [
    {
      step: '01',
      title: 'Phase 1: Story & Mental Models',
      subtitle: 'Philosophy, Motivation & High-Level Architecture',
      description: 'Understand why backends exist, eliminate syntax fatigue, discover the 6-hop packet journey, and form an unshakable mental model before writing code.',
      topics: ['Eliminating Syntax Fatigue', 'The 6-Hop Request Journey', 'State Synchronization & Concurrency', 'The 31-Milestone Roadmap'],
      color: 'border-brand-purple/40 text-brand-purple bg-brand-purple/10',
      tag: 'Mental Foundations',
      href: '/lectures/01-roadmap',
    },
    {
      step: '02',
      title: 'Phase 2: Build Real Mechanisms',
      subtitle: 'From Raw TCP Sockets to SQL & Ingress Trees',
      description: 'Construct real HTTP/1.1 wire parsers, routing trees, SQLite on-disk persistence, CORS preflight handshakes, and chunked SSE streaming pipelines from scratch.',
      topics: ['TCP Socket Handshakes & SOH/CRLF', 'HTTP/1.1 vs HTTP/2 Multiplexing', 'SQLite WAL Mode & Disk Storage', 'Dynamic Parameter Routing Trees'],
      color: 'border-brand-blue/40 text-brand-blue bg-brand-blue/10',
      tag: 'Core Engineering',
      href: '/lectures/05-http-protocol',
    },
    {
      step: '03',
      title: 'Phase 3: Scale to 1M Users',
      subtitle: 'Distributed Systems, Caching & High Availability',
      description: 'Scale beyond single-instance bottlenecks with Redis cache-aside invalidation, connection pooling, write-ahead logs, and distributed message brokers.',
      topics: ['Connection Pool Management', 'Redis Cache Invalidation Patterns', 'Write-Ahead Logging (WAL) & B-Trees', 'Horizontal Load Balancing (Nginx)'],
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      tag: 'Production Scale',
      href: '/playground',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SHOWCASE WITH NATURAL FLOATING SPATIAL ELEMENTS                   */}
      {/* ========================================================================= */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center text-center pt-6 sm:pt-14 pb-8">
        <HeroBackground />

        {/* Central Hero Container with Natural Floating Stickers */}
        <div className="relative w-full max-w-5xl mx-auto px-4 z-10 flex flex-col items-center">
          
          {/* FLOATING CARD 1: Top-Left (Kernel Sockets & Wire Protocol) */}
          <div className="hidden xl:block absolute -top-4 -left-12 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(92,119,219,0.15)] hover:border-brand-blue/60 transition duration-300 -rotate-2 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-md shadow-brand-blue/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Network className="w-5 h-5 text-brand-blue" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  TCP Wire Protocol
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  Master raw \r\n byte streams behind HTTP.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 2: Top-Right (Zero Syntax Fatigue) */}
          <div className="hidden xl:block absolute -top-2 -right-12 animate-float-reverse z-20 pointer-events-auto">
            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(172,132,235,0.15)] hover:border-brand-purple/60 transition duration-300 rotate-2 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-indigo-500 p-0.5 shadow-md shadow-brand-purple/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-brand-purple" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  Zero Syntax Fatigue
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  Concepts transfer 1:1 across Node, Go & Rust.
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING ELEMENT 3: Bottom-Left (3D Isometric Database Cylinder + Terminal Badge) */}
          <div className="hidden xl:block absolute bottom-6 -left-14 animate-float-gentle z-20 pointer-events-auto">
            <div className="absolute -top-5 left-8 px-2 py-0.5 rounded-md bg-[#090e1c] border border-cyan-400/40 shadow-lg text-[10px] font-mono text-cyan-300 font-bold -rotate-6">
              &gt;_
            </div>

            <div className="w-14 h-16 relative flex flex-col items-center justify-center opacity-90 hover:opacity-100 transition duration-300 drop-shadow-[0_0_15px_rgba(92,119,219,0.4)]">
              <div className="w-12 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border border-cyan-400/60 shadow-[0_0_15px_#5c77db] relative z-20" />
              <div className="w-12 h-6 bg-gradient-to-b from-blue-700 via-indigo-900 to-[#0a1020] border-x border-cyan-400/40 -mt-2.5 relative z-10" />
              <div className="w-12 h-5 rounded-full bg-indigo-950 border border-cyan-400/40 -mt-2.5 shadow-md relative z-10" />
              <div className="w-12 h-6 bg-gradient-to-b from-blue-700 via-indigo-900 to-[#0a1020] border-x border-cyan-400/40 -mt-2.5 relative z-0" />
              <div className="w-12 h-5 rounded-full bg-[#080d1a] border border-cyan-400/40 -mt-2.5 shadow-xl relative z-0" />
            </div>
          </div>

          {/* FLOATING CARD 4: Bottom-Right (On-Disk SQL & WAL Persistence) */}
          <div className="hidden xl:block absolute bottom-4 -right-14 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 transition duration-300 -rotate-1 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  On-Disk SQL & WAL
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  ACID persistence, B-Trees & relations.
                </p>
              </div>
            </div>
          </div>

          {/* Main Hero Typography & Call-to-Actions */}
          <div className="space-y-5 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Master Backend <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Engineering.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed font-normal">
              Learn how distributed systems work beneath the frameworks. From raw TCP sockets and HTTP byte streams to persistent SQL databases and scalable architecture.
            </p>

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

        {/* 2. Practical Project Badges Bar */}
        <div className="w-full max-w-3xl mx-auto mt-14 sm:mt-18 z-10 px-4">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-6 py-2.5 px-6 rounded-full bg-[#0b1020]/80 border border-white/10 shadow-2xl backdrop-blur-2xl text-xs text-zinc-300 font-medium">
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <Layers className="w-3.5 h-3.5 text-brand-purple" />
              <span>3-Phase Mental Models</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <Network className="w-3.5 h-3.5 text-brand-blue" />
              <span>Raw Sockets & Protocols</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>SQLite WAL Disk Persistence</span>
            </div>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-zinc-300 shrink-0">
              <TerminalSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Port 4000 Sandbox</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS 4-CARD BENTO GRID                                                */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-[#090e1c]/80 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-4 hover:border-brand-blue/50 transition duration-300 group ${st.glow}`}
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

      {/* ========================================================================= */}
      {/* 3. LIVE INTERACTIVE SANDBOX SPOTLIGHT PREVIEW                              */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090e1c]/85 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Text & Pitch */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Full-Stack Interactive Console</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Real HTTP & SQLite Execution in Your Browser
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Every lecture is backed by live running endpoints on port 4000 and on-disk SQLite WAL persistence. Test parameterized routes, observe ETag 304 caching, inspect chunked streams, and validate real wire headers.
              </p>
              <div className="pt-2">
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-indigo text-white text-xs font-bold transition shadow-lg shadow-brand-blue/20 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open API Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Live Simulated Console Frame */}
            <div className="lg:col-span-7 rounded-2xl bg-[#060a14] border border-[#1b2644] shadow-2xl overflow-hidden font-mono text-xs">
              {/* Terminal Bar */}
              <div className="px-4 py-2.5 bg-[#0b1020] border-b border-[#1b2644] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-zinc-400 font-semibold ml-2">GET /api/demo/routing/books-paginated?page=1&limit=2</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  200 OK • 1.4ms
                </span>
              </div>

              {/* Console Body */}
              <div className="p-4 space-y-3 text-zinc-300 overflow-x-auto">
                <div className="text-zinc-500 text-[11px]">
                  # SQL Query Executed against backend/data/dev.db (SQLite WAL Mode):
                </div>
                <div className="text-cyan-400 font-semibold text-[11px]">
                  SELECT * FROM books ORDER BY id ASC LIMIT 2 OFFSET 0;
                </div>
                <div className="p-3 rounded-xl bg-[#090e1c] border border-[#18223c] text-emerald-400 leading-relaxed text-[11px]">
                  {`{
  "_meta": {
    "routeType": "Paginated SQL Query Route",
    "currentPage": 1,
    "totalRecords": 5,
    "database": "SQLite Disk Persistent (WAL Mode)"
  },
  "data": [
    { "id": 1, "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann" },
    { "id": 2, "title": "Computer Networking: A Top-Down Approach", "author": "Kurose & Ross" }
  ]
}`}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 3-PHASE MASTERY CURRICULUM NODES                                   */}
      {/* ========================================================================= */}
      <section className="space-y-10 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The 3-Phase Mastery Curriculum
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A three-dimensional pedagogical approach combining deep theory, architectural mechanics, and real live code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {phases.map((p, idx) => (
            <Link
              key={idx}
              href={p.href}
              className="p-8 rounded-3xl bg-[#090e1c]/80 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-brand-blue/50 transition duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-zinc-600 group-hover:text-brand-blue transition">
                    {p.step}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${p.color}`}>
                    {p.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition">
                    {p.title}
                  </h3>
                  <div className="text-xs text-brand-purple font-medium mt-0.5">
                    {p.subtitle}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {p.topics.map((top, tIdx) => (
                    <div key={tIdx} className="text-[11px] text-zinc-300 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-brand-blue" />
                      <span>{top}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs font-bold text-brand-blue group-hover:text-cyan-300 transition">
                <span>Explore Phase</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY FIRST PRINCIPLES MATTER COMPARISON MATRIX                          */}
      {/* ========================================================================= */}
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
          {/* Traditional Roadmaps */}
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

          {/* First Principles Mastery */}
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

      {/* ========================================================================= */}
      {/* 6. BOTTOM CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
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
