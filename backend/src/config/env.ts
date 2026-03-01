import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  UPLOAD_DIR: z.string().default('./uploads'),
  BANK_NAME: z.string().default('BCA'),
  BANK_ACCOUNT_NUMBER: z.string().default('1234567890'),
  BANK_ACCOUNT_NAME: z.string().default('CV. Buah Segar'),
  QUIZ_VOUCHER_DISCOUNT: z.string().default('15').transform(Number),
  QUIZ_VOUCHER_EXPIRES_DAYS: z.string().default('30').transform(Number),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const env = parsed.data;
