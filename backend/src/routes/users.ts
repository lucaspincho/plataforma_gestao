import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';
import { prisma } from '@/config/database';

const router = Router();

router.use(requireAuth());

router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: { users } });
  } catch (error) {
    next(error);
  }
});

export default router; 