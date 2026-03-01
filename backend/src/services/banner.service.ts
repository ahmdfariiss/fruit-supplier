import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const getBanners = async (activeOnly = false) => {
  const where = activeOnly ? { isActive: true } : {};
  return prisma.banner.findMany({
    where,
    orderBy: { orderIndex: 'asc' },
  });
};

export const createBanner = async (data: {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive?: boolean;
  orderIndex?: number;
}) => {
  return prisma.banner.create({ data });
};

export const updateBanner = async (
  id: string,
  data: {
    title?: string;
    imageUrl?: string;
    linkUrl?: string;
    isActive?: boolean;
    orderIndex?: number;
  },
) => {
  return prisma.banner.update({ where: { id }, data });
};

export const deleteBanner = async (id: string) => {
  return prisma.banner.delete({ where: { id } });
};

export const reorderBanners = async (orderedIds: string[]) => {
  const updates = orderedIds.map((id, index) =>
    prisma.banner.update({ where: { id }, data: { orderIndex: index } }),
  );
  return prisma.$transaction(updates);
};
