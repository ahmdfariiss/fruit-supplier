import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/admin.service';
import { success, paginated } from '../helpers/response.helper';

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await adminService.getDashboardStats();
    success(res, stats);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await adminService.getUsers(
      req.query.search as string,
      req.query.role as string,
      req.query.page ? Number(req.query.page) : 1,
      req.query.limit ? Number(req.query.limit) : 10,
    );
    paginated(res, result.users, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await adminService.updateUserRole(
      req.params.id as string,
      req.body.role,
    );
    success(res, user, 'Role user berhasil diubah.');
  } catch (error) {
    next(error);
  }
};

export const toggleUserActive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await adminService.toggleUserActive(
      req.params.id as string,
      req.body.isActive,
    );
    success(
      res,
      user,
      `User berhasil ${req.body.isActive ? 'diaktifkan' : 'dinonaktifkan'}.`,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await adminService.deleteUser(req.params.id as string);
    success(res, null, 'User berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};
