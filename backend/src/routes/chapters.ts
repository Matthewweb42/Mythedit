import { FastifyPluginAsync } from 'fastify';
import multipart from '@fastify/multipart';
import mammoth from 'mammoth';
import { prisma } from '../config/database';
import { claudeService } from '../services/claude.service';
import { ChapterStatus, EditingType } from '@prisma/client';

const chaptersRoute: FastifyPluginAsync = async (fastify) => {
  // Register multipart for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  });

  /**
   * Upload and analyze a chapter
   * POST /api/chapters/upload
   */
  fastify.post('/upload', async (request, reply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      // Get metadata from fields
      const fields = data.fields as any;
      const bookId = fields.bookId?.value;
      const chapterNumber = parseInt(fields.chapterNumber?.value || '1');
      const chapterTitle = fields.title?.value;

      if (!bookId) {
        return reply.code(400).send({ error: 'bookId is required' });
      }

      // Parse file content based on type
      let content = '';
      const filename = data.filename;
      const mimeType = data.mimetype;

      if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
        // Plain text file
        const buffer = await data.toBuffer();
        content = buffer.toString('utf-8');
      } else if (
        mimeType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        filename.endsWith('.docx')
      ) {
        // .docx file - use mammoth to extract text
        const buffer = await data.toBuffer();
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;
      } else {
        return reply.code(400).send({
          error: 'Unsupported file type. Please upload .txt or .docx files.',
        });
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        return reply.code(400).send({ error: 'File is empty' });
      }

      // Calculate word count
      const wordCount = content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      // Create chapter in database
      const chapter = await prisma.chapter.create({
        data: {
          bookId,
          number: chapterNumber,
          title: chapterTitle || `Chapter ${chapterNumber}`,
          content,
          wordCount,
          status: ChapterStatus.PROCESSING,
        },
      });

      // Start analysis asynchronously (don't wait for it)
      analyzeChapterAsync(chapter.id, content, bookId).catch((error) => {
        console.error(`Failed to analyze chapter ${chapter.id}:`, error);
      });

      return reply.code(201).send({
        message: 'Chapter uploaded successfully',
        chapter: {
          id: chapter.id,
          number: chapter.number,
          title: chapter.title,
          wordCount: chapter.wordCount,
          status: chapter.status,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      return reply.code(500).send({
        error: 'Failed to upload chapter',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  /**
   * Get chapter by ID with feedback
   * GET /api/chapters/:id
   */
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const chapter = await prisma.chapter.findUnique({
        where: { id },
        include: {
          editingFeedback: {
            orderBy: { createdAt: 'desc' },
          },
          summary: true,
          book: {
            include: {
              project: true,
            },
          },
        },
      });

      if (!chapter) {
        return reply.code(404).send({ error: 'Chapter not found' });
      }

      return chapter;
    } catch (error) {
      console.error('Get chapter error:', error);
      return reply.code(500).send({ error: 'Failed to get chapter' });
    }
  });

  /**
   * Get all chapters for a book
   * GET /api/chapters/book/:bookId
   */
  fastify.get('/book/:bookId', async (request, reply) => {
    const { bookId } = request.params as { bookId: string };

    try {
      const chapters = await prisma.chapter.findMany({
        where: { bookId },
        orderBy: { number: 'asc' },
        include: {
          editingFeedback: {
            where: { type: EditingType.DEVELOPMENTAL },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      return chapters;
    } catch (error) {
      console.error('Get chapters error:', error);
      return reply.code(500).send({ error: 'Failed to get chapters' });
    }
  });

  /**
   * Delete a chapter
   * DELETE /api/chapters/:id
   */
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.chapter.delete({
        where: { id },
      });

      return { message: 'Chapter deleted successfully' };
    } catch (error) {
      console.error('Delete chapter error:', error);
      return reply.code(500).send({ error: 'Failed to delete chapter' });
    }
  });
};

/**
 * Analyze chapter asynchronously
 * This runs in the background after upload
 */
async function analyzeChapterAsync(
  chapterId: string,
  content: string,
  bookId: string
) {
  try {
    // Update status to analyzing
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { status: ChapterStatus.ANALYZING },
    });

    // Get book and project info for context
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        project: true,
        chapters: {
          where: {
            status: ChapterStatus.COMPLETED,
          },
          orderBy: { number: 'asc' },
          include: {
            summary: true,
          },
        },
      },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    // Get previous chapter summaries for context
    const previousSummaries = book.chapters
      .filter((ch) => ch.summary)
      .map((ch) => ch.summary!.summary);

    // Get current chapter number
    const currentChapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    // Analyze with Claude
    const { feedback, usage } = await claudeService.analyzeDevelopmental(
      content,
      {
        genre: book.project.genre,
        bookNumber: book.number,
        chapterNumber: currentChapter?.number,
        previousSummaries:
          previousSummaries.length > 0 ? previousSummaries : undefined,
      }
    );

    // Store feedback in database
    await prisma.editingFeedback.create({
      data: {
        chapterId,
        type: EditingType.DEVELOPMENTAL,
        overallScore: feedback.overallScore,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        feedback: feedback.feedback,
        inlineHighlights: feedback.inlineHighlights,
        tokensUsed: usage.totalTokens,
      },
    });

    // Generate summary for future context (use Haiku - cheaper)
    const { summary: summaryData, usage: summaryUsage } =
      await claudeService.generateSummary(
        content,
        currentChapter?.number || 1,
        book.project.genre
      );

    // Store summary
    await prisma.chapterSummary.create({
      data: {
        chapterId,
        summary: summaryData.summary,
        keyPoints: summaryData.keyPoints,
        entities: summaryData.entities,
      },
    });

    // Update chapter status to completed
    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        status: ChapterStatus.COMPLETED,
        analyzedAt: new Date(),
      },
    });

    console.log(`✅ Chapter ${chapterId} analyzed successfully`);
    console.log(`   Total cost: $${(usage.costUsd + summaryUsage.costUsd).toFixed(4)}`);
  } catch (error) {
    console.error(`❌ Failed to analyze chapter ${chapterId}:`, error);

    // Update chapter status to failed
    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        status: ChapterStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}

export default chaptersRoute;
