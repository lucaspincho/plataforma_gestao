import { Response, NextFunction } from 'express';
import { prisma } from '@/config/database';
import { AuthenticatedRequest } from '@/middleware/auth';

export class ProcessController {
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, status, type } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = {
        active: true,
        ...(search && {
          OR: [
            { number: { contains: String(search) } },
            { title: { contains: String(search), mode: 'insensitive' as const } },
            { client: { name: { contains: String(search), mode: 'insensitive' as const } } },
          ],
        }),
        ...(status && { status: String(status) }),
        ...(type && { type: String(type) }),
      };

      const [processes, total] = await Promise.all([
        prisma.process.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            client: { select: { id: true, name: true, document: true } },
            responsible: { select: { id: true, name: true } },
            _count: { select: { tasks: true, audiences: true, deadlines: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.process.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          processes,
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

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const process = await prisma.process.findFirst({
        where: { id, active: true },
        include: {
          client: true,
          responsible: { select: { id: true, name: true, email: true } },
          tasks: { include: { assigned: { select: { name: true } } } },
          audiences: { orderBy: { date: 'asc' } },
          deadlines: { orderBy: { date: 'asc' } },
          movements: { orderBy: { date: 'desc' } },
        },
      });

      if (!process) {
        return res.status(404).json({
          success: false,
          error: { message: 'Processo não encontrado' },
        });
      }

      res.json({ success: true, data: { process } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const {
        number,
        title,
        description,
        type,
        court,
        judge,
        opposingParty,
        value,
        startDate,
        clientId,
        responsibleId = req.user!.id,
      } = req.body;

      if (!number || !title || !type || !clientId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Número, título, tipo e cliente são obrigatórios' },
        });
      }

      const process = await prisma.process.create({
        data: {
          number,
          title,
          description,
          type,
          court,
          judge,
          opposingParty,
          value,
          startDate: startDate ? new Date(startDate) : null,
          clientId,
          responsibleId,
        },
        include: {
          client: { select: { name: true } },
          responsible: { select: { name: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: { process },
        message: 'Processo criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      const process = await prisma.process.update({
        where: { id },
        data: updateData,
        include: {
          client: { select: { name: true } },
          responsible: { select: { name: true } },
        },
      });

      res.json({
        success: true,
        data: { process },
        message: 'Processo atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.process.update({
        where: { id },
        data: { active: false },
      });

      res.json({
        success: true,
        message: 'Processo excluído com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
} 