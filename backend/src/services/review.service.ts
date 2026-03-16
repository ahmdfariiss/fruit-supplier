import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [reviews, totalItems] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
      },
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const createReview = async (
  userId: string,
  productId: string,
  orderId: string,
  rating: number,
  comment?: string,
) => {
  // Validate order belongs to user and is DONE
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new AppError('Pesanan tidak ditemukan.', 404);
  }

  if (order.status !== 'DONE') {
    throw new AppError(
      'Review hanya bisa diberikan setelah pesanan selesai.',
      400,
    );
  }

  // Check if product was in the order
  const orderItem = order.items.find(
    (item: any) => item.productId === productId,
  );
  if (!orderItem) {
    throw new AppError('Produk ini tidak ada dalam pesanan tersebut.', 400);
  }

  // Check if already reviewed
  const existing = await prisma.review.findUnique({
    where: { userId_productId_orderId: { userId, productId, orderId } },
  });

  if (existing) {
    throw new AppError(
      'Anda sudah memberikan review untuk produk ini dari pesanan ini.',
      409,
    );
  }

  return prisma.review.create({
    data: { userId, productId, orderId, rating, comment },
    include: { user: { select: { id: true, name: true } } },
  });
};

export const getLatestReviews = async (limit = 6) => {
  return prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true, slug: true, imageUrl: true } },
    },
  });
};

export const getProductRatingSummary = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return { average: 0, total: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }

  const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const r of reviews) {
    sum += r.rating;
    breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
  }

  return {
    average: parseFloat((sum / reviews.length).toFixed(1)),
    total: reviews.length,
    breakdown,
  };
};

export const deleteReview = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) throw new AppError('Review tidak ditemukan.', 404);
  if (review.userId !== userId) throw new AppError('Tidak berhak menghapus review ini.', 403);

  return prisma.review.delete({ where: { id: reviewId } });
};