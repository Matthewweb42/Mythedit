import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../config/database';
import { WorkspaceType } from '@prisma/client';

const workspacesRoute: FastifyPluginAsync = async (fastify) => {
  /**
   * Get all workspaces for a user
   * GET /api/workspaces
   */
  fastify.get('/', async (request, reply) => {
    try {
      // TODO: Get userId from JWT token once auth is implemented
      // For now, use demo user
      const userId = 'demo-user-123';

      const workspaces = await prisma.workspace.findMany({
        where: { userId },
        include: {
          projects: {
            include: {
              books: {
                include: {
                  chapters: {
                    orderBy: { number: 'asc' },
                  },
                },
                orderBy: { number: 'asc' },
              },
            },
          },
          chapters: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return workspaces;
    } catch (error) {
      console.error('Get workspaces error:', error);
      return reply.code(500).send({ error: 'Failed to get workspaces' });
    }
  });

  /**
   * Get a single workspace by ID
   * GET /api/workspaces/:id
   */
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: {
          projects: {
            include: {
              books: {
                include: {
                  chapters: {
                    orderBy: { number: 'asc' },
                  },
                },
                orderBy: { number: 'asc' },
              },
            },
          },
          chapters: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!workspace) {
        return reply.code(404).send({ error: 'Workspace not found' });
      }

      return workspace;
    } catch (error) {
      console.error('Get workspace error:', error);
      return reply.code(500).send({ error: 'Failed to get workspace' });
    }
  });

  /**
   * Create a new workspace
   * POST /api/workspaces
   */
  fastify.post('/', async (request, reply) => {
    const body = request.body as {
      type: WorkspaceType;
      name: string;
    };

    try {
      // TODO: Get userId from JWT token once auth is implemented
      const userId = 'demo-user-123';

      // Validate workspace type
      if (!body.type || !Object.values(WorkspaceType).includes(body.type)) {
        return reply.code(400).send({
          error: 'Invalid workspace type. Must be FREE_EDIT or NOVEL',
        });
      }

      // Validate name
      if (!body.name || body.name.trim().length === 0) {
        return reply.code(400).send({ error: 'Workspace name is required' });
      }

      // Create workspace
      const workspace = await prisma.workspace.create({
        data: {
          userId,
          type: body.type,
          name: body.name.trim(),
        },
        include: {
          projects: true,
          chapters: true,
        },
      });

      return reply.code(201).send(workspace);
    } catch (error) {
      console.error('Create workspace error:', error);
      return reply.code(500).send({ error: 'Failed to create workspace' });
    }
  });

  /**
   * Update workspace name
   * PATCH /api/workspaces/:id
   */
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { name?: string };

    try {
      if (!body.name || body.name.trim().length === 0) {
        return reply.code(400).send({ error: 'Workspace name is required' });
      }

      const workspace = await prisma.workspace.update({
        where: { id },
        data: { name: body.name.trim() },
        include: {
          projects: true,
          chapters: true,
        },
      });

      return workspace;
    } catch (error) {
      console.error('Update workspace error:', error);
      return reply.code(500).send({ error: 'Failed to update workspace' });
    }
  });

  /**
   * Delete a workspace
   * DELETE /api/workspaces/:id
   */
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      // Check if workspace exists and get its type
      const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: {
          projects: {
            include: {
              books: {
                include: {
                  chapters: true,
                },
              },
            },
          },
          chapters: true,
        },
      });

      if (!workspace) {
        return reply.code(404).send({ error: 'Workspace not found' });
      }

      // Count total chapters that will be deleted
      let totalChapters = 0;
      if (workspace.type === WorkspaceType.NOVEL) {
        totalChapters = workspace.projects.reduce(
          (sum, project) =>
            sum +
            project.books.reduce(
              (bookSum, book) => bookSum + book.chapters.length,
              0
            ),
          0
        );
      } else {
        totalChapters = workspace.chapters.length;
      }

      // Delete workspace (cascades to projects/chapters)
      await prisma.workspace.delete({
        where: { id },
      });

      return {
        message: 'Workspace deleted successfully',
        deletedChapters: totalChapters,
      };
    } catch (error) {
      console.error('Delete workspace error:', error);
      return reply.code(500).send({ error: 'Failed to delete workspace' });
    }
  });

  /**
   * Create default "Free Edit" workspace for new users
   * This will be called during user registration
   */
  fastify.post('/create-default', async (request, reply) => {
    const body = request.body as { userId: string };

    try {
      if (!body.userId) {
        return reply.code(400).send({ error: 'userId is required' });
      }

      // Check if user already has a Free Edit workspace
      const existingWorkspace = await prisma.workspace.findFirst({
        where: {
          userId: body.userId,
          type: WorkspaceType.FREE_EDIT,
        },
      });

      if (existingWorkspace) {
        return existingWorkspace;
      }

      // Create default Free Edit workspace
      const workspace = await prisma.workspace.create({
        data: {
          userId: body.userId,
          type: WorkspaceType.FREE_EDIT,
          name: 'Practice Drafts',
        },
      });

      return reply.code(201).send(workspace);
    } catch (error) {
      console.error('Create default workspace error:', error);
      return reply.code(500).send({
        error: 'Failed to create default workspace',
      });
    }
  });
};

export default workspacesRoute;
