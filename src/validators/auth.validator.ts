
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = signInSchema;

export const userSchema = signUpSchema.extend({
  id: z.string().uuid(),
});

