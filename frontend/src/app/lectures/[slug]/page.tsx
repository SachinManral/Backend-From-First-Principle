import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLectureBySlug, getAllLectures } from '@/lib/lectures';
import ZoneTldr from '@/components/lectures/ZoneTldr';
import ZoneNotes from '@/components/lectures/ZoneNotes';
import ZoneVisualizer from '@/components/lectures/ZoneVisualizer';
import ZonePlayground from '@/components/lectures/ZonePlayground';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

interface LecturePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const lectures = getAllLectures();
  return lectures.map(l => ({ slug: l.slug }));
}

export default function LecturePage({ params }: LecturePageProps) {
  const lecture = getLectureBySlug(params.slug);

  if (!lecture) {
    notFound();
  }

  const allLectures = getAllLectures();
  const currentIndex = allLectures.findIndex(l => l.slug === lecture.slug);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  return (
    <div className="space-y-10">
      {/* Zone 1: TL;DR & Title Header */}
      <ZoneTldr lecture={lecture} />

      {/* Zone 3: 3D / Interactive Concept Visualizer (if applicable) */}
      {lecture.visualizerType !== 'none' && (
        <ZoneVisualizer type={lecture.visualizerType} />
      )}

      {/* Zone 2: Structured Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-indigo" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400">
            Zone 2 — Structured Notes & Concepts
          </span>
        </div>
        <ZoneNotes lecture={lecture} />
      </div>

      {/* Zone 4: Practical Playground Panel */}
      {lecture.playgroundDemoIds && lecture.playgroundDemoIds.length > 0 && (
        <ZonePlayground demoIds={lecture.playgroundDemoIds} />
      )}

      {/* Footer Navigation (Prev / Next) */}
      <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLecture ? (
          <Link
            href={`/lectures/${prevLecture.slug}`}
            className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-surface-border hover:border-brand-cyan/40 text-xs font-semibold text-zinc-300 transition"
          >
            <ArrowLeft className="w-4 h-4 text-brand-cyan" />
            <div className="text-left">
              <div className="text-[10px] text-zinc-500 font-mono">Previous Lecture</div>
              <div className="truncate max-w-[200px]">{prevLecture.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextLecture ? (
          <Link
            href={`/lectures/${nextLecture.slug}`}
            className="w-full sm:w-auto flex items-center justify-end gap-2 px-4 py-2.5 rounded-xl bg-surface border border-surface-border hover:border-brand-cyan/40 text-xs font-semibold text-zinc-300 transition"
          >
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-mono">Next Lecture</div>
              <div className="truncate max-w-[200px]">{nextLecture.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-cyan" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
