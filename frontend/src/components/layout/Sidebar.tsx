'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, BookOpen, Terminal, Sparkles, Layers } from 'lucide-react';
import { Lecture } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';

interface SidebarProps {
  lectures: Lecture[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ lectures, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isCompleted, toggleComplete, getCompletionPercentage } = useProgress();

  // Group lectures by phase
  const phases = [
    { id: 1, title: 'Phase 1 — Story & Philosophy' },
    { id: 2, title: 'Phase 2 — HTTP Deep Dive' },
    { id: 3, title: 'Phase 3 — Production Projects' },
  ];

  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true
  });

  const togglePhase = (id: number) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const percentage = getCompletionPercentage(lectures.length);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-72 bg-surface/95 backdrop-blur-xl border-r border-surface-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Progress summary widget */}
        <div className="p-4 border-b border-surface-border">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Course Progress</span>
            <span className="text-brand-cyan font-mono font-bold">{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-surface-border">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan to-brand-emerald transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Phase Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {phases.map(phase => {
            const phaseLectures = lectures.filter(l => l.phase === phase.id);
            const isExpanded = expandedPhases[phase.id] !== false;

            return (
              <div key={phase.id} className="space-y-1">
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-zinc-100 hover:bg-surface-muted transition"
                >
                  <span className="truncate">{phase.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </button>

                {isExpanded && (
                  <div className="pl-1.5 space-y-0.5 mt-1">
                    {phaseLectures.length === 0 ? (
                      <div className="px-3 py-2 text-[11px] text-zinc-500 italic">
                        Upcoming lectures in progress...
                      </div>
                    ) : (
                      phaseLectures.map(lecture => {
                        const href = `/lectures/${lecture.slug}`;
                        const isActive = pathname === href;
                        const completed = isCompleted(lecture.slug);

                        return (
                          <div
                            key={lecture.slug}
                            className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition ${
                              isActive
                                ? 'bg-surface-highlight text-zinc-100 border border-brand-cyan/40 shadow-sm'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-muted'
                            }`}
                          >
                            <Link
                              href={href}
                              onClick={onClose}
                              className="flex-1 flex items-start gap-2 min-w-0"
                            >
                              <span className="font-mono text-[11px] text-zinc-500 shrink-0 mt-0.5">
                                {lecture.lectureNumber}
                              </span>
                              <span className={`truncate ${isActive ? 'font-semibold text-brand-cyan' : ''}`}>
                                {lecture.title}
                              </span>
                            </Link>

                            {/* Complete Checkbox Toggle */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleComplete(lecture.slug);
                              }}
                              className="p-1 text-zinc-500 hover:text-zinc-200 shrink-0"
                              title={completed ? "Mark incomplete" : "Mark completed"}
                            >
                              {completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                              )}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Quick Links */}
        <div className="p-3 border-t border-surface-border space-y-1 bg-surface-muted/30">
          <Link
            href="/playground"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-brand-cyan hover:bg-surface-muted transition"
          >
            <Terminal className="w-4 h-4 text-brand-cyan" />
            <span>Global Playground Hub</span>
          </Link>
          <Link
            href="/progress"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-brand-emerald hover:bg-surface-muted transition"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
            <span>Curriculum Checklist</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
