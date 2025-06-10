import request from 'supertest';
import app from '../../app';
import * as authService from '@services/auth.service';
import { AppError, UnauthorizedError } from '@utils/errors';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

jest.mock('@services/auth.service');

describe('Auth Controller', () => {
  const email = 'test@example.com';
  const password = 'Password123';
  const token = 'mock-jwt';

  describe('POST /signin', () => {
    it('returns JWT token on success', async () => {
      (authService.signInService as jest.Mock).mockResolvedValue(token);
      const res = await request(app).post('/signin').send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe(token);
    });

    it('should return 400 and formatted Zod errors for invalid signin input', async () => {
      const res = await request(app)
        .post('/signin')
        .send({ email: 'not-an-email', password: 123 }); // clearly invalid

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error');
      expect(res.body.errors).toHaveProperty('email');
      expect(res.body.errors).toHaveProperty('password');
    });
  });

  describe('POST /signup', () => {
    it('returns user info on success', async () => {
      const mockUser = { id: 'user-123', email };
      (authService.signUpService as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/signup').send({ email, password });

      expect(res.status).toBe(201);
      expect(res.body.token).toEqual(mockUser);
    });
    
    it('should return 409 if email already in use', async () => {
      (authService.signUpService as jest.Mock).mockRejectedValue(new AppError('Email already in use', 409));
      const res = await request(app)
        .post('/signup')
        .send({ email, password });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Email already in use');
      expect(authService.signUpService).toHaveBeenCalled();
    });
  });

  describe('POST /signout', () => {
    const mockUser = { userId: 'user-1', email: 'test@example.com' };
    const token = jwt.sign(mockUser, 'test-secret');

    beforeAll(() => {
      process.env.JWT_SECRET = 'test-secret';
    });

    beforeEach(() => {
      jest.resetAllMocks();
      jest.mock('@middleware/auth.middleware', () => ({
        authenticate: (_req: Request, _res: Response, next: NextFunction) => next(),
      }));
    });

    it('should blacklist the token and return 200', async () => {
      (authService.signOutService as jest.Mock).mockResolvedValue(undefined);
      const res = await request(app)
        .post('/signout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Successfully signed out');
      expect(authService.signOutService).toHaveBeenCalled();
    });

    it('should return 500 if something fails while invalidating the token', async () => {
      (authService.signOutService as jest.Mock).mockRejectedValue(new Error('db fail'));
      const res = await request(app)
        .post('/signout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal Server Error');
      expect(authService.signOutService).toHaveBeenCalled();
    });

    it('should handle invalid decoded payload gracefully', async () => {
      (authService.signOutService as jest.Mock).mockResolvedValue(undefined);
      const badToken = jwt.sign({}, 'test-secret');
      const res = await request(app)
        .post('/signout')
        .set('Authorization', `Bearer ${badToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Invalid token/);
    });
  });
});

describe('Auth Controller - Edge Cases', () => {
  const email = 'edge@example.com';
  const password = '123456';
  const invalidPassword = 'wrongpass';

  it('POST /signin - returns 400 if email is invalid', async () => {
    const res = await request(app)
      .post('/signin')
      .send({ email: 'not-an-email', password });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });

  it('POST /signin - returns 401 if password is wrong', async () => {
    (authService.signInService as jest.Mock).mockRejectedValue(new UnauthorizedError('Invalid credentials'));

    const res = await request(app)
      .post('/signin')
      .send({ email, password: invalidPassword });

    expect(res.status).toBe(401);
  });
});
