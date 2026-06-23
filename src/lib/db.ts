import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Always cache — prevents connection exhaustion on serverless (production + development)
globalForPrisma.prisma = prisma;
