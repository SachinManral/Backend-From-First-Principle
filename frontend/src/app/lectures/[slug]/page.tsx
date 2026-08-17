import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLectureBySlug, getAllLectures } from '@/lib/lectures';
import ZoneTldr from '@/components/lectures/ZoneTldr';
import ZoneNotes from '@/components/lectures/ZoneNotes';
import ZoneVisualizer from '@/components/lectures/ZoneVisualizer';
import ZonePlayground from '@/components/lectures/ZonePlayground';
import BottomLectureNav from '@/components/lectures/BottomLectureNav';

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

      {/* Bottom Article Navigation with Auto-Complete on Next */}
      <BottomLectureNav
        currentSlug={lecture.slug}
        prevLecture={prevLecture}
        nextLecture={nextLecture}
      />
    </div>
  );
}
