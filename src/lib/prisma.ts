/**
 * Prisma Client — uses the prisma+postgres proxy URL.
 * The proxy (port 51213) handles the connection pooling and forwards to raw postgres (51214).
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Decode the raw postgres URL from the prisma+postgres API key
function getRawPostgresUrl(): string {
  const url = process.env.DATABASE_URL ?? '';
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return url;
  }
  // prisma+postgres://localhost:51213/?api_key=<base64>
  try {
    const apiKey = new URL(url).searchParams.get('api_key') ?? '';
    const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
    return decoded.databaseUrl as string;
  } catch {
    throw new Error(`Cannot decode DATABASE_URL: ${url.slice(0, 40)}...`);
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = getRawPostgresUrl();
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
