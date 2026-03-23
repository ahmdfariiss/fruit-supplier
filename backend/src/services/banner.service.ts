import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { cache, TTL } from '../helpers/cache';

export const getBanners = async (activeOnly = false) => {
  const cacheKey = `banners:${activeOnly ? 'active' : 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const where = activeOnly ? { isActive: true } : {};
  const result = await prisma.banner.findMany({
    where,
    orderBy: { orderIndex: 'asc' },
  });

  cache.set(cacheKey, result, TTL.MEDIUM);
  return result;
};

export const createBanner = async (data: {
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive?: boolean;
  orderIndex?: number;
}) => {
  const result = await prisma.banner.create({ data });
  cache.invalidatePrefix('banners:');
  return result;
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
  const result = await prisma.banner.update({ where: { id }, data });
  cache.invalidatePrefix('banners:');
  return result;
};

export const deleteBanner = async (id: string) => {
  const result = await prisma.banner.delete({ where: { id } });
  cache.invalidatePrefix('banners:');
  return result;
};

export const reorderBanners = async (orderedIds: string[]) => {
  const updates = orderedIds.map((id, index) =>
    prisma.banner.update({ where: { id }, data: { orderIndex: index } }),
  );
  const result = await prisma.$transaction(updates);
  cache.invalidatePrefix('banners:');
  return result;
};
