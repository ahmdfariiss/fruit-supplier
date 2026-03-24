import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';

import { env } from './config/env';
import { corsOptions } from './config/cors';
import { errorHandler } from './middlewares/errorHandler';
import { apiRouter } from './routes';

const app = express();

// ══ Global Middleware ══
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
  }),
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ══ Static Files (uploads) with caching ══
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    next();
  },
  express.static(path.join(__dirname, '..', env.UPLOAD_DIR))
);

// ══ API Routes ══
app.use('/api/v1', apiRouter);

// ══ Health Check ══
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ══ Global Error Handler ══
app.use(errorHandler);

// ══ Start Server ══
const server = app.listen(env.PORT, () => {
  console.log(`🍉 Server running on http://localhost:${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EACCES') {
    console.error(
      `❌ Port ${env.PORT} requires elevated privileges or is blocked.`,
    );
  } else if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${env.PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

export default app;
