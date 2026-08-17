'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Lecture } from '@/lib/types';
import { useProgress } from '@/context/ProgressContext';

interface BottomLectureNavProps {
  currentSlug: string;
  prevLecture: Lecture | null;
  nextLecture: Lecture | null;
}

export default function BottomLectureNav({
  currentSlug,
  prevLecture,
  nextLecture
}: BottomLectureNavProps) {
  const { markComplete } = useProgress();

  const handleNextClick = () => {
    // Automatically mark the finished lecture as complete upon moving forward
    markComplete(currentSlug);
  };

  return (
    <div className="pt-8 border-t border-[#1e2640] flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Previous Lesson Button */}
      {prevLecture ? (
        <Link
          href={`/lectures/${prevLecture.slug}`}
          className="w-full sm:w-auto p-4 rounded-2xl bg-[#0e1322] border border-[#1e2640] hover:border-brand-blue/40 flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-white group transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-blue group-hover:-translate-x-1 transition shrink-0" />
          <div className="text-left">
            <div className="text-[10px] text-zinc-500 font-mono">Previous Lesson</div>
            <div className="truncate max-w-[200px] sm:max-w-[240px] font-bold text-white group-hover:text-brand-blue transition">
              {prevLecture.title}
            </div>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next Lesson Button (Auto-completes current lecture) */}
      {nextLecture ? (
        <Link
          href={`/lectures/${nextLecture.slug}`}
          onClick={handleNextClick}
          className="w-full sm:w-auto p-4 rounded-2xl bg-gradient-to-r from-[#0e1322] to-[#12192e] border border-brand-blue/30 hover:border-brand-blue flex items-center justify-between sm:justify-end gap-3 text-xs font-semibold text-zinc-300 hover:text-white group transition shadow-md shadow-brand-blue/10 cursor-pointer"
        >
          <div className="text-left sm:text-right">
            <div className="text-[10px] text-brand-blue font-mono">Next Lesson</div>
            <div className="truncate max-w-[200px] sm:max-w-[240px] font-bold text-white group-hover:text-cyan-300 transition">
              {nextLecture.title}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition shrink-0" />
        </Link>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Curriculum Completed!</span>
        </div>
      )}
    </div>
  );
}
