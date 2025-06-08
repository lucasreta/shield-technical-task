import { Request } from 'express';
import { getUserId } from '../getUserId';
import { UnauthorizedError } from '../errors';

describe('getUserId', () => {
  it('should return userId if present on request', () => {
    const req = {
      user: { userId: 'abc123' }
    } as Request;

    const result = getUserId(req);
    expect(result).toBe('abc123');
  });

  it('should throw UnauthorizedError if user is missing', () => {
    const req = {} as Request;

    expect(() => getUserId(req)).toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('should throw UnauthorizedError if userId is missing', () => {
    const req = { user: {} } as Request;

    expect(() => getUserId(req)).toThrow(new UnauthorizedError('Unauthorized'));
  });
});