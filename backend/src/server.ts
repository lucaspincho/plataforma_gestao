import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';

// Importar rotas
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import clientRoutes from '@/routes/clients';
import processRoutes from '@/routes/processes';
import taskRoutes from '@/routes/tasks';
import audienceRoutes from '@/routes/audiences';
import deadlineRoutes from '@/routes/deadlines';
import movementRoutes from '@/routes/movements';
import dashboardRoutes from '@/routes/dashboard';

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15')) * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // máximo de 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.',
  },
});

// Middlewares globais
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/audiences', audienceRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middlewares de erro
app.use(notFoundHandler);
app.use(errorHandler);

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app; 