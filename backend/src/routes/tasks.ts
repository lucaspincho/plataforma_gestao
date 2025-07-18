import { Router } from 'express';
import { TaskController } from '@/controllers/taskController';
import { requireAuth } from '@/middleware/auth';

const router = Router();

router.use(requireAuth());

router.get('/', TaskController.getAll);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);

export default router; 