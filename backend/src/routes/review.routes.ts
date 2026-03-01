import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.get('/latest', reviewController.getLatestReviews);
router.get('/product/:id', reviewController.getProductReviews);
router.post('/', authenticate, reviewController.createReview);

export default router;
