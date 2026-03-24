import cors from 'cors';
import { env } from './env';

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '');

const envOrigins = env.CLIENT_URL.split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...envOrigins,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]),
);

export const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin) {
      callback(null, true);
      return;
    }

    const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
    const isAllowed = allowedOrigins.includes(normalizedRequestOrigin);

    callback(
      isAllowed ? null : new Error('Not allowed by CORS'),
      isAllowed ? normalizedRequestOrigin : false,
    );
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
