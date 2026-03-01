import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';
import { success } from '../helpers/response.helper';

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();
    success(res, categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.createCategory(
      req.body.name,
      req.body.slug,
      req.body.icon,
    );
    success(res, category, 'Kategori berhasil ditambahkan.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id as string,
      req.body,
    );
    success(res, category, 'Kategori berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await categoryService.deleteCategory(req.params.id as string);
    success(res, null, 'Kategori berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};
