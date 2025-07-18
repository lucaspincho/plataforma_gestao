import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: CustomError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro
  console.error('🚨 Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Erro do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res);
  }

  // Erro customizado
  const statusCode = (error as CustomError).statusCode || 500;
  const message = (error as CustomError).isOperational 
    ? error.message 
    : 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error.message,
      }),
    },
    timestamp: new Date().toISOString(),
  });
};

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (error.code) {
    case 'P2002':
      // Violação de constraint único
      const field = error.meta?.target as string[] | undefined;
      return res.status(409).json({
        success: false,
        error: {
          message: `Valor já existe para: ${field?.join(', ') || 'campo único'}`,
          code: 'DUPLICATE_ENTRY',
        },
      });

    case 'P2014':
      // Violação de relação
      return res.status(400).json({
        success: false,
        error: {
          message: 'Erro de relacionamento entre dados',
          code: 'RELATION_ERROR',
        },
      });

    case 'P2003':
      // Violação de foreign key
      return res.status(400).json({
        success: false,
        error: {
          message: 'Referência inválida a registro relacionado',
          code: 'FOREIGN_KEY_ERROR',
        },
      });

    case 'P2025':
      // Registro não encontrado
      return res.status(404).json({
        success: false,
        error: {
          message: 'Registro não encontrado',
          code: 'NOT_FOUND',
        },
      });

    default:
      return res.status(500).json({
        success: false,
        error: {
          message: 'Erro interno do banco de dados',
          code: 'DATABASE_ERROR',
        },
      });
  }
}; 