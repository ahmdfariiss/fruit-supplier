import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 100,
  message: {
    success: false,
    error: 'Terlalu banyak request. Coba lagi nanti.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 30,
  message: {
    success: false,
    error: 'Terlalu banyak percobaan login. Coba lagi nanti.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
