import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { success, paginated } from '../helpers/response.helper';

export const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await reviewService.getProductReviews(
      req.params.id as string,
      req.query.page ? Number(req.query.page) : 1,
      req.query.limit ? Number(req.query.limit) : 10,
    );
    paginated(res, result.reviews, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await reviewService.createReview(
      req.user!.userId,
      req.body.productId,
      req.body.orderId,
      req.body.rating,
      req.body.comment,
    );
    success(res, review, 'Review berhasil ditambahkan.', 201);
  } catch (error) {
    next(error);
  }
};

export const getLatestReviews = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviews = await reviewService.getLatestReviews();
    success(res, reviews);
  } catch (error) {
    next(error);
  }
};
