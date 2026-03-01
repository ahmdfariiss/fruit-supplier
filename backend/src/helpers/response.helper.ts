import { Response } from 'express';

export const success = (
  res: Response,
  data: unknown,
  message: string = 'OK',
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const error = (
  res: Response,
  message: string,
  statusCode: number = 400,
  details?: unknown,
) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    details,
  });
};

export const paginated = (
  res: Response,
  data: unknown[],
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  },
  message: string = 'OK',
) => {
  return res.status(200).json({
    success: true,
    data,
    pagination,
    message,
  });
};
