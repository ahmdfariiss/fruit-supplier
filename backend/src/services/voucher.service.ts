import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const validateVoucher = async (code: string, orderTotal: number) => {
  const voucher = await prisma.voucher.findUnique({ where: { code } });

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

  let discountAmount: number;
  if (voucher.discountType === 'PERCENTAGE') {
    discountAmount = (orderTotal * voucher.discountValue) / 100;
    if (voucher.maxDiscount) {
      discountAmount = Math.min(discountAmount, Number(voucher.maxDiscount));
    }
  } else {
    discountAmount = voucher.discountValue;
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
    vouchers,
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
  minPurchase?: number;
  maxDiscount?: number | null;
  usageLimit?: number;
  validFrom?: string | Date;
  validUntil?: string | Date;
  isActive?: boolean;
}) => {
  const existing = await prisma.voucher.findUnique({
    where: { code: data.code },
  });
  if (existing) {
    throw new AppError('Kode voucher sudah ada.', 409);
  }

  return prisma.voucher.create({
    data: {
      code: data.code,
      discountType: data.discountType || 'PERCENTAGE',
      discountValue: data.discountValue,
      minPurchase: data.minPurchase || 0,
      maxDiscount: data.maxDiscount ?? null,
      usageLimit: data.usageLimit || 1,
      validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
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
    minPurchase?: number;
    maxDiscount?: number | null;
    usageLimit?: number;
    validFrom?: string | Date;
    validUntil?: string | Date;
    isActive?: boolean;
  },
) => {
  const voucher = await prisma.voucher.findUnique({ where: { id } });
  if (!voucher) {
    throw new AppError('Voucher tidak ditemukan.', 404);
  }

  const updateData: any = { ...data };
  if (data.validFrom) updateData.validFrom = new Date(data.validFrom);
  if (data.validUntil) updateData.validUntil = new Date(data.validUntil);

  return prisma.voucher.update({ where: { id }, data: updateData });
};

export const deleteVoucher = async (id: string) => {
  return prisma.voucher.delete({ where: { id } });
};
