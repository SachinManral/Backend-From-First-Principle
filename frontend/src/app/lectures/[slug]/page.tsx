import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLectureBySlug, getAllLectures } from '@/lib/lectures';
import ZoneTldr from '@/components/lectures/ZoneTldr';
import ZoneNotes from '@/components/lectures/ZoneNotes';
import ZoneVisualizer from '@/components/lectures/ZoneVisualizer';
import ZonePlayground from '@/components/lectures/ZonePlayground';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

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

  const visType = lecture.visualizer?.type || lecture.visualizerType || 'none';
  const demoIds = (lecture as any).playgroundDemoIds || (lecture.playgroundDemoId ? [lecture.playgroundDemoId] : []);

  return (
    <div className="space-y-12 pb-12">
      {/* Zone 1: TL;DR & Title Header */}
      <ZoneTldr lecture={lecture} />

      {/* Zone 3: 3D / Interactive Concept Visualizer (if applicable) */}
      {visType !== 'none' && (
        <ZoneVisualizer type={visType} />
      )}

      {/* Zone 2: Structured Notes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-400">
            Zone 2 — Structured Notes & Concepts
          </span>
        </div>
        <ZoneNotes lecture={lecture} />
      </div>

      {/* Zone 4: Practical Playground Panel */}
      {demoIds.length > 0 && (
        <ZonePlayground demoIds={demoIds} />
      )}

      {/* Footer Navigation (Prev / Next) */}
      <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLecture ? (
          <Link
            href={`/lectures/${prevLecture.slug}`}
            className="qt-card w-full sm:w-auto p-4 flex items-center gap-3 text-xs font-semibold text-zinc-300 group"
          >
            <ArrowLeft className="w-4 h-4 text-brand-cyan group-hover:-translate-x-1 transition" />
            <div className="text-left">
              <div className="text-[10px] text-zinc-500 font-mono">Previous Lecture</div>
              <div className="truncate max-w-[220px] font-bold text-white group-hover:text-brand-cyan transition">{prevLecture.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextLecture ? (
          <Link
            href={`/lectures/${nextLecture.slug}`}
            className="qt-card w-full sm:w-auto p-4 flex items-center justify-end gap-3 text-xs font-semibold text-zinc-300 group"
          >
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-mono">Next Lecture</div>
              <div className="truncate max-w-[220px] font-bold text-white group-hover:text-brand-cyan transition">{nextLecture.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-cyan group-hover:translate-x-1 transition" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
