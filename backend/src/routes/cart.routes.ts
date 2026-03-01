import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.use(authenticate); // All cart routes require auth

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.patch('/:itemId', cartController.updateCartItem);
router.delete('/:itemId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;
