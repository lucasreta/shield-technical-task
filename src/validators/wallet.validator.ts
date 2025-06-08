
import { z } from 'zod';

export const walletSchema = z.object({
  tag: z.string().optional(),
  chain: z.string().min(1),
  address: z.string().min(1),
});
