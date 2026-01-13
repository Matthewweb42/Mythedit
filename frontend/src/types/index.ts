// Frontend TypeScript type definitions

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
  books?: Book[];
}

export interface Book {
  id: string;
  projectId: string;
  number: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  bookId: string;
  number: number;
  title?: string;
  content: string;
  wordCount: number;
  status: ChapterStatus;
  error?: string;
  uploadedAt: string;
  analyzedAt?: string;
  version: number;
  summary?: ChapterSummary;
  editingFeedback?: EditingFeedback[];
}

export type ChapterStatus = 'PENDING' | 'PROCESSING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface ChapterSummary {
  id: string;
  chapterId: string;
  summary: string;
  keyPoints: string[];
  entities: {
    characters: string[];
    places: string[];
    events: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface EditingFeedback {
  id: string;
  chapterId: string;
  type: EditingType;
  overallScore?: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  inlineHighlights: InlineHighlight[];
  tokensUsed?: number;
  processingTime?: number;
  createdAt: string;
}

export type EditingType = 'DEVELOPMENTAL' | 'COPY' | 'LINE' | 'PROOFREAD';

export interface InlineHighlight {
  start: number;
  end: number;
  type: 'pacing' | 'character' | 'plot' | 'structure' | 'style' | 'dialogue' | 'description';
  comment: string;
  severity?: 'minor' | 'moderate' | 'major';
}

export interface ChapterUploadProgress {
  status: 'idle' | 'uploading' | 'processing' | 'analyzing' | 'completed' | 'error';
  progress: number; // 0-100
  message: string;
  chapterId?: string;
}
