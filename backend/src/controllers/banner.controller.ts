import { Request, Response, NextFunction } from 'express';
import * as bannerService from '../services/banner.service';
import { success } from '../helpers/response.helper';

export const getBanners = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activeOnly = req.query.active === 'true';
    const banners = await bannerService.getBanners(activeOnly);
    success(res, banners);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;
    const banner = await bannerService.createBanner({ ...req.body, imageUrl });
    success(res, banner, 'Banner berhasil ditambahkan.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = imageUrl ? { ...req.body, imageUrl } : req.body;
    const banner = await bannerService.updateBanner(
      req.params.id as string,
      data,
    );
    success(res, banner, 'Banner berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await bannerService.deleteBanner(req.params.id as string);
    success(res, null, 'Banner berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

export const reorderBanners = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await bannerService.reorderBanners(req.body.orderedIds);
    success(res, null, 'Urutan banner berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const toggleBannerActive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const banner = await bannerService.updateBanner(req.params.id as string, {
      isActive: req.body.isActive,
    });
    success(
      res,
      banner,
      `Banner berhasil ${req.body.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
    );
  } catch (error) {
    next(error);
  }
};
