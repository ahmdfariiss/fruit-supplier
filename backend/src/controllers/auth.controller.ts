import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { success } from '../helpers/response.helper';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.registerUser(req.body);

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    success(res, result.user, 'Registrasi berhasil.', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    success(res, result.user, 'Login berhasil.');
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user) {
      await authService.logoutUser(req.user.userId);
    }

    res.clearCookie('accessToken', COOKIE_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);

    success(res, null, 'Logout berhasil.');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.getMe(req.user!.userId);
    success(res, user);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: 'Refresh token diperlukan.' });
    }

    const result = await authService.refreshTokens(token);

    res.cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    success(res, result.user, 'Token berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};
