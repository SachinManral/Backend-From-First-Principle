import React from 'react';
import Link from 'next/link';
import { getAllLectures } from '@/lib/lectures';
import HeroMeshScene from '@/components/visualizers/HeroMeshScene';
import { ArrowRight, Terminal, BookOpen, Layers, ShieldCheck, Zap, Download, Play, Cpu, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/demos';

export default function HomePage() {
  const lectures = getAllLectures();

  return (
    <div className="space-y-12">
      {/* 3D Hero Visualizer Scene */}
      <section className="space-y-6">
        <HeroMeshScene />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
            <Zap className="w-3.5 h-3.5 fill-brand-cyan" />
            <span>Sriniously Course Companion & Interactive Lab</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Backend Engineering,<br />
            <span className="bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-emerald bg-clip-text text-transparent">
              Mastered From First Principles.
            </span>
          </h1>

          <p className="text-sm md:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Stop memorizing framework APIs. Understand the underlying mechanics—how operating systems handle sockets, how TCP streams bytes, why CORS preflights exist, and how caching ETags prevent redundant bandwidth.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/lectures/01-roadmap"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan hover:bg-cyan-400 text-black font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Start Learning (Lecture 1–2)</span>
            </Link>

            <Link
              href="/playground"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-muted hover:bg-surface-highlight text-zinc-200 border border-surface-border font-semibold text-xs transition"
            >
              <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Open Global Playground</span>
            </Link>

            <a
              href={`${API_BASE_URL}/api/export/postman`}
              download="backend-first-principles.postman_collection.json"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-muted hover:bg-surface-highlight text-brand-amber border border-surface-border font-semibold text-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Postman Collection</span>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-100">1. Structured First-Principles Notes</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Short, clean explanations, tables, and concept breakdowns—no raw transcript dumps or jargon overload.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-100">2. Interactive 3D Visualizers</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Purposeful animations modeling the 6-hop request journey, CORS preflight handshakes, and ETag revalidation.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <Terminal className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-zinc-100">3. Live Working Endpoints</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            9 live Express endpoints you can actually hit from your browser, curl, or Postman with raw header and byte inspection.
          </p>
        </div>
      </section>

      {/* Lecture Catalog Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Curriculum & Seed Lectures</h2>
            <p className="text-xs text-zinc-400">Add future lecture JSON files to auto-expand this hub</p>
          </div>
          <span className="text-xs font-mono text-brand-cyan">
            {lectures.length} Lectures Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.map(lecture => (
            <Link
              key={lecture.slug}
              href={`/lectures/${lecture.slug}`}
              className="group p-5 rounded-2xl bg-surface border border-surface-border hover:border-brand-cyan/50 transition-all flex flex-col justify-between shadow-xl space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                    Lecture {lecture.lectureNumber}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {lecture.duration}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-100 group-hover:text-brand-cyan transition">
                  {lecture.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {lecture.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-500 font-mono">
                  {lecture.phaseTitle}
                </span>
                <span className="text-brand-cyan flex items-center gap-1 font-semibold group-hover:translate-x-1 transition">
                  <span>Open Notes & Lab</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
