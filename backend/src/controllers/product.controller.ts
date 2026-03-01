import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { success, paginated } from '../helpers/response.helper';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await productService.getProducts({
      search: req.query.search as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      buyerType: req.query.buyerType as 'consumer' | 'reseller',
      featured: req.query.featured ? req.query.featured === 'true' : undefined,
      seasonMonth: req.query.seasonMonth
        ? Number(req.query.seasonMonth)
        : undefined,
      sort: req.query.sort as any,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 50) : 12,
    });

    paginated(res, result.products, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductBySlug(
      req.params.slug as string,
    );
    success(res, product);
  } catch (error) {
    next(error);
  }
};

// Coerce numeric fields when request comes via multipart/form-data
const coerceProductBody = (body: any) => {
  const coerced = { ...body };
  if (coerced.priceConsumer !== undefined)
    coerced.priceConsumer = Number(coerced.priceConsumer);
  if (coerced.priceReseller !== undefined)
    coerced.priceReseller = Number(coerced.priceReseller);
  if (coerced.minOrderReseller !== undefined)
    coerced.minOrderReseller = Number(coerced.minOrderReseller);
  if (coerced.stock !== undefined) coerced.stock = Number(coerced.stock);
  if (coerced.seasonStart !== undefined)
    coerced.seasonStart = coerced.seasonStart
      ? Number(coerced.seasonStart)
      : null;
  if (coerced.seasonEnd !== undefined)
    coerced.seasonEnd = coerced.seasonEnd ? Number(coerced.seasonEnd) : null;
  if (coerced.isFeatured !== undefined)
    coerced.isFeatured =
      coerced.isFeatured === 'true' || coerced.isFeatured === true;
  return coerced;
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = await productService.createProduct(
      coerceProductBody(req.body),
      imageUrl,
    );
    success(res, product, 'Produk berhasil ditambahkan.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = await productService.updateProduct(
      req.params.id as string,
      coerceProductBody(req.body),
      imageUrl,
    );
    success(res, product, 'Produk berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await productService.deleteProduct(req.params.id as string);
    success(res, null, 'Produk berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

export const toggleFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.toggleFeatured(
      req.params.id as string,
      req.body.isFeatured,
    );
    success(res, product, 'Status featured berhasil diubah.');
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductById(
      req.params.id as string,
    );
    success(res, product);
  } catch (error) {
    next(error);
  }
};
