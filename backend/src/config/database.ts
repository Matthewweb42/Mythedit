import { PrismaClient } from '@prisma/client';

// Create Prisma client singleton
// In Prisma 7, the engine type is configured in prisma.config.ts
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
