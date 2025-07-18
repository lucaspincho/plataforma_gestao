import Joi from 'joi';

export const loginValidator = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório',
    }),
  password: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.min': 'Senha é obrigatória',
      'any.required': 'Senha é obrigatória',
    }),
});

export const registerValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Senha deve ter pelo menos 8 caracteres',
      'any.required': 'Senha é obrigatória',
    }),
  role: Joi.string()
    .valid('ADMIN', 'ADVOGADO', 'ASSISTENTE')
    .default('ASSISTENTE')
    .messages({
      'any.only': 'Role deve ser ADMIN, ADVOGADO ou ASSISTENTE',
    }),
});

export const updatePasswordValidator = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha atual é obrigatória',
    }),
  newPassword: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Nova senha deve ter pelo menos 8 caracteres',
      'any.required': 'Nova senha é obrigatória',
    }),
}); 