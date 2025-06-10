import { Request, Response, NextFunction } from 'express';
import { signInService, signOutService, signUpService } from '@services/auth.service';
import { log } from '@utils/logger';

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    log.trace(req.id!, 'signInController called');
    const token = await signInService(req.body.email, req.body.password);
    res.json({ token });
  } catch (error) {
    log.error(req.id!, { error });
    next(error);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    log.trace(req.id!, 'signUpController called');
    const token = await signUpService(req.body.email, req.body.password);
    res.status(201).json({ token });
  } catch (error) {
    log.error(req.id!, { error });
    next(error);
  }
}

export async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    log.trace(req.id!, 'signOutController called');
    const token = req.headers.authorization!.split(' ')[1];
    await signOutService(token);
    res.status(200).json({ message: 'Successfully signed out' });
  } catch (error) {
    log.error(req.id!, { error });
    next(error);
  }
}
