import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/order.validator';

const router = Router();

router.use(authenticate); // All order routes require auth

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.patch(
  '/:id/status',
  authorize('ADMIN'),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);
router.post(
  '/:id/payment-proof',
  upload.single('file'),
  orderController.uploadPaymentProof,
);
router.get('/:id/invoice', orderController.downloadInvoice);

export default router;
