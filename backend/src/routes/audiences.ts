import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';

const router = Router();
router.use(requireAuth());

// Rotas básicas para audiências (implementar controllers depois)
router.get('/', (req, res) => res.json({ success: true, data: { audiences: [] } }));
router.post('/', (req, res) => res.json({ success: true, message: 'Funcionalidade em desenvolvimento' }));

export default router; 