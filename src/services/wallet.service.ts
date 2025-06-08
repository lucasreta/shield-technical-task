import { prisma } from '@config/prisma';
import { NotFoundError } from '@utils/errors';

export const getAll = async (userId: string) => {
  return prisma.wallet.findMany({ where: { userId } });
};

export const create = async (userId: string, data: { tag?: string; chain: string; address: string }) => {
  return prisma.wallet.create({ data: { ...data, userId } });
};

export const getById = async (userId: string, id: string) => {
  const wallet = await prisma.wallet.findUnique({ where: { id } });
  if (!wallet) throw new NotFoundError('Wallet not found');
  if (wallet.userId !== userId) throw new NotFoundError('Wallet not found'); // Shouldn't reveal wallets existence
  return wallet;
};

export const update = async (userId: string, id: string, data: { tag?: string; chain?: string; address?: string }) => {
  await getById(userId, id);
  return prisma.wallet.update({ where: { id }, data });
};

export const remove = async (userId: string, id: string) => {
  await getById(userId, id);
  return prisma.wallet.delete({ where: { id } });
};
