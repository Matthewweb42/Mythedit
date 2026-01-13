// TypeScript type definitions for MythEdit

export interface DevelopmentalFeedback {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  inlineHighlights: InlineHighlight[];
}

export interface InlineHighlight {
  start: number;
  end: number;
  type: 'pacing' | 'character' | 'plot' | 'structure' | 'style' | 'dialogue' | 'description';
  comment: string;
  severity?: 'minor' | 'moderate' | 'major';
}

export interface ChapterSummaryData {
  summary: string;
  keyPoints: string[];
  entities: {
    characters: string[];
    places: string[];
    events: string[];
  };
}

export interface ChapterContext {
  previousSummaries?: string[];
  genre?: string;
  bookNumber?: number;
  totalBooks?: number;
  chapterNumber?: number;
}

export interface ApiUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  costUsd: number;
}
