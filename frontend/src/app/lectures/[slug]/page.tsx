import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLectureBySlug, getAllLectures } from '@/lib/lectures';
import ZoneTldr from '@/components/lectures/ZoneTldr';
import ZoneNotes from '@/components/lectures/ZoneNotes';
import ZoneVisualizer from '@/components/lectures/ZoneVisualizer';
import ZonePlayground from '@/components/lectures/ZonePlayground';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
    <div className="space-y-10 pb-16">
      {/* Editorial Article Header */}
      <ZoneTldr lecture={lecture} />

      {/* Structured Article Notes & Examples */}
      <ZoneNotes lecture={lecture} />

      {/* Interactive Concept Visualizer Simulation */}
      {visType !== 'none' && (
        <div className="pt-2">
          <ZoneVisualizer type={visType} />
        </div>
      )}

      {/* Practical API Playground Lab */}
      {demoIds.length > 0 && (
        <ZonePlayground demoIds={demoIds} />
      )}

      {/* Bottom Article Navigation */}
      <div className="pt-8 border-t border-[#1e2640] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLecture ? (
          <Link
            href={`/lectures/${prevLecture.slug}`}
            className="w-full sm:w-auto p-4 rounded-2xl bg-[#0e1322] border border-[#1e2640] hover:border-brand-blue/40 flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-white group transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-brand-blue group-hover:-translate-x-1 transition" />
            <div className="text-left">
              <div className="text-[10px] text-zinc-500 font-mono">Previous Lesson</div>
              <div className="truncate max-w-[220px] font-bold text-white group-hover:text-brand-blue transition">{prevLecture.title}</div>
            </div>
          </Link>
        ) : <div />}

        {nextLecture ? (
          <Link
            href={`/lectures/${nextLecture.slug}`}
            className="w-full sm:w-auto p-4 rounded-2xl bg-[#0e1322] border border-[#1e2640] hover:border-brand-blue/40 flex items-center justify-end gap-3 text-xs font-semibold text-zinc-400 hover:text-white group transition shadow-sm"
          >
            <div className="text-right">
              <div className="text-[10px] text-zinc-500 font-mono">Next Lesson</div>
              <div className="truncate max-w-[220px] font-bold text-white group-hover:text-brand-blue transition">{nextLecture.title}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
