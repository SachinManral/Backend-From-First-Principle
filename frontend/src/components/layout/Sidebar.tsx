'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, BookOpen, Terminal, Sparkles, Layers, Award, X } from 'lucide-react';
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

  const sidebarContent = (
    <>
      {/* Progress summary widget */}
      <div className="p-4 border-b border-border bg-secondary/40">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-brand-blue" />
            <span>Curriculum Progress</span>
          </span>
          <span className="text-brand-blue font-mono font-bold">{percentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Phase Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-3">
        {phases.map(phase => {
          const phaseLectures = lectures.filter(l => l.phase === phase.id);
          const isExpanded = expandedPhases[phase.id] !== false;

          return (
            <div key={phase.id} className="space-y-1">
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-foreground hover:bg-secondary/70 transition cursor-pointer"
              >
                <span className="truncate">{phase.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="pl-1 space-y-1 mt-1">
                  {phaseLectures.length === 0 ? (
                    <div className="px-3 py-2 text-[11px] text-muted-foreground italic">
                      Upcoming modules in progress...
                    </div>
                  ) : (
                    phaseLectures.map(lecture => {
                      const href = `/lectures/${lecture.slug}`;
                      const isActive = pathname === href;
                      const completed = isCompleted(lecture.slug);

                      return (
                        <div
                          key={lecture.slug}
                          className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                            isActive
                              ? 'bg-secondary text-foreground font-medium border border-brand-blue/40 shadow-sm shadow-brand-blue/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                          }`}
                        >
                          <Link
                            href={href}
                            onClick={onClose}
                            className="flex-1 flex items-start gap-2 min-w-0"
                          >
                            <span className="font-mono text-[11px] text-muted-foreground shrink-0 mt-0.5">
                              {lecture.lectureNumber}
                            </span>
                            <span className={`truncate ${isActive ? 'font-semibold text-brand-blue' : ''}`}>
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
                            className="p-1 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                            title={completed ? "Mark incomplete" : "Mark completed"}
                          >
                            {completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-muted-foreground" />
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
      <div className="p-3 border-t border-border space-y-1 bg-secondary/30">
        <Link
          href="/playground"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-brand-blue hover:bg-secondary transition"
        >
          <Terminal className="w-4 h-4 text-brand-blue" />
          <span>Interactive Lab</span>
        </Link>
        <Link
          href="/progress"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-brand-emerald hover:bg-secondary transition"
        >
          <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
          <span>Mastery Checklist</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Drawer (Only shown on small screens when toggled) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <aside className="relative w-80 max-w-[85vw] h-full bg-card border-r border-border flex flex-col z-50 shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-bold text-sm text-foreground">Course Navigation</span>
              <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar (Non-overlapping Flex Sibling) */}
      <aside className="hidden md:flex flex-col sticky top-24 w-72 shrink-0 h-[calc(100vh-7.5rem)] bg-card/90 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-xl overflow-hidden">
        {sidebarContent}
      </aside>
    </>
  );
}
