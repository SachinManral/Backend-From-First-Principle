export interface LectureBlockParagraph {
  type: 'paragraph';
  text: string;
}

export interface LectureBlockCode {
  type: 'code';
  language: string;
  code: string;
  caption?: string;
}

export interface LectureBlockCallout {
  type: 'callout';
  variant: 'info' | 'warning' | 'success' | 'danger';
  title: string;
  text: string;
}

export interface LectureBlockCardItem {
  badge: string;
  title: string;
  desc: string;
}

export interface LectureBlockCards {
  type: 'cards';
  items: LectureBlockCardItem[];
}

export interface LectureBlockTable {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export type LectureBlock = 
  | LectureBlockParagraph 
  | LectureBlockCode 
  | LectureBlockCallout 
  | LectureBlockCards 
  | LectureBlockTable;

export interface LectureSection {
  id: string;
  title: string;
  summary?: string;
  blocks: LectureBlock[];
}

export type VisualizerType = 'none' | 'request-journey' | 'cors-preflight' | 'caching-flow';

export interface Lecture {
  slug: string;
  order: number;
  phase: number;
  phaseTitle: string;
  lectureNumber: string;
  title: string;
  subtitle: string;
  duration: string;
  visualizerType: VisualizerType;
  playgroundDemoIds: string[];
  tldr: string;
  tags: string[];
  sections: LectureSection[];
  keyTakeaways?: string[];
  reflectionQuestions?: string[];
}

export interface DemoEndpoint {
  id: string;
  title: string;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'ANY';
  path: string;
  description: string;
  conceptNote: string;
  defaultHeaders?: Record<string, string>;
  defaultQuery?: Record<string, string>;
  defaultBody?: any;
  customControls?: {
    type: 'toggle' | 'select' | 'input';
    label: string;
    key: string;
    options?: { label: string; value: string }[];
    defaultValue: string;
  }[];
}
