import * as service from '@services/wallet.service';
import { prisma } from '@config/prisma';

jest.mock('@config/prisma', () => ({
  prisma: {
    wallet: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { NotFoundError } from '@utils/errors';

const userId = 'user-1';
const walletId = 'wallet-1';

const mockWallet = {
  id: walletId,
  userId,
  tag: 'My Wallet',
  chain: 'Ethereum',
  address: '0x123',
};

describe('Wallet Service', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getAll() should return all user wallets', async () => {
    (prisma.wallet.findMany as jest.Mock).mockResolvedValue([mockWallet]);
    const wallets = await service.getAll(userId);
    expect(wallets).toHaveLength(1);
  });

  it('getById() should return wallet if owned by user', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    const wallet = await service.getById(userId, walletId);
    expect(wallet).toEqual(mockWallet);
  });

  it('create() should create a new wallet', async () => {
    (prisma.wallet.create as jest.Mock).mockResolvedValue(mockWallet);
    const wallet = await service.create(userId, mockWallet);
    expect(wallet).toEqual(mockWallet);
  });

  it('update() should update the wallet', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (prisma.wallet.update as jest.Mock).mockResolvedValue({ ...mockWallet, tag: 'Updated' });

    const result = await service.update(userId, walletId, { tag: 'Updated' });
    expect(result.tag).toBe('Updated');
  });

  it('delete() should delete the wallet', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (prisma.wallet.delete as jest.Mock).mockResolvedValue(mockWallet);

    const result = await service.remove(userId, walletId);
    expect(result.id).toBe(walletId);
  });
});

describe('Wallet Service - Standard Unit Tests', () => {
  const userId = 'user-1';
  const walletId = 'wallet-1';
  const mockWallet = {
    id: walletId,
    userId,
    tag: 'Main',
    chain: 'Ethereum',
    address: '0xabc',
  };

  beforeEach(() => jest.clearAllMocks());

  it('creates a wallet', async () => {
    (prisma.wallet.create as jest.Mock).mockResolvedValue(mockWallet);
    const wallet = await service.create(userId, mockWallet);
    expect(wallet).toEqual(mockWallet);
  });

  it('throws NotFoundError if wallet not found for getById', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.getById(userId, walletId)).rejects.toThrow(new NotFoundError('Wallet not found'));
  });

  it('updates wallet if owned by user', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (prisma.wallet.update as jest.Mock).mockResolvedValue({ ...mockWallet, tag: 'Updated' });
    const updated = await service.update(userId, walletId, { tag: 'Updated' });
    expect(updated.tag).toBe('Updated');
  });

  it('deletes wallet if owned by user', async () => {
    (prisma.wallet.findUnique as jest.Mock).mockResolvedValue(mockWallet);
    (prisma.wallet.delete as jest.Mock).mockResolvedValue(mockWallet);
    const deleted = await service.remove(userId, walletId);
    expect(deleted.id).toBe(walletId);
  });
});
