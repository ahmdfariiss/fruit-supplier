import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/product.validator';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);

// Admin only
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(createProductSchema),
  productController.createProduct,
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(updateProductSchema),
  productController.updateProduct,
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  productController.deleteProduct,
);
router.patch(
  '/:id/featured',
  authenticate,
  authorize('ADMIN'),
  productController.toggleFeatured,
);

export default router;
