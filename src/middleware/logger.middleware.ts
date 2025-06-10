import { Request, Response, NextFunction } from 'express';
import { log } from '@utils/logger';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const requestId = req.id!;
  log.trace(requestId, `Incoming request: ${req.method} ${req.url}`);
  next();
}
