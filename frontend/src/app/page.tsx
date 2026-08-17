import React from 'react';
import Link from 'next/link';
import HeroBackground from '@/components/visualizers/HeroBackground';
import { ArrowRight, Terminal, BookOpen, Layers, Zap, Database, Network, Code, Sparkles, Check } from 'lucide-react';

export default function HomePage() {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Concept-First Breakdowns',
      description: 'Clear, structured explanations focused on the underlying mechanics of backend systems rather than surface-level syntax.',
      color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/30',
    },
    {
      icon: Network,
      title: 'Side-by-Side Wire Anatomy',
      description: 'Inspect exact request/response lifecycles, HTTP headers, status codes, and JSON payloads with formatted side-by-side examples.',
      color: 'text-brand-purple bg-brand-purple/10 border-brand-purple/30',
    },
    {
      icon: Terminal,
      title: 'Live Interactive Lab',
      description: 'Test real API endpoints, query on-disk SQLite tables, and experiment directly in the browser with live backend execution.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  const topicsCovered = [
    'TCP Socket Handshakes & Lifecycle',
    'HTTP/1.1 Wire Protocol & Headers',
    'CORS Preflight & Browser Security',
    'HTTP Caching & 304 Not Modified',
    'Payload Compression (Gzip & Brotli)',
    'Multipart Uploads & Chunked Streaming',
    'Static, Dynamic & Nested Routing Trees',
    'Relational SQL & Disk Persistence',
  ];

  return (
    <div className="space-y-20 sm:space-y-24 pb-20">
      
      {/* 1. Clean, Modern Hero Section */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex flex-col items-center justify-center text-center pt-8 sm:pt-14 pb-4">
        <HeroBackground />

        {/* Central Content */}
        <div className="relative w-full max-w-4xl mx-auto px-4 z-10 flex flex-col items-center">
          
          {/* Floating Card 1: Top-Left (Desktop Only) */}
          <div className="hidden xl:block absolute -top-4 -left-16 animate-float-slow z-20 pointer-events-auto">
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

          {/* Floating Card 2: Top-Right (Desktop Only) */}
          <div className="hidden xl:block absolute -top-2 -right-16 animate-float-reverse z-20 pointer-events-auto">
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
                  Concepts transfer 1:1 across any language.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Card 3: Bottom-Left (Desktop Only) */}
          <div className="hidden xl:block absolute bottom-6 -left-16 animate-float-gentle z-20 pointer-events-auto">
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

          {/* Floating Card 4: Bottom-Right (Desktop Only) */}
          <div className="hidden xl:block absolute bottom-4 -right-16 animate-float-slow z-20 pointer-events-auto">
            <div className="group flex items-start gap-3 p-3.5 pr-5 rounded-2xl bg-[#0d1222]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.15)] hover:border-cyan-400/60 transition duration-300 rotate-1 hover:rotate-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md shadow-cyan-400/30 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1222] rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-300" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">
                  Live Interactive Lab
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 max-w-[145px] leading-tight font-normal">
                  Real HTTP requests & wire byte validation.
                </p>
              </div>
            </div>
          </div>

          {/* Main Hero Typography */}
          <div className="space-y-5 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Master Backend <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                From First Principles.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
              A comprehensive, concept-first guide to backend engineering. Learn how protocols, networking, databases, and servers work from the ground up.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <Link
                href="/lectures/01-roadmap"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 shadow-xl shadow-brand-blue/30 hover:shadow-brand-purple/40 transition duration-200 cursor-pointer"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-zinc-200 bg-[#0d1222]/80 hover:bg-[#141b30] border border-white/10 hover:border-brand-blue/50 shadow-lg backdrop-blur-xl transition duration-200 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-brand-blue" />
                <span>Interactive Lab</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Core Pillars (What Makes This Platform Different) */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How You Will Learn
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A structured approach designed to build intuition before code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#090e1c]/80 border border-white/10 shadow-xl backdrop-blur-xl space-y-4 hover:border-brand-blue/50 transition duration-300"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${pillar.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Topics Covered Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090e1c]/80 border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="max-w-xl space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Foundational Topics Covered
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Each topic is accompanied by in-depth written notes, side-by-side wire representations, and running code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {topicsCovered.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0d1326]/60 border border-white/5 text-xs text-zinc-300 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why First Principles Matter */}
      <section className="p-8 md:p-10 rounded-3xl bg-[#090e1c]/80 border border-white/10 shadow-2xl space-y-8 max-w-6xl mx-auto px-4">
        <div className="max-w-2xl space-y-1.5">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Why Learn from First Principles?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Frameworks and libraries evolve constantly, but underlying network protocols, socket models, and database architectures remain stable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Way */}
          <div className="p-6 rounded-2xl bg-[#0c1326]/80 border border-white/10 space-y-3">
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Traditional Tutorial Roadmaps
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Copying framework boilerplates without understanding how TCP sockets and connections work.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Treating CORS errors blindly without understanding preflight OPTIONS requests and browser security.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Memorizing status codes without knowing cache revalidation, ETag hashing, and 304 Not Modified headers.</span>
              </li>
            </ul>
          </div>

          {/* First Principles Way */}
          <div className="p-6 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 space-y-3">
            <div className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">
              First Principles Learning
            </div>
            <ul className="space-y-2.5 text-xs text-zinc-200">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Understand OS sockets, file descriptors, and how event loops manage concurrent requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Inspect exact request lifecycles, HTTP wire byte streams, and header negotiations.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Learn concepts once that transfer seamlessly across Node.js, Go, Rust, and Python.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Clean Final Call to Action */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-blue/20 via-brand-purple/15 to-transparent border border-brand-blue/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl max-w-6xl mx-auto">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to start learning?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Dive into the curriculum starting with Lecture 01 or experiment with live endpoints in the interactive lab.
          </p>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <Link
            href="/lectures/01-roadmap"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 shadow-lg shadow-brand-blue/25 transition cursor-pointer"
          >
            <span>Start Lecture 01</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-zinc-200 bg-[#0d1222]/90 hover:bg-[#151c33] border border-white/10 hover:border-brand-blue/50 shadow-md backdrop-blur-md transition cursor-pointer"
          >
            <span>Interactive Lab</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
