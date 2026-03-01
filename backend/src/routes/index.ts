import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import reviewRoutes from './review.routes';
import quizRoutes from './quiz.routes';
import voucherRoutes from './voucher.routes';
import bannerRoutes from './banner.routes';
import resellerMapRoutes from './resellerMap.routes';
import adminRoutes from './admin.routes';
import { generalLimiter } from '../middlewares/rateLimiter';

export const apiRouter = Router();

apiRouter.use(generalLimiter);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/quiz', quizRoutes);
apiRouter.use('/vouchers', voucherRoutes);
apiRouter.use('/banners', bannerRoutes);
apiRouter.use('/reseller-maps', resellerMapRoutes);
apiRouter.use('/admin', adminRoutes);
