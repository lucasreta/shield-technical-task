import { Request, Response, NextFunction } from 'express';
import * as service from '@services/wallet.service';
import { getUserId } from '@utils/getUserId';

export const getWallets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const wallets = await service.getAll(userId);
    res.json(wallets);
  } catch (err) {
    next(err);
  }
};

export const createWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { tag, chain, address } = req.body;
    const wallet = await service.create(userId, { tag, chain, address });
    res.status(201).json(wallet);
  } catch (err) {
    next(err);
  }
};

export const getWalletById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const wallet = await service.getById(userId, req.params.id);
    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

export const updateWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const wallet = await service.update(userId, req.params.id, req.body);
    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

export const deleteWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    await service.remove(userId, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
