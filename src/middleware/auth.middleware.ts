import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '@utils/errors';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AppError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== 'object' || !decoded.userId) {
      throw new AppError('Invalid token payload', 401);
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}
