import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from '@/config/database';
import { PasswordUtils } from '@/utils/password';
import { loginValidator, registerValidator, updatePasswordValidator } from '@/validators/auth';
import { AuthenticatedRequest } from '@/middleware/auth';

export class AuthController {
  /**
   * Login do usuário
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = loginValidator.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Dados inválidos',
            details: error.details.map(detail => detail.message),
          },
        });
      }

      const { email, password } = value;

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          active: true,
        },
      });

      if (!user || !user.active) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Credenciais inválidas',
            code: 'INVALID_CREDENTIALS',
          },
        });
      }

      // Verificar senha
      const isPasswordValid = await PasswordUtils.verify(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Credenciais inválidas',
            code: 'INVALID_CREDENTIALS',
          },
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registro de novo usuário (apenas ADMIN pode criar)
   */
  static async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { error, value } = registerValidator.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Dados inválidos',
            details: error.details.map(detail => detail.message),
          },
        });
      }

      const { name, email, password, role } = value;

      // Validar força da senha
      const passwordValidation = PasswordUtils.validateStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Senha não atende aos requisitos de segurança',
            details: passwordValidation.errors,
          },
        });
      }

      // Verificar se email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Email já está em uso',
            code: 'EMAIL_ALREADY_EXISTS',
          },
        });
      }

      // Criar hash da senha
      const hashedPassword = await PasswordUtils.hash(password);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as UserRole,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        success: true,
        data: { user },
        message: 'Usuário criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obter perfil do usuário logado
   */
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Usuário não encontrado',
            code: 'USER_NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualizar senha
   */
  static async updatePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { error, value } = updatePasswordValidator.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Dados inválidos',
            details: error.details.map(detail => detail.message),
          },
        });
      }

      const { currentPassword, newPassword } = value;

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Usuário não encontrado',
            code: 'USER_NOT_FOUND',
          },
        });
      }

      // Verificar senha atual
      const isCurrentPasswordValid = await PasswordUtils.verify(currentPassword, user.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Senha atual incorreta',
            code: 'INVALID_CURRENT_PASSWORD',
          },
        });
      }

      // Validar nova senha
      const passwordValidation = PasswordUtils.validateStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Nova senha não atende aos requisitos de segurança',
            details: passwordValidation.errors,
          },
        });
      }

      // Atualizar senha
      const hashedNewPassword = await PasswordUtils.hash(newPassword);
      
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { password: hashedNewPassword },
      });

      res.json({
        success: true,
        message: 'Senha atualizada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verificar se token é válido
   */
  static async verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
          valid: true,
        },
      });
    } catch (error) {
      next(error);
    }
  }
} 