import type { EditingFeedback } from '../types';

interface FeedbackSidebarProps {
  feedback: EditingFeedback | null;
  isAnalyzing: boolean;
  onRequestAnalysis: (type: string) => void;
}

export function FeedbackSidebar({ feedback, isAnalyzing, onRequestAnalysis }: FeedbackSidebarProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'from-emerald-600/20 to-emerald-600/10';
    if (score >= 6) return 'from-yellow-600/20 to-yellow-600/10';
    return 'from-red-600/20 to-red-600/10';
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Quick Analysis Card */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Quick Analysis
        </h3>

        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-indigo-400 animate-pulse">Analyzing your chapter...</p>
          </div>
        ) : feedback ? (
          <div className="space-y-4">
            {/* Overall Score */}
            {feedback.overallScore && (
              <div className={`bg-gradient-to-br ${getScoreBgColor(feedback.overallScore)} rounded-lg p-4 border border-gray-700/50`}>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                    {feedback.overallScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">/ 10</div>
                </div>
              </div>
            )}

            {/* Top Strengths */}
            {feedback.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {feedback.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Top Issues */}
            {feedback.weaknesses.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {feedback.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inline Highlights Count */}
            {feedback.inlineHighlights.length > 0 && (
              <div className="pt-4 border-t border-gray-700/50">
                <p className="text-xs text-gray-400">
                  {feedback.inlineHighlights.length} inline {feedback.inlineHighlights.length === 1 ? 'comment' : 'comments'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No analysis yet</p>
            <p className="text-xs mt-2">Choose an analysis type below</p>
          </div>
        )}
      </div>

      {/* Analysis Action Buttons */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Choose Analysis Depth
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onRequestAnalysis('quick')}
            className="w-full btn-secondary text-left flex items-center justify-between group"
            disabled={isAnalyzing}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <div>
                <div className="text-sm font-medium text-gray-100">Quick Analysis</div>
                <div className="text-xs text-gray-400">~10s • Score + top issues • $0.005</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => onRequestAnalysis('balanced')}
            className="w-full btn-secondary text-left flex items-center justify-between group"
            disabled={isAnalyzing}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              <div>
                <div className="text-sm font-medium text-gray-100">Balanced</div>
                <div className="text-xs text-gray-400">~30s • Full feedback + highlights • $0.026</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => onRequestAnalysis('deep')}
            className="w-full btn-primary text-left flex items-center justify-between mt-4"
            disabled={isAnalyzing}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔍</span>
              <div>
                <div className="text-sm font-medium">Deep Dive</div>
                <div className="text-xs opacity-80">~60s • Comprehensive + rewrites • $0.10</div>
              </div>
            </div>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
