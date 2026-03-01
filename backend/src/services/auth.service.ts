import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../helpers/hash.helper';
import { signAccessToken, signRefreshToken } from '../helpers/jwt.helper';
import { AppError } from '../middlewares/errorHandler';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';
import bcrypt from 'bcryptjs';

const REFRESH_TOKEN_SALT_ROUNDS = 6; // Lower rounds for token hashing (tokens are already cryptographically secure)

export const registerUser = async (input: RegisterInput) => {
  const { name, email, phone, password } = input;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email sudah terdaftar.', 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, ...(phone ? { phone } : {}) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  // Save refresh token hash
  const tokenHash = await bcrypt.hash(refreshToken, REFRESH_TOKEN_SALT_ROUNDS);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user, accessToken, refreshToken };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Email atau password salah.', 401);
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Email atau password salah.', 401);
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  // Save refresh token hash
  const tokenHash = await bcrypt.hash(refreshToken, REFRESH_TOKEN_SALT_ROUNDS);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User tidak ditemukan.', 404);
  }

  return user;
};

export const logoutUser = async (userId: string) => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

export const refreshTokens = async (refreshTokenValue: string) => {
  // Verify the refresh token JWT
  const { verifyRefreshToken } = await import('../helpers/jwt.helper');
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw new AppError('Refresh token tidak valid.', 401);
  }

  // Find all stored refresh tokens for this user
  const storedTokens = await prisma.refreshToken.findMany({
    where: { userId: decoded.userId, expiresAt: { gt: new Date() } },
  });

  // Check if any stored token hash matches
  let validToken = false;
  for (const stored of storedTokens) {
    const match = await bcrypt.compare(refreshTokenValue, stored.tokenHash);
    if (match) {
      validToken = true;
      // Delete the used refresh token (rotation)
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      break;
    }
  }

  if (!validToken) {
    throw new AppError('Refresh token tidak valid atau sudah digunakan.', 401);
  }

  // Issue new token pair
  const accessToken = signAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });
  const newRefreshToken = signRefreshToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  // Save new refresh token hash
  const tokenHash = await bcrypt.hash(
    newRefreshToken,
    REFRESH_TOKEN_SALT_ROUNDS,
  );
  await prisma.refreshToken.create({
    data: {
      userId: decoded.userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  return { user, accessToken, refreshToken: newRefreshToken };
};
