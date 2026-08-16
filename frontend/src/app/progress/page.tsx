'use client';

import React from 'react';
import Link from 'next/link';
import { getAllLectures } from '@/lib/lectures';
import { useProgress } from '@/context/ProgressContext';
import { CheckCircle2, Circle, RotateCcw, ArrowRight, BookOpen, Layers, Award } from 'lucide-react';

export default function ProgressPage() {
  const lectures = getAllLectures();
  const { completedSlugs, isCompleted, toggleComplete, getCompletionPercentage, resetProgress } = useProgress();

  const total = lectures.length;
  const completedCount = completedSlugs.length;
  const percentage = getCompletionPercentage(total);

  // Group lectures by phase
  const phases = [
    { id: 1, title: 'Phase 1 — Story & Philosophy', desc: 'Core language-agnostic mental models and reasons protocols exist' },
    { id: 2, title: 'Phase 2 — HTTP Deep Dive', desc: 'Protocol anatomy, CORS, caching, streaming, compression, and status codes' },
    { id: 3, title: 'Phase 3 — Production-Grade Projects', desc: 'Distributed systems, message queues, rate limiters, and scaling architectures' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Progress Header Card */}
      <div className="qt-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="qt-pill mb-3 text-brand-emerald">
              <Award className="w-3.5 h-3.5" />
              <span>Curriculum Tracker</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Course Progress & Mastery
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Check off lectures as you read notes and execute live practical endpoints.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset all progress to 0%?')) {
                resetProgress();
              }
            }}
            className="qt-btn-secondary text-xs py-2 px-4 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-3 pt-3 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Completed <span className="font-bold text-white font-mono">{completedCount}</span> of <span className="font-bold text-white font-mono">{total}</span> lectures
            </span>
            <span className="text-brand-emerald font-bold font-mono text-sm">{percentage}%</span>
          </div>

          <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-surface-border p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-emerald transition-all duration-500 rounded-full shadow-lg shadow-emerald-500/20"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist by Phase */}
      <div className="space-y-6">
        {phases.map(phase => {
          const phaseLectures = lectures.filter(l => l.phase === phase.id);
          const phaseCompleted = phaseLectures.filter(l => isCompleted(l.slug)).length;

          return (
            <div key={phase.id} className="qt-card p-6 md:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-surface-border">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{phase.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">{phase.desc}</p>
                </div>
                <div className="text-xs font-mono font-bold text-brand-cyan shrink-0 px-3 py-1 rounded-full bg-surface-muted border border-surface-border">
                  {phaseCompleted}/{phaseLectures.length} Completed
                </div>
              </div>

              <div className="space-y-3">
                {phaseLectures.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-surface-muted/50 border border-surface-border text-xs text-zinc-500 italic text-center">
                    Upcoming lectures in Phase 3 will appear here automatically.
                  </div>
                ) : (
                  phaseLectures.map(lecture => {
                    const completed = isCompleted(lecture.slug);

                    return (
                      <div
                        key={lecture.slug}
                        className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                          completed
                            ? 'bg-surface-muted/40 border-surface-border opacity-80 hover:opacity-100'
                            : 'bg-surface-muted border-surface-border hover:border-brand-cyan/30'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <button
                            onClick={() => toggleComplete(lecture.slug)}
                            className="text-zinc-500 hover:text-white transition shrink-0"
                            title={completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {completed ? (
                              <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <Link
                              href={`/lectures/${lecture.slug}`}
                              className="font-bold text-sm text-white hover:text-brand-cyan transition truncate block"
                            >
                              Lecture {lecture.lectureNumber}: {lecture.title}
                            </Link>
                            <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-2 mt-1">
                              <span>{lecture.duration}</span>
                              <span>•</span>
                              <span>{lecture.tags.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/lectures/${lecture.slug}`}
                          className="qt-btn-secondary text-xs py-1.5 px-3.5 shrink-0 hover:text-brand-cyan"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
