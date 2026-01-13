import { useState, useEffect } from 'react';
import { ChapterUpload } from './components/ChapterUpload';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { ProjectTree } from './components/ProjectTree';
import type { Project, Chapter } from './types';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes - in production this would come from auth
  const demoUserId = 'demo-user-123';
  const demoBookId = 'demo-book-123';

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/user/${demoUserId}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChapter = async (chapterId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/chapters/${chapterId}`);
      if (response.ok) {
        const chapter = await response.json();
        setSelectedChapter(chapter);
      }
    } catch (error) {
      console.error('Failed to load chapter:', error);
    }
  };

  const handleUploadComplete = (chapterId: string) => {
    // Reload projects to show new chapter
    loadProjects();
    // Select the newly uploaded chapter
    handleSelectChapter(chapterId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ProjectTree
        projects={projects}
        onSelectChapter={handleSelectChapter}
        selectedChapterId={selectedChapter?.id}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">MythEdit</h1>
              <p className="text-sm text-gray-500">AI Developmental Editor for Fiction Writers</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Backend: <span className="text-green-600 font-medium">Connected</span>
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-gray-600">Loading projects...</p>
              </div>
            </div>
          ) : selectedChapter ? (
            // Show feedback if chapter has been analyzed
            selectedChapter.editingFeedback && selectedChapter.editingFeedback.length > 0 ? (
              <FeedbackDisplay
                feedback={selectedChapter.editingFeedback[0]}
                chapterContent={selectedChapter.content}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Chapter Selected</h3>
                <p className="text-gray-600 mb-1">{selectedChapter.title || `Chapter ${selectedChapter.number}`}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedChapter.wordCount} words • Status: {selectedChapter.status}
                </p>
                {selectedChapter.status === 'ANALYZING' && (
                  <p className="text-blue-600 animate-pulse">Analysis in progress...</p>
                )}
                {selectedChapter.status === 'FAILED' && (
                  <p className="text-red-600">Analysis failed: {selectedChapter.error}</p>
                )}
              </div>
            )
          ) : (
            // Show upload interface
            <div>
              <div className="max-w-2xl mx-auto text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome to MythEdit
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  AI-powered developmental editing for your novel
                </p>
                <p className="text-sm text-gray-500">
                  Upload your chapter and get professional feedback in minutes
                </p>
              </div>

              <ChapterUpload
                bookId={demoBookId}
                chapterNumber={1}
                onUploadComplete={handleUploadComplete}
              />

              {/* Features */}
              <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Plot & Structure</h3>
                  <p className="text-sm text-gray-600">
                    Get feedback on pacing, plot holes, story arc, and narrative flow
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Character Development</h3>
                  <p className="text-sm text-gray-600">
                    Analyze character motivation, dialogue, voice, and arc progression
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Series Continuity</h3>
                  <p className="text-sm text-gray-600">
                    Track consistency across chapters and catch contradictions early
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
