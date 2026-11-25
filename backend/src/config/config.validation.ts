import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // ─── Database ──────────────────────────────────────────────
  DATABASE_URL: Joi.string().uri().required().messages({
    'string.uri': 'DATABASE_URL must be a valid PostgreSQL connection URI',
    'any.required': 'DATABASE_URL is required',
  }),

  // Redis enables shared rate-limit counters across API instances.
  REDIS_URL: Joi.string().uri().optional(),

  // ─── JWT ───────────────────────────────────────────────────
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'JWT_SECRET must be at least 32 characters',
    'any.required': 'JWT_SECRET is required',
  }),
  JWT_ACCESS_EXPIRY: Joi.string().default('60m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

  // ─── Server ────────────────────────────────────────────────
  PORT: Joi.number().port().default(4000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
  GEMINI_API_KEY: Joi.string().allow('').optional().default(''),
  GEMINI_API_TIMEOUT_MS: Joi.number()
    .integer()
    .min(1000)
    .max(60000)
    .default(45000),

  // ─── SMTP (optional) ──────────────────────────────────────
  SMTP_HOST: Joi.string().allow('').optional().default(''),
  SMTP_PORT: Joi.number().port().optional().default(587),
  SMTP_USER: Joi.string().allow('').optional().default(''),
  SMTP_PASS: Joi.string().allow('').optional().default(''),
});
