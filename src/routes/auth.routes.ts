import { Router } from 'express';
import { signIn, signUp, signOut } from '@controllers/auth.controller';
import { validate } from '@middleware/validate.middleware';
import { signInSchema, signUpSchema } from '@validators/auth.validator';
import { authenticate } from '@middleware/auth.middleware';

const router = Router();

router.post('/signin', validate(signInSchema), signIn);
router.post('/signup', validate(signUpSchema), signUp);
router.post('/signout', authenticate, signOut);

export default router;
