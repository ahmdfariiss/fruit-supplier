import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { cache, TTL } from '../helpers/cache';

export const getAllCategories = async () => {
  const cacheKey = 'categories:all';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  cache.set(cacheKey, result, TTL.LONG);
  return result;
};

export const createCategory = async (
  name: string,
  slug: string,
  icon?: string,
) => {
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    throw new AppError('Kategori dengan slug ini sudah ada.', 409);
  }

  const result = await prisma.category.create({ data: { name, slug, icon } });
  cache.invalidate('categories:all');
  return result;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; slug?: string; icon?: string },
) => {
  const result = await prisma.category.update({ where: { id }, data });
  cache.invalidate('categories:all');
  return result;
};

export const deleteCategory = async (id: string) => {
  const hasProducts = await prisma.product.count({ where: { categoryId: id } });
  if (hasProducts > 0) {
    throw new AppError(
      'Tidak bisa menghapus kategori yang masih memiliki produk.',
      400,
    );
  }
  const result = await prisma.category.delete({ where: { id } });
  cache.invalidate('categories:all');
  return result;
};
