import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@utils/errors';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.format(),
    });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
  return;
}
