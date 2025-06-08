import { Request, Response, NextFunction } from 'express';
import { signInService, signUpService } from '@services/auth.service';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await signInService(req.body.email, req.body.password);
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const token = await signUpService(req.body.email, req.body.password);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
}