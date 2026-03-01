import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import * as adminController from '../controllers/admin.controller';
import * as bannerController from '../controllers/banner.controller';
import * as voucherController from '../controllers/voucher.controller';
import * as resellerMapController from '../controllers/resellerMap.controller';
import * as productController from '../controllers/product.controller';
import * as orderController from '../controllers/order.controller';
import * as quizController from '../controllers/quiz.controller';
import { upload } from '../middlewares/upload';

const router = Router();

// All admin routes require auth + ADMIN role
router.use(authenticate, authorize('ADMIN'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Users
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id', adminController.toggleUserActive);
router.delete('/users/:id', adminController.deleteUser);

// Products (reuse product controllers)
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post(
  '/products',
  upload.single('image'),
  productController.createProduct,
);
router.put(
  '/products/:id',
  upload.single('image'),
  productController.updateProduct,
);
router.delete('/products/:id', productController.deleteProduct);

// Orders (reuse order controllers)
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// Banners — reorder BEFORE :id so it's not intercepted
router.get('/banners', bannerController.getBanners);
router.post('/banners', upload.single('image'), bannerController.createBanner);
router.put('/banners/reorder', bannerController.reorderBanners);
router.put(
  '/banners/:id',
  upload.single('image'),
  bannerController.updateBanner,
);
router.patch('/banners/:id', bannerController.toggleBannerActive);
router.delete('/banners/:id', bannerController.deleteBanner);

// Vouchers
router.get('/vouchers', voucherController.getVouchers);
router.post('/vouchers', voucherController.createVoucher);
router.put('/vouchers/:id', voucherController.updateVoucher);
router.delete('/vouchers/:id', voucherController.deleteVoucher);

// Quiz CRUD
router.get('/quiz', quizController.getQuestionsAdmin);
router.post('/quiz', quizController.createQuestion);
router.put('/quiz/:id', quizController.updateQuestion);
router.delete('/quiz/:id', quizController.deleteQuestion);

// Reseller Maps
router.get('/reseller-maps', resellerMapController.getResellerMaps);
router.post('/reseller-maps', resellerMapController.createResellerMap);
router.put('/reseller-maps/:id', resellerMapController.updateResellerMap);
router.delete('/reseller-maps/:id', resellerMapController.deleteResellerMap);

export default router;
