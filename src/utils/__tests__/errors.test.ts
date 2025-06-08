import { AppError, UnauthorizedError, NotFoundError } from '../../utils/errors';

describe('Custom Errors', () => {
  it('AppError has message and statusCode', () => {
    const err = new AppError('Generic failure', 500);
    expect(err.message).toBe('Generic failure');
    expect(err.statusCode).toBe(500);
  });

  it('UnauthorizedError extends AppError and defaults to 401', () => {
    const err = new UnauthorizedError();
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Unauthorized');
  });

  it('NotFoundError extends AppError and defaults to 404', () => {
    const err = new NotFoundError();
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Resource not found');
  });

  it('NotFoundError uses custom message if provided', () => {
    const err = new NotFoundError('Wallet not found');
    expect(err.message).toBe('Wallet not found');
  });
});