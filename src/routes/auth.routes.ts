import { Router } from 'express';
import { signIn, signUp } from '@controllers/auth.controller';
import { validate } from '@middleware/validate.middleware';
import { signInSchema, signUpSchema } from '@validators/auth.validator';

const router = Router();

router.post('/', validate(signInSchema), signIn);
router.post('/signup', validate(signUpSchema), signUp);

export default router;
