import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
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

  return prisma.category.create({ data: { name, slug, icon } });
};

export const updateCategory = async (
  id: string,
  data: { name?: string; slug?: string; icon?: string },
) => {
  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: string) => {
  const hasProducts = await prisma.product.count({ where: { categoryId: id } });
  if (hasProducts > 0) {
    throw new AppError(
      'Tidak bisa menghapus kategori yang masih memiliki produk.',
      400,
    );
  }
  return prisma.category.delete({ where: { id } });
};
