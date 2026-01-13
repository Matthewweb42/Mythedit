import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../config/database';

const projectsRoute: FastifyPluginAsync = async (fastify) => {
  /**
   * Create a new project
   * POST /api/projects
   */
  fastify.post('/', async (request, reply) => {
    try {
      const { name, description, genre, userId } = request.body as {
        name: string;
        description?: string;
        genre?: string;
        userId: string;
      };

      if (!name || !userId) {
        return reply.code(400).send({ error: 'name and userId are required' });
      }

      const project = await prisma.project.create({
        data: {
          userId,
          name,
          description,
          genre: genre || 'fantasy',
        },
      });

      return reply.code(201).send(project);
    } catch (error) {
      console.error('Create project error:', error);
      return reply.code(500).send({ error: 'Failed to create project' });
    }
  });

  /**
   * Get all projects for a user
   * GET /api/projects/user/:userId
   */
  fastify.get('/user/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };

    try {
      const projects = await prisma.project.findMany({
        where: { userId },
        include: {
          books: {
            orderBy: { number: 'asc' },
            include: {
              chapters: {
                orderBy: { number: 'asc' },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return projects;
    } catch (error) {
      console.error('Get projects error:', error);
      return reply.code(500).send({ error: 'Failed to get projects' });
    }
  });

  /**
   * Get a single project by ID
   * GET /api/projects/:id
   */
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          books: {
            orderBy: { number: 'asc' },
            include: {
              chapters: {
                orderBy: { number: 'asc' },
              },
            },
          },
        },
      });

      if (!project) {
        return reply.code(404).send({ error: 'Project not found' });
      }

      return project;
    } catch (error) {
      console.error('Get project error:', error);
      return reply.code(500).send({ error: 'Failed to get project' });
    }
  });

  /**
   * Update a project
   * PUT /api/projects/:id
   */
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, description, genre } = request.body as {
      name?: string;
      description?: string;
      genre?: string;
    };

    try {
      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(genre && { genre }),
        },
      });

      return project;
    } catch (error) {
      console.error('Update project error:', error);
      return reply.code(500).send({ error: 'Failed to update project' });
    }
  });

  /**
   * Delete a project
   * DELETE /api/projects/:id
   */
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.project.delete({
        where: { id },
      });

      return { message: 'Project deleted successfully' };
    } catch (error) {
      console.error('Delete project error:', error);
      return reply.code(500).send({ error: 'Failed to delete project' });
    }
  });
};

export default projectsRoute;
