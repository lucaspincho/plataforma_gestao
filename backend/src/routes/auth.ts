import { Router } from 'express';
import { AuthController } from '@/controllers/authController';
import { requireAuth } from '@/middleware/auth';

const router = Router();

// Rotas públicas
router.post('/login', AuthController.login);

// Rotas protegidas
router.use(requireAuth()); // Todas as rotas abaixo requerem autenticação

router.get('/profile', AuthController.getProfile);
router.put('/password', AuthController.updatePassword);
router.get('/verify', AuthController.verifyToken);

// Rotas administrativas
router.post('/register', requireAuth('ADMIN'), AuthController.register);

export default router; 