import { FastifyPluginAsync } from 'fastify';
import { authService } from '../services/auth.service';
import { authenticateToken } from '../middleware/auth.middleware';

const authRoute: FastifyPluginAsync = async (fastify) => {
  /**
   * Register with email/password
   * POST /api/auth/register
   */
  fastify.post('/register', async (request, reply) => {
    const body = request.body as {
      email: string;
      password: string;
      name?: string;
    };

    try {
      // Validate input
      if (!body.email || !body.password) {
        return reply.code(400).send({
          error: 'Email and password are required',
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return reply.code(400).send({
          error: 'Invalid email format',
        });
      }

      // Validate password strength
      if (body.password.length < 8) {
        return reply.code(400).send({
          error: 'Password must be at least 8 characters long',
        });
      }

      // Register user
      const result = await authService.register(
        body.email,
        body.password,
        body.name
      );

      return reply.code(201).send({
        message: 'User registered successfully',
        user: result.user,
        accessToken: result.tokens.accessToken,
      });
    } catch (error) {
      console.error('Registration error:', error);
      return reply.code(400).send({
        error: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  });

  /**
   * Login with email/password
   * POST /api/auth/login
   */
  fastify.post('/login', async (request, reply) => {
    const body = request.body as {
      email: string;
      password: string;
    };

    try {
      // Validate input
      if (!body.email || !body.password) {
        return reply.code(400).send({
          error: 'Email and password are required',
        });
      }

      // Login user
      const result = await authService.login(body.email, body.password);

      return reply.send({
        message: 'Login successful',
        user: result.user,
        accessToken: result.tokens.accessToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      return reply.code(401).send({
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  });

  /**
   * Request magic link (passwordless login)
   * POST /api/auth/magic-link/request
   */
  fastify.post('/magic-link/request', async (request, reply) => {
    const body = request.body as { email: string };

    try {
      // Validate input
      if (!body.email) {
        return reply.code(400).send({
          error: 'Email is required',
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return reply.code(400).send({
          error: 'Invalid email format',
        });
      }

      // Generate magic link token
      const token = await authService.requestMagicLink(body.email);

      // TODO: Send email with magic link
      // For now, return the token (in production, this would be emailed)
      const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/magic-link?token=${token}`;

      console.log(`🔗 Magic link for ${body.email}:`);
      console.log(`   ${magicLink}`);
      console.log(`   Token expires in 15 minutes`);

      return reply.send({
        message:
          'Magic link sent! Check your email. (In development, check console)',
        // In production, don't return the token
        ...(process.env.NODE_ENV === 'development' && {
          magicLink,
          token,
        }),
      });
    } catch (error) {
      console.error('Magic link request error:', error);
      return reply.code(500).send({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate magic link',
      });
    }
  });

  /**
   * Login with magic link token
   * POST /api/auth/magic-link/verify
   */
  fastify.post('/magic-link/verify', async (request, reply) => {
    const body = request.body as { token: string };

    try {
      // Validate input
      if (!body.token) {
        return reply.code(400).send({
          error: 'Token is required',
        });
      }

      // Verify magic link and login
      const result = await authService.loginWithMagicLink(body.token);

      return reply.send({
        message: 'Login successful',
        user: result.user,
        accessToken: result.tokens.accessToken,
      });
    } catch (error) {
      console.error('Magic link verify error:', error);
      return reply.code(401).send({
        error:
          error instanceof Error
            ? error.message
            : 'Invalid or expired magic link',
      });
    }
  });

  /**
   * Get current user (requires authentication)
   * GET /api/auth/me
   */
  fastify.get(
    '/me',
    { preHandler: authenticateToken },
    async (request, reply) => {
      try {
        if (!request.user) {
          return reply.code(401).send({ error: 'Not authenticated' });
        }

        // Get full user data
        const user = await authService.getUserById(request.user.userId);

        return user;
      } catch (error) {
        console.error('Get user error:', error);
        return reply.code(500).send({
          error: error instanceof Error ? error.message : 'Failed to get user',
        });
      }
    }
  );

  /**
   * Logout (client-side token deletion)
   * POST /api/auth/logout
   */
  fastify.post(
    '/logout',
    { preHandler: authenticateToken },
    async (request, reply) => {
      // In JWT, logout is handled client-side by deleting the token
      // This endpoint exists for consistency and future refresh token invalidation

      return reply.send({
        message: 'Logout successful',
      });
    }
  );
};

export default authRoute;
