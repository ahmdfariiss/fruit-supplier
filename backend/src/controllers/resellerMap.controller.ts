import { Request, Response, NextFunction } from 'express';
import * as resellerMapService from '../services/resellerMap.service';
import { success } from '../helpers/response.helper';

export const getResellerMaps = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activeOnly = !req.user || req.user.role !== 'ADMIN';
    const maps = await resellerMapService.getResellerMaps(activeOnly);
    success(res, maps);
  } catch (error) {
    next(error);
  }
};

export const createResellerMap = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const map = await resellerMapService.createResellerMap(req.body);
    success(res, map, 'Toko reseller berhasil ditambahkan.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateResellerMap = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const map = await resellerMapService.updateResellerMap(
      req.params.id as string,
      req.body,
    );
    success(res, map, 'Toko reseller berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const deleteResellerMap = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await resellerMapService.deleteResellerMap(req.params.id as string);
    success(res, null, 'Toko reseller berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};
