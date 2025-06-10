import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'] as const;

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`❌ Missing required env vars: ${missing.join(', ')}`);
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
	PORT: parseInt(process.env.PORT || '3000', 10),
};
