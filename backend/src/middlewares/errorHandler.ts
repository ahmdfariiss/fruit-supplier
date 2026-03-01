import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
  }

  console.error('❌ Unhandled Error:', err);

  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message;

  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};
