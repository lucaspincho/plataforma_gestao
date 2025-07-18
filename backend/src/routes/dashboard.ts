import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/config/database';

const router = Router();
router.use(requireAuth());

router.get('/', async (req, res, next) => {
  try {
    const [
      totalClients,
      totalProcesses,
      totalTasks,
      pendingTasks,
      activeProcesses,
    ] = await Promise.all([
      prisma.client.count({ where: { active: true } }),
      prisma.process.count({ where: { active: true } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: 'PENDENTE' } }),
      prisma.process.count({ where: { status: 'ATIVO' } }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalClients,
          totalProcesses,
          totalTasks,
          pendingTasks,
          activeProcesses,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router; 