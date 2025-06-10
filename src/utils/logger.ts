import { env } from '@config/environment';

const isTest = env.NODE_ENV === 'test';

function noop() {}

export const log = {
  info: isTest
    ? noop
    : (message: string, meta?: Record<string, unknown>) =>
        console.log(`[INFO] ${message}`, meta || ''),

  warn: isTest
    ? noop
    : (message: string, meta?: Record<string, unknown>) =>
        console.warn(`[WARN] ${message}`, meta || ''),

  error: isTest
    ? noop
    : (message: string, meta?: Record<string, unknown>) =>
        console.error(`[ERROR] ${message}`, meta || ''),

  trace: isTest
    ? noop
    : (requestId: string, message: string, meta?: Record<string, unknown>) =>
        console.log(`[TRACE] [${requestId}] ${message}`, meta || ''),
};
