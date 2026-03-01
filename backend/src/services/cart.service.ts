import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const getCart = async (userId: string) => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          priceConsumer: true,
          priceReseller: true,
          minOrderReseller: true,
          stock: true,
          unit: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Produk tidak ditemukan.', 404);
  }

  if (quantity > product.stock) {
    throw new AppError(
      `Stok tidak mencukupi. Tersisa ${product.stock} ${product.unit}.`,
      400,
    );
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      throw new AppError(
        `Stok tidak mencukupi. Tersisa ${product.stock} ${product.unit}.`,
        400,
      );
    }
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: { userId, productId, quantity },
    include: { product: true },
  });
};

export const updateCartItem = async (
  itemId: string,
  userId: string,
  quantity: number,
) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!cartItem || cartItem.userId !== userId) {
    throw new AppError('Item keranjang tidak ditemukan.', 404);
  }

  if (quantity > cartItem.product.stock) {
    throw new AppError(
      `Stok tidak mencukupi. Tersisa ${cartItem.product.stock} ${cartItem.product.unit}.`,
      400,
    );
  }

  if (quantity <= 0) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  });
};

export const removeCartItem = async (itemId: string, userId: string) => {
  const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!cartItem || cartItem.userId !== userId) {
    throw new AppError('Item keranjang tidak ditemukan.', 404);
  }
  return prisma.cartItem.delete({ where: { id: itemId } });
};

export const clearCart = async (userId: string) => {
  return prisma.cartItem.deleteMany({ where: { userId } });
};
