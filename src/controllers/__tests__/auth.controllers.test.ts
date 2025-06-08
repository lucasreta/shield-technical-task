import request from 'supertest';
import app from '../../app';
import * as authService from '@services/auth.service';
import { UnauthorizedError } from '@utils/errors';

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
  });

  describe('POST /signin/signup', () => {
    it('returns user info on success', async () => {
      const mockUser = { id: 'user-123', email };
      (authService.signUpService as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/signin/signup').send({ email, password });

      expect(res.status).toBe(201);
      expect(res.body.token).toEqual(mockUser);
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
