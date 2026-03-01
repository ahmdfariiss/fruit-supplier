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
