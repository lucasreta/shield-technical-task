import request from 'supertest';
import app from '../../app';
import { prisma } from '@config/prisma';
import jwt from 'jsonwebtoken';
import * as authService from '@services/auth.service';

jest.mock('@services/auth.service');
jest.mock('@config/prisma', () => ({
  prisma: {
    wallet: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tokenBlacklist: {
      findUnique: jest.fn(),
    },
  },
}));

const userId = 'user-1';
const walletId = 'wallet-1';
const token = jwt.sign({ userId }, 'test-secret');
const authHeader = { Authorization: `Bearer ${token}` };

const mockWallet = {
  id: walletId,
  userId,
  tag: 'Test Wallet',
  chain: 'Ethereum',
  address: '0xabc',
};

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('Wallet Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /wallets returns user wallets', async () => {
    (prisma.wallet.findMany as jest.Mock).mockResolvedValue([mockWallet]);
    const res = await request(app).get('/wallets').set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe(walletId);
  });

  it('POST /wallets creates a wallet', async () => {
    (prisma.wallet.create as jest.Mock).mockResolvedValue(mockWallet);
    const res = await request(app)
      .post('/wallets')
      .set(authHeader)
      .send({ chain: 'Ethereum', address: '0xabc', tag: 'Test Wallet' });

    expect(res.status).toBe(201);
    expect(res.body.address).toBe('0xabc');
  });

  it('GET /wallets/:id returns specific wallet', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    const res = await request(app).get(`/wallets/${walletId}`).set(authHeader);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(walletId);
  });

  it('PUT /wallets/:id updates wallet', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (prisma.wallet.update as jest.Mock).mockResolvedValue({ ...mockWallet, tag: 'Updated' });

    const res = await request(app)
      .put(`/wallets/${walletId}`)
      .set(authHeader)
      .send({ tag: 'Updated', chain: 'Ethereum', address: '0xabc' });

    expect(res.status).toBe(200);
    expect(res.body.tag).toBe('Updated');
  });

  it('DELETE /wallets/:id deletes wallet', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (prisma.wallet.delete as jest.Mock).mockResolvedValue(mockWallet);

    const res = await request(app).delete(`/wallets/${walletId}`).set(authHeader);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
});

import * as walletService from '@services/wallet.service';

describe('Wallet Controller - next(err) coverage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('calls next() from getWallets if service throws', async () => {
    jest.spyOn(walletService, 'getAll').mockImplementation(() => {
      throw new Error('Fail in getAll');
    });

    const res = await request(app).get('/wallets').set(authHeader);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });

  it('calls next() from getWalletById if service throws', async () => {
    jest.spyOn(walletService, 'getById').mockImplementation(() => {
      throw new Error('Fail in getById');
    });

    const res = await request(app).get('/wallets/some-id').set(authHeader);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });

  it('calls next() from createWallet if service throws', async () => {
    jest.spyOn(walletService, 'create').mockImplementation(() => {
      throw new Error('Fail in create');
    });

    const res = await request(app)
      .post('/wallets')
      .set(authHeader)
      .send({ tag: 'tag', chain: 'Ethereum', address: '0xabc' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
  it('calls next() from deleteWallet if service throws', async () => {
    jest.spyOn(walletService, 'remove').mockImplementation(() => {
      throw new Error('Fail in delete');
    });

    const res = await request(app)
      .delete('/wallets/some-id')
      .set(authHeader);

    expect(res.status).toBe(500);
  });
});

describe('Wallet Controller - ACL Enforcement', () => {
  const walletId = 'wallet-acl';
  const ownerId = 'owner-id';

  it('PUT /wallets/:id - returns 404 if wallet belongs to another user', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue({
      id: walletId,
      userId: ownerId
    });

    const res = await request(app)
      .put(`/wallets/${walletId}`)
      .set(authHeader)
      .send({ tag: 'hacked', chain: 'Bitcoin', address: '0xhacked' });

    expect(res.status).toBe(404);
  });
});

describe('JWT Middleware - Invalid Tokens', () => {
  const invalidToken = 'invalid.token.value';

  it('GET /wallets - returns 401 with invalid JWT', async () => {
    const res = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Invalid token|jwt/i);
  });
});

describe('Wallet Controller - Auth Middleware', () => {
  it('GET /wallets returns 401 if Authorization header is missing', async () => {
    const res = await request(app).get('/wallets');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/No token provided/i);
  });

  it('POST /wallets returns 401 if Authorization header is missing', async () => {
    const res = await request(app)
      .post('/wallets')
      .send({ chain: 'Ethereum', address: '0xabc', tag: 'Test Wallet' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/No token provided/i);
  });
});

describe('Integration Testing', () => {
  it('returns 404 on unknown route', async () => {
    const res = await request(app).get('/unknown/route');
    expect(res.status).toBe(404);
  });

  it('should return 401 if token is blacklisted', async () => {
    (authService.isTokenBlacklisted as jest.Mock).mockResolvedValue(true);
    const res = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Invalid token/i);
  });

  it('should return 401 if token has no userId', async () => {
    const badToken = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET!);
    const res = await request(app)
      .get('/wallets')
      .set('Authorization', `Bearer ${badToken}`);

    expect(res.status).toBe(401);
  });
});
