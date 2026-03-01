import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { generateOrderNumber } from '../helpers/orderNumber.helper';
import type { CreateOrderInput } from '../validators/order.validator';

export const createOrder = async (userId: string, input: CreateOrderInput) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new AppError('Keranjang kosong.', 400);
  }

  // Calculate prices based on buyerType
  let subtotal = 0;
  const orderItems = cartItems.map((item: any) => {
    let price: number;

    if (
      input.buyerType === 'RESELLER' &&
      item.quantity >= item.product.minOrderReseller
    ) {
      price = Number(item.product.priceReseller);
    } else {
      price = Number(item.product.priceConsumer);
    }

    const itemSubtotal = price * item.quantity;
    subtotal += itemSubtotal;

    return {
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.imageUrl,
      price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });

  // Validate stock
  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      throw new AppError(`Stok ${item.product.name} tidak mencukupi.`, 400);
    }
  }

  // Voucher validation
  let discountAmount = 0;
  if (input.voucherCode) {
    const voucher = await prisma.voucher.findUnique({
      where: { code: input.voucherCode },
    });

    if (!voucher) {
      throw new AppError('Kode voucher tidak valid.', 400);
    }

    if (!voucher.isActive) {
      throw new AppError('Voucher tidak aktif.', 400);
    }

    if (voucher.validUntil && voucher.validUntil < new Date()) {
      throw new AppError('Voucher sudah kedaluwarsa.', 400);
    }

    if (voucher.validFrom && voucher.validFrom > new Date()) {
      throw new AppError('Voucher belum berlaku.', 400);
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      throw new AppError('Voucher sudah mencapai batas penggunaan.', 400);
    }

    if (subtotal < Number(voucher.minPurchase)) {
      throw new AppError(
        `Minimum pembelian untuk voucher ini adalah Rp${voucher.minPurchase}.`,
        400,
      );
    }

    // Check if user already used this voucher
    const userVoucher = await prisma.userVoucher.findUnique({
      where: { userId_voucherId: { userId, voucherId: voucher.id } },
    });

    if (userVoucher) {
      throw new AppError('Anda sudah menggunakan voucher ini.', 400);
    }

    if (voucher.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(voucher.discountValue)) / 100;
      if (voucher.maxDiscount) {
        const maxDisc = Number(voucher.maxDiscount);
        if (discountAmount > maxDisc) {
          discountAmount = maxDisc;
        }
      }
    } else {
      discountAmount = Number(voucher.discountValue);
    }

    // Update voucher usage
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: { usedCount: { increment: 1 } },
    });

    // Record user voucher usage
    await prisma.userVoucher.create({
      data: { userId, voucherId: voucher.id, usedAt: new Date() },
    });
  }

  const total = subtotal - discountAmount;
  const orderNumber = await generateOrderNumber();

  // Create order with items
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      buyerType: input.buyerType,
      subtotal,
      discountAmount,
      total,
      voucherCode: input.voucherCode,
      shippingName: input.shippingName,
      shippingPhone: input.shippingPhone,
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: true,
    },
  });

  // Update stock
  for (const item of cartItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { userId } });

  return order;
};

export const getOrders = async (
  userId: string,
  role: string,
  status?: string,
  page = 1,
  limit = 10,
) => {
  const where: any = {};

  if (role !== 'ADMIN') {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        items: { include: { product: { select: { imageUrl: true } } } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const getOrderById = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!order) {
    throw new AppError('Pesanan tidak ditemukan.', 404);
  }

  if (role !== 'ADMIN' && order.userId !== userId) {
    throw new AppError('Anda tidak memiliki akses ke pesanan ini.', 403);
  }

  return order;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new AppError('Pesanan tidak ditemukan.', 404);
  }

  const data: any = { status };
  if (status === 'CONFIRMED') {
    data.paidAt = new Date();
  }

  return prisma.order.update({
    where: { id: orderId },
    data,
    include: { items: true },
  });
};

export const uploadPaymentProof = async (
  orderId: string,
  userId: string,
  fileUrl: string,
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError('Pesanan tidak ditemukan.', 404);
  }

  if (order.userId !== userId) {
    throw new AppError('Anda tidak memiliki akses ke pesanan ini.', 403);
  }

  if (order.status !== 'PENDING') {
    throw new AppError(
      'Bukti bayar hanya bisa diupload saat status PENDING.',
      400,
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { paymentProofUrl: fileUrl },
  });
};
