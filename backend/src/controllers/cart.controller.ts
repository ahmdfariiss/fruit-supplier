import { Request, Response, NextFunction } from 'express';
import * as cartService from '../services/cart.service';
import { success } from '../helpers/response.helper';

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cart = await cartService.getCart(req.user!.userId);
    success(res, cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await cartService.addToCart(
      req.user!.userId,
      req.body.productId,
      req.body.quantity,
    );
    success(res, item, 'Produk ditambahkan ke keranjang.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = await cartService.updateCartItem(
      req.params.itemId as string,
      req.user!.userId,
      req.body.quantity,
    );
    success(res, item, 'Keranjang diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await cartService.removeCartItem(
      req.params.itemId as string,
      req.user!.userId,
    );
    success(res, null, 'Item dihapus dari keranjang.');
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await cartService.clearCart(req.user!.userId);
    success(res, null, 'Keranjang dikosongkan.');
  } catch (error) {
    next(error);
  }
};
