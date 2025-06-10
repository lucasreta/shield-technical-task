/* eslint-disable @typescript-eslint/no-require-imports */
jest.resetModules();

describe('environment config', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('throws error if required env vars are missing', () => {
    jest.isolateModules(() => {
      // 👇 mock dotenv.config() to NOT override process.env
      jest.mock('dotenv', () => ({
        config: jest.fn(),
      }));

      expect(() => {
        require('../environment');
      }).toThrow(/Missing required env vars: JWT_SECRET, DATABASE_URL/);
    });
  });

  it('loads successfully when required env vars are present', () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.DATABASE_URL = 'postgres://test-db';
    process.env.NODE_ENV = 'test';
    process.env.PORT = '8080';

    let env: typeof import('../environment').env | undefined;

    jest.isolateModules(() => {
      jest.mock('dotenv', () => ({
        config: jest.fn(),
      }));

      env = require('../environment').env;
    });

    expect(env).toBeDefined();
    expect(env!.JWT_SECRET).toBe('test-secret');
    expect(env!.DATABASE_URL).toBe('postgres://test-db');
    expect(env!.NODE_ENV).toBe('test');
    expect(env!.PORT).toBe(8080);
  });
});
