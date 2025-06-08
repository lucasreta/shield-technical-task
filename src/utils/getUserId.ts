import { Request } from 'express';
import { UnauthorizedError } from './errors';

export function getUserId(req: Request): string {
  const userId = req.user?.userId;
  if (!userId) throw new UnauthorizedError();
  return userId;
}
