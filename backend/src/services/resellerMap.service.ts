import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

export const getResellerMaps = async (activeOnly = false) => {
  const where = activeOnly ? { isActive: true } : {};
  return prisma.resellerMap.findMany({ where, orderBy: { createdAt: 'desc' } });
};

export const createResellerMap = async (data: {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}) => {
  return prisma.resellerMap.create({ data });
};

export const updateResellerMap = async (
  id: string,
  data: {
    name?: string;
    address?: string;
    lat?: number;
    lng?: number;
    phone?: string;
    isActive?: boolean;
  },
) => {
  return prisma.resellerMap.update({ where: { id }, data });
};

export const deleteResellerMap = async (id: string) => {
  return prisma.resellerMap.delete({ where: { id } });
};
