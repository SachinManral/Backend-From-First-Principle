import React from 'react';
import Link from 'next/link';
import HeroBackground from '@/components/visualizers/HeroBackground';
import { ArrowRight, Terminal, BookOpen, Layers, ShieldCheck, Zap, Play, Cpu, Server, Database, Network, Flame, Check, HelpCircle } from 'lucide-react';

export default function HomePage() {
  const technologies = [
    { name: 'HTTP/1.1 & HTTP/2', category: 'Protocols', icon: Network },
    { name: 'TCP/IP Sockets', category: 'Networking', icon: Server },
    { name: 'SQLite WAL Mode', category: 'Persistence', icon: Database },
    { name: 'CORS Preflight & Headers', category: 'Security', icon: ShieldCheck },
    { name: 'Chunked Streaming', category: 'I/O Mechanics', icon: Layers },
    { name: 'Gzip & Brotli Compression', category: 'Payloads', icon: Cpu },
    { name: 'Event Loop & Libuv', category: 'Concurrency', icon: Flame },
    { name: 'ETag & 304 Caching', category: 'Performance', icon: Zap },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* Clean, Classy Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[560px] flex flex-col items-center justify-center text-center pt-8 sm:pt-16 pb-6">
        <HeroBackground />

        <div className="space-y-6 max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.08]">
            Master Backend Architecture.<br />
            <span className="codehelp-heading-gradient">
              Built From First Principles.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            Uncover the raw mechanics of modern distributed software. Dive deep into kernel sockets, HTTP packet lifecycles, on-disk SQL persistence, and live API endpoints.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/lectures/01-roadmap"
              className="codehelp-gradient-btn !py-3.5 !px-7 !text-sm !rounded-full shadow-lg shadow-brand-blue/25"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/playground"
              className="codehelp-secondary-btn !py-3.5 !px-7 !text-sm !rounded-full"
            >
              <Terminal className="w-4 h-4 text-brand-blue mr-1" />
              <span>Launch Interactive Lab</span>
            </Link>
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
      <section className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            How You Will Master Backend Systems
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A three-dimensional pedagogical approach combining deep theory, architectural mechanics, and real live code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="codehelp-glow-card p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-5 group-hover:scale-110 transition duration-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">1. First-Principles Notes</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Deep, structured breakdowns explaining <em>why</em> protocols and architectural decisions exist from the Linux kernel and network socket layer upwards.
            </p>
          </div>

          <div className="codehelp-glow-card p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple mb-5 group-hover:scale-110 transition duration-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">2. Concept Visualizers</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Real-time interactive canvas visualizers demonstrating 6-hop packet trajectories, CORS preflight validation, and ETag cache invalidations.
            </p>
          </div>

          <div className="codehelp-glow-card p-8 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald mb-5 group-hover:scale-110 transition duration-300">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">3. Live Practical Lab</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Real Express & SQLite backend endpoints ready to trigger in-browser. Inspect raw byte headers, query disk SQL tables, and test live HTTP parameters.
            </p>
          </div>
        </div>
      </section>

      {/* Why First Principles Comparison Matrix */}
      <section className="codehelp-glow-card p-8 md:p-10 space-y-8 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <div className="codehelp-pill mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-amber" />
            <span>Methodology Comparison</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Why First Principles Matter
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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

      {/* Clean Call To Action Section */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-blue/15 via-brand-purple/15 to-transparent border border-brand-blue/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl max-w-6xl mx-auto">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            Ready to dive into the architecture?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Start with Lecture 01: Complete Backend Roadmap or explore live endpoints in the interactive lab.
          </p>
        </div>

        <div className="flex items-center gap-3.5 shrink-0">
          <Link
            href="/lectures/01-roadmap"
            className="codehelp-gradient-btn !py-3 !px-6 !text-sm !rounded-full"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Explore Curriculum</span>
          </Link>
          <Link
            href="/playground"
            className="codehelp-secondary-btn !py-3 !px-6 !text-sm !rounded-full"
          >
            <span>Live Lab</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
