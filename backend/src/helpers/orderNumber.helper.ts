import { prisma } from '../config/database';

/**
 * Generate nomor invoice unik: INV-YYYYMMDD-XXXX
 * XXXX = nomor urut per hari
 */
export const generateOrderNumber = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const startOfDay = new Date(year, now.getMonth(), now.getDate());
  const endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);

  const countToday = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const sequence = String(countToday + 1).padStart(4, '0');
  return `INV-${dateStr}-${sequence}`;
};
