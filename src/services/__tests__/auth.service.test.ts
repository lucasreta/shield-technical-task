import { signUpService, signInService } from '@services/auth.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@config/prisma';

jest.mock('@config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { AppError } from '@utils/errors';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  const email = 'test@example.com';
  const password = 'Password123';
  const hashedPassword = 'hashed_password';
  const mockUser = { id: 'user-123', email, password: hashedPassword };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUpService', () => {
    it('should create a new user if email is not taken', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await signUpService(email, password);
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should throw if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      await expect(signUpService(email, password)).rejects.toThrow('Email already in use');
    });
  });

  describe('signInService', () => {
    it('should return JWT if credentials are valid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const token = await signInService(email, password);
      expect(token).toBe('mock-token');
    });

    it('should throw if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(signInService(email, password)).rejects.toThrow('Invalid credentials');
    });

    it('should throw if password mismatch', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(signInService(email, password)).rejects.toThrow('Invalid credentials');
    });
  });
});

describe('Auth Service - Standard Unit Tests', () => {
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = 'hashed-password';
  const userId = 'user-abc';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns JWT on successful signIn', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId, email, password: hashedPassword });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mock.jwt.token');

    const token = await signInService(email, password);
    expect(token).toBe('mock.jwt.token');
  });

  it('throws AppError if email not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(signInService(email, password)).rejects.toThrow(AppError);
  });

  it('throws AppError if password is incorrect', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId, email, password: hashedPassword });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(signInService(email, password)).rejects.toThrow(AppError);
  });

  it('hashes password and returns user on signUp', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: userId, email });

    const user = await signUpService(email, password);
    expect(user).toEqual({ id: userId, email });
  });

  it('throws AppError on duplicate email in signUp', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId, email });
    await expect(signUpService(email, password)).rejects.toThrow(AppError);
  });
});
