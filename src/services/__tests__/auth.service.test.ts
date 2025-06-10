import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@config/prisma';
import * as authService from '@services/auth.service';
import { AppError, UnauthorizedError } from '@utils/errors';
import { env } from '@config/environment';

jest.mock('@config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tokenBlacklist: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const email = 'test@example.com';
const password = 'password123';
const hashedPassword = 'hashed_password';
const userId = 'user-123';
const mockUser = { id: userId, email, password: hashedPassword };
const mockToken = 'mock-token';

describe('Auth Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('signUpService', () => {
    it('should create a new user if email is not taken', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.signUpService(email, password);
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should throw if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      await expect(authService.signUpService(email, password)).rejects.toThrow(
        new AppError('Email already in use', 409)
      );
    });
  });

  describe('signInService', () => {
    it('should return JWT if credentials are valid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = await authService.signInService(email, password);
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });

    it('should throw if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(authService.signInService(email, password)).rejects.toThrow(
        new UnauthorizedError('Invalid credentials')
      );
    });

    it('should throw if password mismatch', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.signInService(email, password)).rejects.toThrow(
        new UnauthorizedError('Invalid credentials')
      );
    });
  });

  describe('signOutService', () => {
    it('should decode the token and call blacklistToken with correct args', async () => {
      const token = 'signed-token';
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const expiresAt = new Date(exp * 1000);

      (jwt.decode as jest.Mock).mockReturnValue({ userId: 'abc123', exp });

      const spy = jest.spyOn(authService, 'blacklistToken').mockResolvedValue(undefined);

      await authService.signOutService(token);

      expect(spy).toHaveBeenCalledWith(token, expiresAt);
      spy.mockRestore();
    });
  });

  describe('blacklistToken', () => {
    it('should call prisma to create blacklist entry', async () => {
      const expiresAt = new Date();
      await authService.blacklistToken(mockToken, expiresAt);
      expect(prisma.tokenBlacklist.create).toHaveBeenCalledWith({
        data: {
          token: mockToken,
          expiresAt,
        },
      });
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return true if token is found', async () => {
      (prisma.tokenBlacklist.findUnique as jest.Mock).mockResolvedValue({ token: mockToken });
      const result = await authService.isTokenBlacklisted(mockToken);
      expect(result).toBe(true);
    });

    it('should return false if token is not found', async () => {
      (prisma.tokenBlacklist.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await authService.isTokenBlacklisted(mockToken);
      expect(result).toBe(false);
    });
  });
});
