import { useState, useEffect } from 'react';
import { ChapterUpload } from './components/ChapterUpload';
import { ChapterView } from './components/ChapterView';
import { FeedbackSidebar } from './components/FeedbackSidebar';
import { ProjectTree } from './components/ProjectTree';
import { AuthPage } from './pages/AuthPage';
import { useAuth } from './contexts/AuthContext';
import type { Project, Chapter } from './types';

function App() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  const demoBookId = 'demo-book-123';

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProjects();
    }
  }, [isAuthenticated, user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3000/api/projects/user/${user.id}`);
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

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow"></div>
                  <span className="text-sm text-gray-400">
                    Backend: <span className="text-emerald-400 font-medium">Connected</span>
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="text-sm text-gray-400">
                  {user?.name || user?.email}
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Logout
                </button>
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
            // Two-panel layout: Chapter text (left) + Feedback sidebar (right)
            <div className="flex gap-4 h-full animate-fadeIn">
              {/* Left Panel: Chapter Text (60%) */}
              <div className="w-[60%]">
                <ChapterView chapter={selectedChapter} />
              </div>

              {/* Right Panel: Feedback Sidebar (40%) */}
              <div className="w-[40%]">
                <FeedbackSidebar
                  feedback={selectedChapter.editingFeedback?.[0] || null}
                  isAnalyzing={selectedChapter.status === 'ANALYZING'}
                  onRequestAnalysis={async (depth) => {
                    if (!selectedChapter) return;

                    try {
                      const response = await fetch(`http://localhost:3000/api/chapters/${selectedChapter.id}/analyze`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ depth }),
                      });

                      if (response.ok) {
                        // Update chapter status locally
                        setSelectedChapter({
                          ...selectedChapter,
                          status: 'ANALYZING',
                        });

                        // Poll for completion
                        const pollInterval = setInterval(async () => {
                          const chapterResponse = await fetch(`http://localhost:3000/api/chapters/${selectedChapter.id}`);
                          if (chapterResponse.ok) {
                            const updatedChapter = await chapterResponse.json();
                            if (updatedChapter.status === 'COMPLETED' || updatedChapter.status === 'FAILED') {
                              setSelectedChapter(updatedChapter);
                              clearInterval(pollInterval);
                            }
                          }
                        }, 2000);
                      }
                    } catch (error) {
                      console.error('Failed to start analysis:', error);
                    }
                  }}
                />
              </div>
            </div>
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
