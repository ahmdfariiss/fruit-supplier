import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errorHandler';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new AppError('Autentikasi diperlukan. Silakan login.', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Token tidak valid atau sudah kedaluwarsa.', 401));
  }
};
