import React from 'react';
import Link from 'next/link';
import { getAllLectures } from '@/lib/lectures';
import HeroMeshScene from '@/components/visualizers/HeroMeshScene';
import { ArrowRight, Terminal, BookOpen, Layers, ShieldCheck, Zap, Download, Play, Cpu, Sparkles, CheckCircle2, Server, Database, Network, Flame, Check, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function HomePage() {
  const lectures = getAllLectures();

  const technologies = [
    { name: 'HTTP/1.1 & HTTP/2', category: 'Protocols', icon: Network },
    { name: 'TCP/IP Sockets', category: 'Networking', icon: Server },
    { name: 'DNS & Edge Caching', category: 'Infrastructure', icon: Zap },
    { name: 'CORS Preflight & Headers', category: 'Security', icon: ShieldCheck },
    { name: 'Chunked Streaming', category: 'I/O Mechanics', icon: Layers },
    { name: 'Gzip & Brotli Compression', category: 'Payloads', icon: Cpu },
    { name: 'Event Loop & Libuv', category: 'Concurrency', icon: Flame },
    { name: 'Message Queues & Redis', category: 'Distributed', icon: Database },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 3D Interactive Hero Section */}
      <section className="relative space-y-8 pt-4 md:pt-6">
        <HeroMeshScene />

        <div className="space-y-6 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="codehelp-pill">
            <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-sparkle-pulse" />
            <span className="font-semibold text-xs tracking-wide">
              Deep Technical Mastery from First Principles
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12]">
            Master Backend Architecture.<br />
            <span className="codehelp-heading-gradient">
              Built From First Principles.
            </span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Uncover the raw mechanics of modern distributed software. Dive deep into kernel sockets, 6-hop packet lifecycles, HTTP multiplexing, CORS handshakes, and wire-level byte inspection with live interactive endpoints.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/lectures/01-roadmap"
              className="codehelp-gradient-btn !py-3 !px-6 !text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Explore Curriculum (Lecture 1–2)</span>
            </Link>

            <Link
              href="/playground"
              className="codehelp-secondary-btn !py-3 !px-6 !text-sm"
            >
              <Terminal className="w-4 h-4 text-brand-blue" />
              <span>Launch Live Lab</span>
            </Link>

            <a
              href={`${API_BASE_URL}/api/export/postman`}
              download="backend-first-principles.postman_collection.json"
              target="_blank"
              rel="noreferrer"
              className="codehelp-secondary-btn !py-3 !px-6 !text-sm hover:text-brand-amber hover:border-brand-amber/40"
            >
              <Download className="w-4 h-4 text-brand-amber" />
              <span>Postman Collection</span>
            </a>
          </div>
        </div>
      </section>

      {/* Infinite Smooth Tech Marquee */}
      <section className="py-5 border-y border-border/70 overflow-hidden relative bg-card/30">
        <div className="marquee-container">
          <div className="animate-marquee flex items-center gap-6 shrink-0">
            {technologies.concat(technologies).map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-card border border-border/80 text-xs font-semibold shadow-top whitespace-nowrap"
                >
                  <Icon className="w-4 h-4 text-brand-blue" />
                  <span className="text-foreground">{tech.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-secondary">
                    {tech.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Pillars Bento Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="codehelp-pill">
            <Layers className="w-3.5 h-3.5 text-brand-blue" />
            <span>Interactive Learning Model</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            How You Will Master Backend Systems
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            A three-dimensional pedagogical approach combining theory, physics simulation, and real live code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="codehelp-glow-card p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-5 group-hover:scale-110 transition duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">1. First-Principles Notes</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Deep, structured breakdowns explaining <em>why</em> protocols and architectural decisions exist from the Linux kernel and network socket layer upwards.
            </p>
          </div>

          <div className="codehelp-glow-card p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple mb-5 group-hover:scale-110 transition duration-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">2. 3D Concept Visualizers</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Real-time interactive canvas visualizers demonstrating 6-hop packet trajectories, CORS preflight validation, and ETag cache invalidations.
            </p>
          </div>

          <div className="codehelp-glow-card p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald mb-5 group-hover:scale-110 transition duration-300">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">3. Live Practical Lab</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              9 real Express.js backend endpoints ready to trigger in-browser. Inspect raw byte headers, test curl commands, or export directly to Postman.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Lecture Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">Curriculum Modules</h2>
            <p className="text-xs text-muted-foreground mt-1">Step-by-step modular lessons covering protocol internals, streaming, and architecture</p>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-secondary border border-border text-brand-blue self-start sm:self-auto">
            {lectures.length} Active Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lectures.map(lecture => (
            <Link
              key={lecture.slug}
              href={`/lectures/${lecture.slug}`}
              className="codehelp-glow-card p-7 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/30">
                    Lecture {lecture.lectureNumber}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {lecture.duration}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-brand-blue transition">
                  {lecture.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {lecture.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {lecture.phaseTitle}
                </span>
                <span className="text-brand-blue flex items-center gap-1.5 font-bold group-hover:translate-x-1.5 transition">
                  <span>Start Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why First Principles Comparison Matrix */}
      <section className="codehelp-glow-card p-8 md:p-10 space-y-8">
        <div className="max-w-2xl">
          <div className="codehelp-pill mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-amber" />
            <span>Methodology Comparison</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Why First Principles Matter
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Frameworks come and go every 2 years. Core protocols, socket models, and memory architectures have remained constant for over 30 years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-3">
            <div className="text-xs font-mono font-bold text-brand-rose uppercase tracking-wider">
              Traditional Tutorial Roadmaps
            </div>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-brand-rose font-bold">✕</span>
                <span>Copy-pasting Express boilerplates without understanding TCP socket handshakes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-rose font-bold">✕</span>
                <span>Treating CORS errors by blindly adding `cors()` middleware without understanding preflight OPTIONS requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-rose font-bold">✕</span>
                <span>Memorizing status codes without knowing cache revalidation & 304 Not Modified wire byte headers.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-brand-blue/5 border border-brand-blue/30 space-y-3">
            <div className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">
              First Principles Mastery
            </div>
            <ul className="space-y-2.5 text-xs text-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>Understand OS sockets, file descriptors, and Libuv event loop threadpools.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>Simulate and observe exact browser security preflights and header validations live.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <span>Inspect exact Content-Length, chunked transfer encoding, and Brotli byte streams in real-time.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-blue/15 via-brand-purple/15 to-transparent border border-brand-blue/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Ready to dive into the architecture?
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
            Start with Lecture 01: Complete Backend Roadmap or test live API endpoints in the interactive lab.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/lectures/01-roadmap"
            className="codehelp-gradient-btn !py-3 !px-6 !text-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Lecture 01</span>
          </Link>
          <Link
            href="/playground"
            className="codehelp-secondary-btn !py-3 !px-6 !text-sm"
          >
            <span>Live Lab</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
