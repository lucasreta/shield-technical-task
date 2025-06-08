import { Router } from 'express';
import * as controller from '@controllers/wallet.controller';
import { authenticate } from '@middleware/auth.middleware';
import { validate } from '@middleware/validate.middleware';
import { walletSchema } from '@validators/wallet.validator';

const router = Router();
router.use(authenticate);

router.get('/', controller.getWallets);
router.post('/', validate(walletSchema), controller.createWallet);
router.get('/:id', controller.getWalletById);
router.put('/:id', validate(walletSchema), controller.updateWallet);
router.delete('/:id', controller.deleteWallet);

export default router;
