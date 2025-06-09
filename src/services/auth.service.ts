
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@config/prisma';
import { AppError, UnauthorizedError } from '@utils/errors';

export async function signInService(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  return token;
}

export async function signUpService(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  return user;
}

export async function signOutService(token: string) {
  const decoded = jwt.decode(token) as jwt.JwtPayload;
  // Decode is safe here because `authenticate` has already verified the signature and structure
  const expiresAt = new Date((decoded.exp as number) * 1000);
  await blacklistToken(token, expiresAt);
}

export const blacklistToken = async (token: string, expiresAt: Date) => {
  await prisma.tokenBlacklist.create({
    data: {
      token,
      expiresAt,
    },
  });
};

export const isTokenBlacklisted = async (token: string) => {
  const entry = await prisma.tokenBlacklist.findUnique({ where: { token } });
  return !!entry;
};
