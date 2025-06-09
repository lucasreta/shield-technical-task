import { AppError, UnauthorizedError, NotFoundError } from '../../utils/errors';

describe('AppError', () => {
  it('should set message and default statusCode', () => {
    const error = new AppError('Something broke');
    expect(error.message).toBe('Something broke');
    expect(error.statusCode).toBe(500);
  });

  it('should set custom statusCode if provided', () => {
    const error = new AppError('Custom error', 418);
    expect(error.statusCode).toBe(418);
  });
});

describe('UnauthorizedError', () => {
  it('should extend AppError with statusCode 401', () => {
    const error = new UnauthorizedError('Not allowed');
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Not allowed');
    expect(error.statusCode).toBe(401);
  });
});

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