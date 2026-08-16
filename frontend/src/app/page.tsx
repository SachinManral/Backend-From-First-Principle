import React from 'react';
import Link from 'next/link';
import { getAllLectures } from '@/lib/lectures';
import HeroMeshScene from '@/components/visualizers/HeroMeshScene';
import { ArrowRight, Terminal, BookOpen, Layers, ShieldCheck, Zap, Download, Play, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function HomePage() {
  const lectures = getAllLectures();

  return (
    <div className="space-y-16 pb-12">
      {/* 3D Interactive Hero Scene */}
      <section className="space-y-8">
        <HeroMeshScene />

        <div className="space-y-5">
          <div className="qt-pill">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
            <span>The Next Big Thing in Backend Engineering</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Rebuilding Backend Systems<br />
            <span className="bg-purple-crush bg-clip-text text-transparent">
              Into A Revolutionary Form.
            </span>
          </h1>

          <p className="text-sm md:text-lg text-zinc-400 max-w-3xl leading-relaxed">
            Developing foundational engineering mechanics from first principles. Master language-agnostic protocols, kernel sockets, DNS hops, CORS preflights, and streaming pipelines with real live endpoints.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/lectures/01-roadmap"
              className="qt-btn-primary"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Curriculum (Lecture 1–2)</span>
            </Link>

            <Link
              href="/playground"
              className="qt-btn-secondary"
            >
              <Terminal className="w-4 h-4 text-brand-cyan" />
              <span>Explore Live Playground</span>
            </Link>

            <a
              href={`${API_BASE_URL}/api/export/postman`}
              download="backend-first-principles.postman_collection.json"
              target="_blank"
              rel="noreferrer"
              className="qt-btn-secondary hover:text-brand-amber hover:border-amber-500/40"
            >
              <Download className="w-4 h-4 text-brand-amber" />
              <span>Postman Collection</span>
            </a>
          </div>
        </div>
      </section>

      {/* Quantango-Style Pillar Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="qt-card p-7 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-brand-cyan mb-5 group-hover:scale-110 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">First-Principles Notes</h3>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Concise, structured breakdowns explaining *why* mechanisms exist at the OS and protocol level without framework jargon.
          </p>
        </div>

        <div className="qt-card p-7 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/25 flex items-center justify-center text-brand-indigo mb-5 group-hover:scale-110 transition">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">3D Concept Visualizers</h3>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Interactive visualizers modeling the 6-hop packet journey, CORS preflight OPTIONS handshakes, and ETag cache hit validation.
          </p>
        </div>

        <div className="qt-card p-7 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/25 flex items-center justify-center text-brand-emerald mb-5 group-hover:scale-110 transition">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Live Practical Lab</h3>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            9 real Express endpoints you can trigger in-browser, inspect raw byte headers, test with cURL, or download in Postman.
          </p>
        </div>
      </section>

      {/* Curriculum Lecture Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Curriculum & Seed Modules</h2>
            <p className="text-xs text-zinc-400 mt-1">Structured 3-Phase roadmap for backend engineering mastery</p>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-surface border border-surface-border text-brand-cyan">
            {lectures.length} Active Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lectures.map(lecture => (
            <Link
              key={lecture.slug}
              href={`/lectures/${lecture.slug}`}
              className="qt-card p-7 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                    Lecture {lecture.lectureNumber}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {lecture.duration}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition">
                  {lecture.title}
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {lecture.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-500 font-mono">
                  {lecture.phaseTitle}
                </span>
                <span className="text-brand-cyan flex items-center gap-1.5 font-bold group-hover:translate-x-1.5 transition">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
