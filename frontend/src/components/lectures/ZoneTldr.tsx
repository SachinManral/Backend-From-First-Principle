'use client';

import React from 'react';
import { Zap, Clock, Bookmark, Sparkles } from 'lucide-react';
import { Lecture } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';

interface ZoneTldrProps {
  lecture: Lecture;
}

export default function ZoneTldr({ lecture }: ZoneTldrProps) {
  const { isCompleted, toggleComplete } = useProgress();
  const completed = isCompleted(lecture.slug);

  return (
    <div className="qt-card p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Ambient glow highlight */}
      <div className="absolute -right-16 -top-16 w-56 h-56 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
            Lecture {lecture.lectureNumber}
          </span>
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-surface-muted text-zinc-300 border border-surface-border">
            {lecture.phaseTitle}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{lecture.duration}</span>
          </span>
        </div>

        <button
          onClick={() => toggleComplete(lecture.slug)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition border ${
            completed
              ? 'bg-brand-emerald/20 text-brand-emerald border-emerald-500/30'
              : 'bg-surface-muted hover:bg-surface-highlight text-zinc-300 border-surface-border hover:border-zinc-500'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${completed ? 'fill-brand-emerald' : ''}`} />
          <span>{completed ? 'Completed Module' : 'Mark Completed'}</span>
        </button>
      </div>

      <div className="mt-6 space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {lecture.title}
        </h1>
        <p className="text-sm md:text-base text-zinc-400 font-normal">
          {lecture.subtitle}
        </p>
      </div>

      {/* TL;DR Callout Banner (Zone 1) */}
      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-brand-cyan/10 via-brand-indigo/10 to-transparent border border-brand-cyan/25 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-brand-cyan/20 text-brand-cyan shrink-0 mt-0.5">
          <Zap className="w-4 h-4 fill-brand-cyan" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-brand-cyan font-mono">
            TL;DR — Core First Principle
          </div>
          <p className="text-xs md:text-sm font-medium text-zinc-200 mt-1.5 leading-relaxed">
            {lecture.tldr}
          </p>
        </div>
      </div>
    </div>
  );
}
