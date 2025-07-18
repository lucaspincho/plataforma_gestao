import { Router } from 'express';
import { requireAuth } from '@/middleware/auth';

const router = Router();
router.use(requireAuth());

router.get('/', (req, res) => res.json({ success: true, data: { movements: [] } }));
router.post('/', (req, res) => res.json({ success: true, message: 'Funcionalidade em desenvolvimento' }));

export default router; 