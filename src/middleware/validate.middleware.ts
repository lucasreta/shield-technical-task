import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // will throw ZodError if invalid
      next();
    } catch (err) {
      next(err);
    }
  };
