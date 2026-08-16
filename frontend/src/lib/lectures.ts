import { Lecture } from './types';
import manifestData from '../../content/lectures/manifest.json';

/**
 * Get all lectures sorted by order
 */
export function getAllLectures(): Lecture[] {
  return ((manifestData.lectures as unknown) as Lecture[]).sort((a, b) => a.order - b.order);
}

/**
 * Get single lecture by slug
 */
export function getLectureBySlug(slug: string): Lecture | null {
  const all = getAllLectures();
  return all.find(l => l.slug === slug) || null;
}

/**
 * Group lectures by course Phase
 */
export function getLecturesByPhase(): Record<number, { phaseTitle: string; lectures: Lecture[] }> {
  const all = getAllLectures();
  const groups: Record<number, { phaseTitle: string; lectures: Lecture[] }> = {};

  all.forEach(lecture => {
    if (!groups[lecture.phase]) {
      groups[lecture.phase] = {
        phaseTitle: lecture.phaseTitle,
        lectures: []
      };
    }
    groups[lecture.phase].lectures.push(lecture);
  });

  return groups;
}
