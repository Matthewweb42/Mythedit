import { useState } from 'react';
import type { EditingFeedback } from '../types';

interface FeedbackDisplayProps {
  feedback: EditingFeedback;
  chapterContent: string;
}

export function FeedbackDisplay({ feedback, chapterContent }: FeedbackDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'highlights'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const highlightTypeColors = {
    pacing: 'bg-blue-100 border-blue-500',
    character: 'bg-purple-100 border-purple-500',
    plot: 'bg-green-100 border-green-500',
    structure: 'bg-yellow-100 border-yellow-500',
    style: 'bg-pink-100 border-pink-500',
    dialogue: 'bg-indigo-100 border-indigo-500',
    description: 'bg-orange-100 border-orange-500',
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header with Score */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Developmental Feedback
            </h2>
            <p className="text-sm text-gray-500">
              Analysis completed • {feedback.tokensUsed?.toLocaleString()} tokens used
              {feedback.processingTime && ` • ${feedback.processingTime}s`}
            </p>
          </div>
          {feedback.overallScore && (
            <div className={`${getScoreBgColor(feedback.overallScore)} rounded-lg p-4 text-center min-w-[100px]`}>
              <div className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600 mt-1">/ 10</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'detailed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detailed Feedback
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'highlights'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Inline Highlights ({feedback.inlineHighlights.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Strengths */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {feedback.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Detailed Feedback Tab */}
          {activeTab === 'detailed' && (
            <div className="prose max-w-none">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: feedback.feedback.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          )}

          {/* Inline Highlights Tab */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              {feedback.inlineHighlights.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No inline highlights for this chapter</p>
              ) : (
                feedback.inlineHighlights.map((highlight, index) => {
                  const excerptStart = Math.max(0, highlight.start - 50);
                  const excerptEnd = Math.min(chapterContent.length, highlight.end + 50);
                  const excerpt = chapterContent.substring(excerptStart, excerptEnd);
                  const highlightedText = chapterContent.substring(highlight.start, highlight.end);

                  return (
                    <div
                      key={index}
                      className={`border-l-4 ${highlightTypeColors[highlight.type]} p-4 rounded-r-lg`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-white rounded capitalize">
                            {highlight.type}
                          </span>
                          {highlight.severity && (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                highlight.severity === 'major'
                                  ? 'bg-red-100 text-red-700'
                                  : highlight.severity === 'moderate'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {highlight.severity}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Position: {highlight.start}-{highlight.end}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 italic">
                        "...{excerpt}..."
                      </p>

                      <p className="text-sm text-gray-800 font-medium">
                        {highlight.comment}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
