import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { WorkspaceType } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '30d'; // 30 days
const MAGIC_LINK_EXPIRES_IN = '15m'; // 15 minutes

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify a password against a hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  /**
   * Generate magic link token (short-lived)
   */
  generateMagicLinkToken(email: string): string {
    return jwt.sign({ email, type: 'magic-link' }, JWT_SECRET, {
      expiresIn: MAGIC_LINK_EXPIRES_IN,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Verify magic link token
   */
  verifyMagicLinkToken(token: string): string {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        email: string;
        type: string;
      };
      if (decoded.type !== 'magic-link') {
        throw new Error('Invalid token type');
      }
      return decoded.email;
    } catch (error) {
      throw new Error('Invalid or expired magic link');
    }
  }

  /**
   * Register a new user with email/password
   */
  async register(
    email: string,
    password: string,
    name?: string
  ): Promise<{ user: any; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    // Create default Free Edit workspace
    await prisma.workspace.create({
      data: {
        userId: user.id,
        type: WorkspaceType.FREE_EDIT,
        name: 'Practice Drafts',
      },
    });

    // Generate tokens
    const tokens = {
      accessToken: this.generateAccessToken({
        userId: user.id,
        email: user.email,
      }),
    };

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Login with email/password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: any; tokens: AuthTokens }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = {
      accessToken: this.generateAccessToken({
        userId: user.id,
        email: user.email,
      }),
    };

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Request magic link (passwordless login)
   * Returns the token that should be sent via email
   */
  async requestMagicLink(email: string): Promise<string> {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create them (auto-signup via magic link)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: null, // Passwordless user
        },
      });

      // Create default Free Edit workspace
      await prisma.workspace.create({
        data: {
          userId: user.id,
          type: WorkspaceType.FREE_EDIT,
          name: 'Practice Drafts',
        },
      });
    }

    // Generate magic link token
    const token = this.generateMagicLinkToken(email);

    return token;
  }

  /**
   * Login with magic link token
   */
  async loginWithMagicLink(
    token: string
  ): Promise<{ user: any; tokens: AuthTokens }> {
    // Verify magic link token
    const email = this.verifyMagicLinkToken(token);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate access token
    const tokens = {
      accessToken: this.generateAccessToken({
        userId: user.id,
        email: user.email,
      }),
    };

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        workspaces: {
          include: {
            projects: {
              include: {
                books: true,
              },
            },
            chapters: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

export const authService = new AuthService();
