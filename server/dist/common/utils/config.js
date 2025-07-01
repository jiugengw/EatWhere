import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const jwtExpiresInSchema = z
    .string()
    .regex(/^\d+[smhdwy]$/, 'Must be in format like 90d, 1h, 10m')
    .default('90d')
    .transform((val) => val);
const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    DATABASE: z.string().regex(/^mongodb(?:\+srv)?:\/\/.+$/, {
        message: 'Must be a valid MongoDB connection URI',
    }),
    DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),
    PORT: z.string().optional().default('8080'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: jwtExpiresInSchema,
    JWT_COOKIE_EXPIRES_IN: z
        .string()
        .regex(/^\d+$/, 'Must be a number')
        .default('90'),
});
const result = envSchema.safeParse(process.env);
if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    process.exit(1);
}
export const config = result.data;
