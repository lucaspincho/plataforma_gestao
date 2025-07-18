import { PrismaClient } from '@prisma/client';

// Singleton pattern para o cliente Prisma
class DatabaseService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'colorless',
      });
    }

    return DatabaseService.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseService.instance) {
      await DatabaseService.instance.$disconnect();
    }
  }
}

export const prisma = DatabaseService.getInstance();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await DatabaseService.disconnect();
});

process.on('SIGINT', async () => {
  await DatabaseService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await DatabaseService.disconnect();
  process.exit(0);
}); 