import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.code(401).send({ error: 'No authorization token provided' });
    }

    // Extract Bearer token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return reply.code(401).send({ error: 'Invalid authorization format' });
    }

    // Verify token
    const payload = authService.verifyToken(token);

    // Attach user to request
    request.user = {
      userId: payload.userId,
      email: payload.email,
    };

    // Continue to route handler
  } catch (error) {
    return reply.code(401).send({
      error: 'Invalid or expired token',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Optional auth middleware - doesn't fail if no token, but attaches user if present
 */
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return; // No token, continue without user
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return;
    }

    const payload = authService.verifyToken(token);

    request.user = {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    // Invalid token, but continue without user
    console.warn('Optional auth failed:', error);
  }
}
