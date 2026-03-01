import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';
import { authLimiter } from '../middlewares/rateLimiter';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
