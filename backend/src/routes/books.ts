import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../config/database';

const booksRoute: FastifyPluginAsync = async (fastify) => {
  /**
   * Create a new book
   * POST /api/books
   */
  fastify.post('/', async (request, reply) => {
    try {
      const { projectId, number, title } = request.body as {
        projectId: string;
        number: number;
        title: string;
      };

      if (!projectId || !number || !title) {
        return reply
          .code(400)
          .send({ error: 'projectId, number, and title are required' });
      }

      const book = await prisma.book.create({
        data: {
          projectId,
          number,
          title,
        },
      });

      return reply.code(201).send(book);
    } catch (error) {
      console.error('Create book error:', error);
      return reply.code(500).send({ error: 'Failed to create book' });
    }
  });

  /**
   * Get all books for a project
   * GET /api/books/project/:projectId
   */
  fastify.get('/project/:projectId', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };

    try {
      const books = await prisma.book.findMany({
        where: { projectId },
        include: {
          chapters: {
            orderBy: { number: 'asc' },
          },
        },
        orderBy: { number: 'asc' },
      });

      return books;
    } catch (error) {
      console.error('Get books error:', error);
      return reply.code(500).send({ error: 'Failed to get books' });
    }
  });

  /**
   * Get a single book by ID
   * GET /api/books/:id
   */
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          project: true,
          chapters: {
            orderBy: { number: 'asc' },
            include: {
              editingFeedback: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      });

      if (!book) {
        return reply.code(404).send({ error: 'Book not found' });
      }

      return book;
    } catch (error) {
      console.error('Get book error:', error);
      return reply.code(500).send({ error: 'Failed to get book' });
    }
  });

  /**
   * Update a book
   * PUT /api/books/:id
   */
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, number } = request.body as {
      title?: string;
      number?: number;
    };

    try {
      const book = await prisma.book.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(number && { number }),
        },
      });

      return book;
    } catch (error) {
      console.error('Update book error:', error);
      return reply.code(500).send({ error: 'Failed to update book' });
    }
  });

  /**
   * Delete a book
   * DELETE /api/books/:id
   */
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.book.delete({
        where: { id },
      });

      return { message: 'Book deleted successfully' };
    } catch (error) {
      console.error('Delete book error:', error);
      return reply.code(500).send({ error: 'Failed to delete book' });
    }
  });
};

export default booksRoute;
