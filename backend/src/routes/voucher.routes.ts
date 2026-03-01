import { Router } from 'express';
import * as voucherController from '../controllers/voucher.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post('/validate', authenticate, voucherController.validateVoucher);

export default router;
