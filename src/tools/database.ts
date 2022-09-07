import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  if (global.prisma) return global.prisma;
  global.prisma = new PrismaClient();
  return global.prisma;
}

export const prisma = createPrismaClient();
