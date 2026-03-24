import { Request, Response, NextFunction } from 'express';
import * as voucherService from '../services/voucher.service';
import { success, paginated } from '../helpers/response.helper';

export const validateVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await voucherService.validateVoucher(
      req.body.code,
      req.body.orderTotal,
      req.user?.userId,
    );
    success(res, result);
  } catch (error) {
    next(error);
  }
};

export const getVouchers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await voucherService.getVouchers(
      req.query.page ? Number(req.query.page) : 1,
      req.query.limit ? Number(req.query.limit) : 10,
    );
    paginated(res, result.vouchers, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const createVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const voucher = await voucherService.createVoucher(req.body);
    success(res, voucher, 'Voucher berhasil dibuat.', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await voucherService.deleteVoucher(req.params.id as string);
    success(res, null, 'Voucher berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

export const updateVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const voucher = await voucherService.updateVoucher(
      req.params.id as string,
      req.body,
    );
    success(res, voucher, 'Voucher berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};
