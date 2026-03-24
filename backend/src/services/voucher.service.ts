import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

const UNLIMITED_USAGE_LIMIT = 2147483647;

export const validateVoucher = async (
  code: string,
  orderTotal: number,
  userId?: string,
) => {
  const normalizedCode = code.trim().toUpperCase();
  const voucher = await prisma.voucher.findUnique({
    where: { code: normalizedCode },
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
    throw new AppError('Voucher sudah habis digunakan.', 400);
  }

  if (orderTotal < Number(voucher.minPurchase)) {
    throw new AppError(
      `Minimum pembelian Rp${voucher.minPurchase} untuk menggunakan voucher ini.`,
      400,
    );
  }

  if (userId) {
    const [pendingAssignmentCount, userVoucher] = await Promise.all([
      prisma.userVoucher.count({
        where: { voucherId: voucher.id, usedAt: null },
      }),
      prisma.userVoucher.findUnique({
        where: { userId_voucherId: { userId, voucherId: voucher.id } },
      }),
    ]);

    if (pendingAssignmentCount > 0 && !userVoucher) {
      throw new AppError('Voucher ini bukan milik akun kamu.', 400);
    }

    if (userVoucher?.usedAt) {
      throw new AppError('Voucher ini sudah pernah kamu gunakan.', 400);
    }
  }

  let discountAmount: number;
  if (voucher.discountType === 'PERCENTAGE') {
    discountAmount = (orderTotal * voucher.discountValue) / 100;
    if (voucher.maxDiscount) {
      discountAmount = Math.min(discountAmount, Number(voucher.maxDiscount));
    }
  } else {
    discountAmount = Math.min(orderTotal, voucher.discountValue);
  }

  return {
    valid: true,
    code: voucher.code,
    discountType: voucher.discountType,
    discountValue: voucher.discountValue,
    discountAmount,
  };
};

export const getVouchers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [vouchers, totalItems] = await Promise.all([
    prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.voucher.count(),
  ]);

  return {
    vouchers: vouchers.map((voucher) => ({
      ...voucher,
      usageLimit:
        voucher.usageLimit >= UNLIMITED_USAGE_LIMIT ? null : voucher.usageLimit,
    })),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const createVoucher = async (data: {
  code: string;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  type?: 'PERCENTAGE' | 'FIXED';
  value?: number;
  minPurchase?: number;
  minOrder?: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  validFrom?: string | Date;
  validUntil?: string | Date;
  expiresAt?: string | Date;
  isActive?: boolean;
}) => {
  const existing = await prisma.voucher.findUnique({
    where: { code: data.code },
  });
  if (existing) {
    throw new AppError('Kode voucher sudah ada.', 409);
  }

  const resolvedDiscountType = data.discountType || data.type || 'PERCENTAGE';
  const resolvedDiscountValue =
    data.discountValue ?? data.value ?? Number.NaN;
  const resolvedMinPurchase = data.minPurchase ?? data.minOrder ?? 0;
  const resolvedValidUntil = data.validUntil ?? data.expiresAt ?? null;
  const resolvedUsageLimit =
    data.usageLimit == null
      ? UNLIMITED_USAGE_LIMIT
      : Math.max(1, Math.floor(data.usageLimit));

  if (!Number.isFinite(resolvedDiscountValue) || resolvedDiscountValue <= 0) {
    throw new AppError('Nilai diskon voucher wajib diisi dan harus > 0.', 400);
  }

  return prisma.voucher.create({
    data: {
      code: data.code.toUpperCase(),
      discountType: resolvedDiscountType,
      discountValue: resolvedDiscountValue,
      minPurchase: resolvedMinPurchase,
      maxDiscount: data.maxDiscount ?? null,
      usageLimit: resolvedUsageLimit,
      validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
      validUntil: resolvedValidUntil ? new Date(resolvedValidUntil) : null,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateVoucher = async (
  id: string,
  data: {
    code?: string;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    type?: 'PERCENTAGE' | 'FIXED';
    value?: number;
    minPurchase?: number;
    minOrder?: number;
    maxDiscount?: number | null;
    usageLimit?: number | null;
    validFrom?: string | Date;
    validUntil?: string | Date;
    expiresAt?: string | Date;
    isActive?: boolean;
  },
) => {
  const voucher = await prisma.voucher.findUnique({ where: { id } });
  if (!voucher) {
    throw new AppError('Voucher tidak ditemukan.', 404);
  }

  const updateData: any = {
    ...data,
    discountType: data.discountType ?? data.type,
    discountValue: data.discountValue ?? data.value,
    minPurchase: data.minPurchase ?? data.minOrder,
    validUntil: data.validUntil ?? data.expiresAt,
  };

  delete updateData.type;
  delete updateData.value;
  delete updateData.minOrder;
  delete updateData.expiresAt;

  if (data.usageLimit !== undefined) {
    updateData.usageLimit =
      data.usageLimit == null
        ? UNLIMITED_USAGE_LIMIT
        : Math.max(1, Math.floor(data.usageLimit));
  }

  if (updateData.code) {
    updateData.code = String(updateData.code).toUpperCase();
  }

  if (updateData.validFrom)
    updateData.validFrom = new Date(updateData.validFrom);
  if (updateData.validUntil)
    updateData.validUntil = new Date(updateData.validUntil);

  return prisma.voucher.update({ where: { id }, data: updateData });
};

export const deleteVoucher = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    await tx.userVoucher.deleteMany({ where: { voucherId: id } });
    return tx.voucher.delete({ where: { id } });
  });
};
