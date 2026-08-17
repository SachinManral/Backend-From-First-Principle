export type BlockType = 
  | 'paragraph'
  | 'code'
  | 'callout'
  | 'cards'
  | 'table'
  | 'checklist'
  | 'example'
  | 'points';

export type LectureBlock = 
  | { type: 'paragraph'; text: string }
  | { type: 'code'; code: string; language?: string; caption?: string; tabs?: Array<{ label: string; code: string; language?: string }> }
  | { type: 'callout'; variant: 'info' | 'warning' | 'success'; title: string; text: string }
  | { type: 'cards'; items: Array<{ title: string; desc: string; badge: string }> }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'checklist'; items: string[] }
  | { type: 'example'; title: string; input?: string; output?: string; explanation: string }
  | { type: 'points'; items: Array<{ number?: number | string; title: string; text: string; code?: string }> };

export interface LectureSection {
  id?: string;
  title: string;
  blocks: LectureBlock[];
}

export interface DemoEndpoint {
  id: string;
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'ANY';
  path: string;
  category: string;
  description: string;
  conceptNote?: string;
  purpose?: string;
  whyItMatters?: string;
  defaultHeaders?: Record<string, string>;
  defaultBody?: any;
  customControls?: Array<{
    type: 'select' | 'input' | 'toggle';
    label: string;
    key: string;
    options?: Array<{ label: string; value: string }>;
    defaultValue: string;
  }>;
  expectedBehavior?: string;
}

export type VisualizerType = '3d-mesh' | 'request-journey' | 'cors-preflight' | 'cache-validation' | 'none';

export interface VisualizerConfig {
  type: VisualizerType;
  title: string;
  description: string;
  badge?: string;
}

export interface Lecture {
  slug: string;
  lectureNumber: number | string;
  phase: number;
  phaseTitle: string;
  title: string;
  subtitle: string;
  duration: string;
  tags: string[];
  order: number;
  tldr: string;
  youtubeUrl?: string;
  sections: LectureSection[];
  selfCheckQuestions?: string[];
  keyTakeaways?: string[];
  reflectionQuestions?: string[];
  visualizer?: VisualizerConfig;
  visualizerType?: VisualizerType;
  playgroundDemoId?: string;
  playgroundDemoIds?: string[];
}
