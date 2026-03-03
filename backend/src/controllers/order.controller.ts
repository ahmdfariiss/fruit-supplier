import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import * as orderService from '../services/order.service';
import { success, paginated } from '../helpers/response.helper';
import { prisma } from '../config/database';
import { generateInvoicePDF } from '../helpers/invoice.helper';

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

    // Fetch the order to get the orderNumber
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
    });

    if (!order) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: false, error: 'Pesanan tidak ditemukan.' });
    }

    // Validate: original filename (without extension) must match the orderNumber
    const originalName = path.parse(req.file.originalname).name;
    if (originalName !== order.orderNumber) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: `Nama file harus sesuai dengan kode pesanan: ${order.orderNumber}. Contoh: ${order.orderNumber}.jpg`,
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const updatedOrder = await orderService.uploadPaymentProof(
      req.params.id as string,
      req.user!.userId,
      fileUrl,
    );
    success(res, updatedOrder, 'Bukti bayar berhasil diupload.');
  } catch (error) {
    // Clean up uploaded file on unexpected error
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch { /* ignore */ }
    }
    next(error);
  }
};

export const downloadInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Pastikan user punya akses ke order ini
    const order = await orderService.getOrderById(
      req.params.id as string,
      req.user!.userId,
      req.user!.role,
    );

    const { filePath, fileName } = await generateInvoicePDF(order.id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Hapus file setelah selesai dikirim
    fileStream.on('end', () => {
      try { fs.unlinkSync(filePath); } catch { /* ignore */ }
    });
  } catch (error) {
    next(error);
  }
};
