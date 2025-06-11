import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = "node";
export const transform = {
  ...tsJestTransformCfg,
};
export const moduleNameMapper = {
  '^@config/(.*)$': '<rootDir>/src/config/$1',
  '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
  '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
  '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  '^@services/(.*)$': '<rootDir>/src/services/$1',
  '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  '^@validators/(.*)$': '<rootDir>/src/validators/$1'
};
export const setupFilesAfterEnv = ['<rootDir>/test/jest.setup.ts'];
export const testPathIgnorePatterns = ['<rootDir>/dist/'];
