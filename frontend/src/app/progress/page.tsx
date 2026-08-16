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
    <div className="space-y-8">
      {/* Progress Header Card */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
              <Award className="w-3.5 h-3.5" />
              <span>Curriculum Tracker</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 mt-2">
              Course Progress & Roadmap
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Check off lectures as you read notes and execute live practical endpoints.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset all progress to 0%?')) {
                resetProgress();
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-muted hover:bg-surface-highlight text-zinc-400 hover:text-zinc-200 border border-surface-border text-xs transition self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-3 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              Completed <span className="font-bold text-zinc-200 font-mono">{completedCount}</span> of <span className="font-bold text-zinc-200 font-mono">{total}</span> lectures
            </span>
            <span className="text-brand-emerald font-bold font-mono text-sm">{percentage}%</span>
          </div>

          <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-surface-border">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-emerald transition-all duration-500 rounded-full"
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
            <div key={phase.id} className="bg-surface border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-zinc-100">{phase.title}</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{phase.desc}</p>
                </div>
                <div className="text-xs font-mono text-zinc-400 shrink-0">
                  {phaseCompleted}/{phaseLectures.length} Done
                </div>
              </div>

              <div className="space-y-2">
                {phaseLectures.length === 0 ? (
                  <div className="p-4 rounded-xl bg-surface-muted/50 border border-surface-border text-xs text-zinc-500 italic text-center">
                    Upcoming lectures in Phase 3 will appear here automatically.
                  </div>
                ) : (
                  phaseLectures.map(lecture => {
                    const completed = isCompleted(lecture.slug);

                    return (
                      <div
                        key={lecture.slug}
                        className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                          completed
                            ? 'bg-surface-muted/40 border-surface-border opacity-80 hover:opacity-100'
                            : 'bg-surface-muted border-surface-border hover:border-surface-highlight'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => toggleComplete(lecture.slug)}
                            className="text-zinc-500 hover:text-zinc-200 transition shrink-0"
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
                              className="font-bold text-xs md:text-sm text-zinc-200 hover:text-brand-cyan transition truncate block"
                            >
                              Lecture {lecture.lectureNumber}: {lecture.title}
                            </Link>
                            <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>{lecture.duration}</span>
                              <span>•</span>
                              <span>{lecture.tags.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/lectures/${lecture.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-highlight text-zinc-300 hover:text-brand-cyan text-xs font-semibold transition border border-surface-border shrink-0 flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
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
