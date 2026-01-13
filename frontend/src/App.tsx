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
    <div className="flex h-screen bg-[#0a0e1a] overflow-hidden">
      {/* Sidebar */}
      <ProjectTree
        projects={projects}
        onSelectChapter={handleSelectChapter}
        selectedChapterId={selectedChapter?.id}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="glass-card border-b border-gray-800 px-8 py-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-1">
                MythEdit
              </h1>
              <p className="text-sm text-gray-400">AI Developmental Editor for Fiction Writers</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow"></div>
                <span className="text-sm text-gray-400">
                  Backend: <span className="text-emerald-400 font-medium">Connected</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center animate-fadeIn">
                <div className="spinner w-16 h-16 mx-auto mb-6"></div>
                <p className="text-gray-400 text-lg">Loading projects...</p>
              </div>
            </div>
          ) : selectedChapter ? (
            // Show feedback if chapter has been analyzed
            selectedChapter.editingFeedback && selectedChapter.editingFeedback.length > 0 ? (
              <div className="animate-fadeIn">
                <FeedbackDisplay
                  feedback={selectedChapter.editingFeedback[0]}
                  chapterContent={selectedChapter.content}
                />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto text-center py-16 animate-fadeIn">
                <div className="glass-card p-12">
                  <svg
                    className="mx-auto h-20 w-20 text-indigo-500 mb-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-100 mb-3">Chapter Selected</h3>
                  <p className="text-lg text-indigo-400 mb-2">{selectedChapter.title || `Chapter ${selectedChapter.number}`}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-6">
                    <span className="badge-info">{selectedChapter.wordCount} words</span>
                    <span className="badge-warning">Status: {selectedChapter.status}</span>
                  </div>
                  {selectedChapter.status === 'ANALYZING' && (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="spinner w-5 h-5"></div>
                      <p className="text-indigo-400 animate-pulse">Analysis in progress...</p>
                    </div>
                  )}
                  {selectedChapter.status === 'FAILED' && (
                    <div className="badge-error p-4">
                      <p className="font-medium">Analysis failed: {selectedChapter.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            // Show upload interface
            <div className="animate-fadeIn">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-5xl font-bold mb-6">
                  <span className="gradient-text">Welcome to MythEdit</span>
                </h2>
                <p className="text-xl text-gray-300 mb-3">
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
              <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card-hover p-8 animate-slideIn">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 glow-indigo">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Plot & Structure</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Get feedback on pacing, plot holes, story arc, and narrative flow
                  </p>
                </div>

                <div className="glass-card-hover p-8 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 glow-purple">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Character Development</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Analyze character motivation, dialogue, voice, and arc progression
                  </p>
                </div>

                <div className="glass-card-hover p-8 animate-slideIn" style={{ animationDelay: '0.2s' }}>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Series Continuity</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
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
