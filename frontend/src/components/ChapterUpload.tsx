import { useState, useCallback } from 'react';
import type { ChapterUploadProgress } from '../types';

interface ChapterUploadProps {
  bookId: string;
  chapterNumber: number;
  onUploadComplete: (chapterId: string) => void;
}

export function ChapterUpload({ bookId, chapterNumber, onUploadComplete }: ChapterUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ChapterUploadProgress>({
    status: 'idle',
    progress: 0,
    message: '',
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();

    // Check if there's text content
    const text = e.clipboardData.getData('text');
    if (text && text.trim().length > 0) {
      // Create a file from pasted text
      const blob = new Blob([text], { type: 'text/plain' });
      const file = new File([blob], `Chapter ${chapterNumber}.txt`, { type: 'text/plain' });
      uploadFile(file);
    }
  }, [chapterNumber]);

  const uploadFile = async (file: File) => {
    try {
      setUploadProgress({
        status: 'uploading',
        progress: 10,
        message: 'Uploading chapter...',
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookId', bookId);
      formData.append('chapterNumber', chapterNumber.toString());
      formData.append('title', `Chapter ${chapterNumber}`);

      const response = await fetch('http://localhost:3000/api/chapters/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Upload complete - show chapter immediately (no auto-analysis)
      setUploadProgress({
        status: 'completed',
        progress: 100,
        message: 'Chapter uploaded! Choose an analysis depth to begin.',
        chapterId: data.chapter.id,
      });

      // Call completion callback immediately
      onUploadComplete(data.chapter.id);
    } catch (error) {
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  };


  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file) {
        const validExtensions = ['.txt', '.docx', '.scriv', '.rtf', '.md'];
        const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (isValid) {
          uploadFile(file);
        } else {
          setUploadProgress({
            status: 'error',
            progress: 0,
            message: 'Please upload a .txt, .docx, .scriv, .rtf, or .md file',
          });
        }
      }
    },
    [bookId, chapterNumber]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [bookId, chapterNumber]
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        className={`
          drop-zone p-16 text-center transition-all
          ${isDragging ? 'drop-zone-active' : ''}
          ${uploadProgress.status !== 'idle' ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        `}
      >
        <input
          type="file"
          id="file-upload"
          accept=".txt,.docx,.scriv,.rtf,.md"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploadProgress.status !== 'idle'}
        />

        {uploadProgress.status === 'idle' ? (
          <>
            <svg
              className="mx-auto h-20 w-20 text-indigo-400 mb-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-2xl font-semibold text-gray-100 mb-3">
              Drop your chapter here or paste text
            </p>
            <p className="text-base text-gray-400 mb-6">
              or{' '}
              <label htmlFor="file-upload" className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors font-medium">
                browse files
              </label>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
              <span className="badge-info">.txt • .docx • .scriv</span>
              <span className="badge-info">.rtf • .md</span>
              <span className="badge bg-gray-800 text-gray-400">Max 10MB</span>
            </div>
            <div className="mt-4 text-xs text-gray-600 flex items-center justify-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-400">Ctrl/Cmd+V</kbd>
              <span>to paste text directly</span>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>

            {/* Status message */}
            <div className="flex items-center justify-center space-x-3">
              {uploadProgress.status === 'error' ? (
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : uploadProgress.status === 'completed' ? (
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="spinner w-6 h-6"></div>
              )}
              <p className={`text-base font-medium ${uploadProgress.status === 'error' ? 'text-red-400' : 'text-gray-100'}`}>
                {uploadProgress.message}
              </p>
            </div>

            {/* Retry button for errors */}
            {uploadProgress.status === 'error' && (
              <button
                onClick={() => setUploadProgress({ status: 'idle', progress: 0, message: '' })}
                className="btn-primary mt-4"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
