import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Autentikasi diperlukan.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Anda tidak memiliki akses untuk resource ini.', 403),
      );
    }

    next();
  };
};
