import { Response, NextFunction } from 'express';
import { prisma } from '@/config/database';
import { AuthenticatedRequest } from '@/middleware/auth';

export class TaskController {
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, assignedId, processId } = req.query;
      
      const where = {
        ...(status && { status: String(status) }),
        ...(assignedId && { assignedId: String(assignedId) }),
        ...(processId && { processId: String(processId) }),
      };

      const tasks = await prisma.task.findMany({
        where,
        include: {
          assigned: { select: { id: true, name: true } },
          createdBy: { select: { id: true, name: true } },
          process: { select: { id: true, number: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: { tasks } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { title, description, priority, dueDate, assignedId, processId } = req.body;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          assignedId,
          createdById: req.user!.id,
          processId,
        },
        include: {
          assigned: { select: { name: true } },
          process: { select: { number: true, title: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: { task },
        message: 'Tarefa criada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      
      if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
      }

      const task = await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          assigned: { select: { name: true } },
          process: { select: { number: true, title: true } },
        },
      });

      res.json({
        success: true,
        data: { task },
        message: 'Tarefa atualizada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
} 