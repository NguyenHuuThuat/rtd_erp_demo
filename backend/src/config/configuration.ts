import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET tối thiểu 16 ký tự'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET tối thiểu 16 ký tự'),
  JWT_ACCESS_TTL: z.string().regex(/^\d+[smhd]$/).default('15m'),
  JWT_REFRESH_TTL: z.string().regex(/^\d+[smhd]$/).default('7d'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_FROM: z.string().email().default('no-reply@rtd-erp.local'),
});

export type AppConfig = z.infer<typeof envSchema>;

export function validateEnv(rawEnv: Record<string, unknown>): AppConfig {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const formatted = JSON.stringify(result.error.format(), null, 2);
    throw new Error(`Lỗi cấu hình môi trường:\n${formatted}`);
  }
  return result.data;
}

export function configuration(): AppConfig {
  return validateEnv(process.env);
}
