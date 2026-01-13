import { useState } from 'react';
import type { Project, Book, Chapter } from '../types';

interface ProjectTreeProps {
  projects: Project[];
  onSelectChapter: (chapterId: string) => void;
  selectedChapterId?: string;
}

export function ProjectTree({ projects, onSelectChapter, selectedChapterId }: ProjectTreeProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const toggleBook = (bookId: string) => {
    setExpandedBooks((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });
  };

  const getStatusBadge = (status: Chapter['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge-success">✓</span>;
      case 'FAILED':
        return <span className="badge-error">✗</span>;
      case 'ANALYZING':
      case 'PROCESSING':
        return <span className="badge-warning animate-pulse">⟳</span>;
      default:
        return <span className="badge bg-gray-700/50 text-gray-500">○</span>;
    }
  };

  return (
    <div className="w-80 sidebar h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-bold text-gray-100 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Projects
        </h2>
      </div>

      <div className="p-3">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-gray-500 mb-4 text-sm">No projects yet</p>
            <button className="btn-primary text-sm py-2 px-4">
              Create Project
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="animate-slideIn">
                {/* Project */}
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full flex items-center px-3 py-2.5 text-left hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                >
                  <svg
                    className={`w-4 h-4 mr-2 transition-transform text-gray-500 group-hover:text-gray-400 ${
                      expandedProjects.has(project.id) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span className="font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                    {project.name}
                  </span>
                </button>

                {/* Books */}
                {expandedProjects.has(project.id) && project.books && (
                  <div className="ml-6 space-y-1 mt-1">
                    {project.books.map((book) => (
                      <div key={book.id}>
                        <button
                          onClick={() => toggleBook(book.id)}
                          className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                        >
                          <svg
                            className={`w-3.5 h-3.5 mr-2 transition-transform text-gray-500 group-hover:text-gray-400 ${
                              expandedBooks.has(book.id) ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <span className="text-sm text-gray-300 truncate group-hover:text-white transition-colors">
                            Book {book.number}: {book.title}
                          </span>
                        </button>

                        {/* Chapters */}
                        {expandedBooks.has(book.id) && book.chapters && (
                          <div className="ml-6 space-y-1 mt-1">
                            {book.chapters.map((chapter) => (
                              <button
                                key={chapter.id}
                                onClick={() => onSelectChapter(chapter.id)}
                                className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                                  selectedChapterId === chapter.id
                                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                                    : 'hover:bg-gray-800/40 border border-transparent'
                                }`}
                              >
                                <span className="mr-2">
                                  {getStatusBadge(chapter.status)}
                                </span>
                                <span className={`text-sm truncate flex-1 ${
                                  selectedChapterId === chapter.id ? 'text-indigo-300 font-medium' : 'text-gray-400'
                                }`}>
                                  Ch {chapter.number}: {chapter.title || 'Untitled'}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                  {(chapter.wordCount / 1000).toFixed(1)}k
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
