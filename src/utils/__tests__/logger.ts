import { log } from '../logger';

describe('logger (test mode)', () => {
  it('should not throw when logging in test', () => {
    expect(() => {
      log.info('test log');
      log.warn('test log');
      log.error('test log');
      log.trace('req-id', 'test trace');
    }).not.toThrow();
  });
});

describe('logger (non-test mode)', () => {
  const ORIGINAL_ENV = process.env;
  let originalConsoleLog: typeof console.log;
  let originalConsoleWarn: typeof console.warn;
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    jest.resetModules(); // Clear module cache
    process.env = { ...ORIGINAL_ENV, NODE_ENV: 'production' }; // Fake prod mode
    originalConsoleLog = console.log;
    originalConsoleWarn = console.warn;
    originalConsoleError = console.error;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  it('calls console methods in non-test mode', () => {
		const logSpy = jest.fn();
		const warnSpy = jest.fn();
		const errorSpy = jest.fn();

		console.log = logSpy;
		console.warn = warnSpy;
		console.error = errorSpy;

		const { log: liveLog } = require('../logger');

		// With meta
		liveLog.info('info message', { a: 1 });
		liveLog.trace('req-123', 'trace message', { b: 2 });

		// Without meta → hits meta || ''
		liveLog.info('info-only');
		liveLog.warn('warn-only');
		liveLog.error('error-only');
		liveLog.trace('req-456', 'trace-only');

		expect(logSpy).toHaveBeenCalledWith('[INFO] info message', { a: 1 });
		expect(logSpy).toHaveBeenCalledWith('[INFO] info-only', '');
		expect(warnSpy).toHaveBeenCalledWith('[WARN] warn-only', '');
		expect(errorSpy).toHaveBeenCalledWith('[ERROR] error-only', '');
		expect(logSpy).toHaveBeenCalledWith('[TRACE] [req-123] trace message', { b: 2 });
		expect(logSpy).toHaveBeenCalledWith('[TRACE] [req-456] trace-only', '');
	});
});
