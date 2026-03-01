import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/order.service';
import { success, paginated } from '../helpers/response.helper';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await orderService.createOrder(req.user!.userId, req.body);
    success(res, order, 'Pesanan berhasil dibuat.', 201);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await orderService.getOrders(
      req.user!.userId,
      req.user!.role,
      req.query.status as string,
      req.query.page ? Number(req.query.page) : 1,
      req.query.limit ? Number(req.query.limit) : 10,
    );
    paginated(res, result.orders, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id as string,
      req.user!.userId,
      req.user!.role,
    );
    success(res, order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id as string,
      req.body.status,
    );
    success(res, order, 'Status pesanan berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: 'File bukti bayar wajib diupload.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const order = await orderService.uploadPaymentProof(
      req.params.id as string,
      req.user!.userId,
      fileUrl,
    );
    success(res, order, 'Bukti bayar berhasil diupload.');
  } catch (error) {
    next(error);
  }
};
