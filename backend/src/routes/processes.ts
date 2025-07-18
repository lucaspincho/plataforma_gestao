import { Router } from 'express';
import { ProcessController } from '@/controllers/processController';
import { requireAuth } from '@/middleware/auth';

const router = Router();

router.use(requireAuth());

router.get('/', ProcessController.getAll);
router.get('/:id', ProcessController.getById);
router.post('/', requireAuth('ADMIN', 'ADVOGADO'), ProcessController.create);
router.put('/:id', requireAuth('ADMIN', 'ADVOGADO'), ProcessController.update);
router.delete('/:id', requireAuth('ADMIN', 'ADVOGADO'), ProcessController.delete);

export default router; 