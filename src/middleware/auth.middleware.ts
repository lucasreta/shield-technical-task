import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@utils/errors';
import { isTokenBlacklisted } from '@services/auth.service';

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      throw new Error('Token has been revoked');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== 'object' || !decoded.userId) {
      throw new Error('Invalid token payload');
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch {
    throw new UnauthorizedError('Invalid token');
  }
}
