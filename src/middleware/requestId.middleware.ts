import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function assignRequestId(req: Request, _res: Response, next: NextFunction) {
  req.id = uuidv4(); // 🔗 attach request ID to the req object
  next();
}
