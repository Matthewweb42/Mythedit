import type { Chapter } from '../types';

interface ChapterViewProps {
  chapter: Chapter;
}

export function ChapterView({ chapter }: ChapterViewProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Chapter Header */}
      <div className="glass-card p-6 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-100">
            {chapter.title || `Chapter ${chapter.number}`}
          </h2>
          <div className="flex items-center space-x-3">
            <span className="badge-info">
              {(chapter.wordCount / 1000).toFixed(1)}k words
            </span>
            {chapter.status === 'COMPLETED' && (
              <span className="badge-success">✓ Analyzed</span>
            )}
            {chapter.status === 'ANALYZING' && (
              <span className="badge-warning animate-pulse">⟳ Analyzing</span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Uploaded {new Date(chapter.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Chapter Content */}
      <div className="flex-1 glass-card p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <pre
            className="text-gray-200 leading-relaxed text-base font-sans whitespace-pre-wrap"
            style={{
              lineHeight: '1.8',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              wordWrap: 'break-word',
            }}
          >
            {chapter.content}
          </pre>
        </div>
      </div>
    </div>
  );
}
