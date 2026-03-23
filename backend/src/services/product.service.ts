import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import type {
  CreateProductInput,
  UpdateProductInput,
} from '../validators/product.validator';

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  buyerType?: 'consumer' | 'reseller';
  featured?: boolean;
  seasonMonth?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

export const getProducts = async (filters: ProductFilters) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    tags,
    buyerType = 'consumer',
    featured,
    seasonMonth,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = filters;

  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  if (category) {
    where.category = { slug: category };
  }

  const priceField =
    buyerType === 'reseller' ? 'priceReseller' : 'priceConsumer';
  if (minPrice !== undefined)
    where[priceField] = { ...where[priceField], gte: minPrice };
  if (maxPrice !== undefined)
    where[priceField] = { ...where[priceField], lte: maxPrice };

  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }

  if (featured !== undefined) {
    where.isFeatured = featured;
  }

  if (seasonMonth) {
    where.OR = [
      { seasonStart: null }, // Available all year
      {
        AND: [
          { seasonStart: { lte: seasonMonth } },
          { seasonEnd: { gte: seasonMonth } },
        ],
      },
    ];
  }

  const orderBy: any = {};
  switch (sort) {
    case 'price_asc':
      orderBy[priceField] = 'asc';
      break;
    case 'price_desc':
      orderBy[priceField] = 'desc';
      break;
    case 'popular':
      orderBy.reviews = { _count: 'desc' };
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const skip = (page - 1) * limit;

  const [products, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        categoryId: true,
        priceConsumer: true,
        priceReseller: true,
        minOrderReseller: true,
        stock: true,
        unit: true,
        imageUrl: true,
        images: true,
        isFeatured: true,
        seasonStart: true,
        seasonEnd: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true, slug: true, icon: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  const productsWithRating = products.map((p: any) => {
    const { _count, ...rest } = p;
    return {
      ...rest,
      avgRating: 0, // calculated per-product via aggregate on detail page
      reviewCount: _count.reviews,
    };
  });

  return {
    products: productsWithRating,
    pagination: { page, limit, totalItems, totalPages },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) {
    throw new AppError('Produk tidak ditemukan.', 404);
  }

  const ratings = product.reviews.map((r: any) => r.rating);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0;

  return {
    ...product,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: ratings.length,
  };
};

export const createProduct = async (
  input: CreateProductInput,
  imageUrl?: string,
) => {
  const slug = slugify(input.name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    throw new AppError('Produk dengan nama serupa sudah ada.', 409);
  }

  return prisma.product.create({
    data: {
      ...input,
      slug,
      priceConsumer: input.priceConsumer,
      priceReseller: input.priceReseller,
      imageUrl,
    },
    include: { category: true },
  });
};

export const updateProduct = async (
  id: string,
  input: UpdateProductInput,
  imageUrl?: string,
) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError('Produk tidak ditemukan.', 404);
  }

  const data: any = { ...input };
  if (input.name) {
    data.slug = slugify(input.name);
  }
  if (imageUrl) {
    data.imageUrl = imageUrl;
  }

  return prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AppError('Produk tidak ditemukan.', 404);
  }

  return prisma.product.delete({ where: { id } });
};

export const toggleFeatured = async (id: string, isFeatured: boolean) => {
  return prisma.product.update({
    where: { id },
    data: { isFeatured },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) {
    throw new AppError('Produk tidak ditemukan.', 404);
  }

  return product;
};
