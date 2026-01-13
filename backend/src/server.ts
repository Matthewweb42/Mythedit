import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';
import projectsRoute from './routes/projects';
import booksRoute from './routes/books';
import chaptersRoute from './routes/chapters';

const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
async function start() {
  try {
    // CORS
    await server.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    });

    // Health check route
    server.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          postgres: 'connected',
          neo4j: 'pending',
          redis: 'pending',
        },
      };
    });

    // API routes
    server.get('/api/test', async (request, reply) => {
      return {
        message: 'MythEdit API is running!',
        version: '1.0.0',
      };
    });

    // Register route modules
    await server.register(projectsRoute, { prefix: '/api/projects' });
    await server.register(booksRoute, { prefix: '/api/books' });
    await server.register(chaptersRoute, { prefix: '/api/chapters' });

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = '0.0.0.0';

    await server.listen({ port, host });

    console.log(`
🚀 MythEdit Backend Server is running!

📍 Server URL: http://localhost:${port}
🏥 Health check: http://localhost:${port}/health
🧪 Test endpoint: http://localhost:${port}/api/test

Environment: ${process.env.NODE_ENV || 'development'}
    `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
