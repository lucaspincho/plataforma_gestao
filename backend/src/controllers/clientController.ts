import { Response, NextFunction } from 'express';
import { prisma } from '@/config/database';
import { AuthenticatedRequest } from '@/middleware/auth';

export class ClientController {
  /**
   * Listar todos os clientes
   */
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = {
        active: true,
        ...(search && {
          OR: [
            { name: { contains: String(search), mode: 'insensitive' as const } },
            { email: { contains: String(search), mode: 'insensitive' as const } },
            { document: { contains: String(search) } },
          ],
        }),
      };

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { processes: true },
            },
          },
        }),
        prisma.client.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          clients,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar cliente por ID
   */
  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const client = await prisma.client.findFirst({
        where: { id, active: true },
        include: {
          processes: {
            select: {
              id: true,
              number: true,
              title: true,
              type: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Cliente não encontrado',
            code: 'CLIENT_NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        data: { client },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Criar novo cliente
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        phone,
        document,
        type = 'PESSOA_FISICA',
        address,
        city,
        state,
        zipCode,
        notes,
      } = req.body;

      if (!name || !document) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Nome e documento são obrigatórios',
            code: 'MISSING_REQUIRED_FIELDS',
          },
        });
      }

      const client = await prisma.client.create({
        data: {
          name,
          email,
          phone,
          document,
          type,
          address,
          city,
          state,
          zipCode,
          notes,
        },
      });

      res.status(201).json({
        success: true,
        data: { client },
        message: 'Cliente criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualizar cliente
   */
  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        document,
        type,
        address,
        city,
        state,
        zipCode,
        notes,
      } = req.body;

      const client = await prisma.client.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          document,
          type,
          address,
          city,
          state,
          zipCode,
          notes,
        },
      });

      res.json({
        success: true,
        data: { client },
        message: 'Cliente atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Excluir cliente (soft delete)
   */
  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.client.update({
        where: { id },
        data: { active: false },
      });

      res.json({
        success: true,
        message: 'Cliente excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
} 