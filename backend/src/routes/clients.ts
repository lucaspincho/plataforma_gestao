import { Router } from 'express';
import { ClientController } from '@/controllers/clientController';
import { requireAuth } from '@/middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(requireAuth());

router.get('/', ClientController.getAll);
router.get('/:id', ClientController.getById);
router.post('/', requireAuth('ADMIN', 'ADVOGADO'), ClientController.create);
router.put('/:id', requireAuth('ADMIN', 'ADVOGADO'), ClientController.update);
router.delete('/:id', requireAuth('ADMIN', 'ADVOGADO'), ClientController.delete);

export default router; 