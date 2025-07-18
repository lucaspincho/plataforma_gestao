import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from '@/config/database';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token de acesso requerido',
          code: 'MISSING_TOKEN',
        },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    // Verificar se o usuário ainda existe e está ativo
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        active: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuário inválido ou inativo',
          code: 'INVALID_USER',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token inválido',
          code: 'INVALID_TOKEN',
        },
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expirado',
          code: 'EXPIRED_TOKEN',
        },
      });
    }

    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Usuário não autenticado',
          code: 'NOT_AUTHENTICATED',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Acesso negado. Permissões insuficientes',
          code: 'INSUFFICIENT_PERMISSIONS',
        },
      });
    }

    next();
  };
};

// Middleware combinado para autenticação + autorização
export const requireAuth = (...roles: UserRole[]) => {
  return [authenticate, ...(roles.length > 0 ? [authorize(...roles)] : [])];
};

// Exportar o tipo para usar em outros arquivos
export type { AuthenticatedRequest }; 