/** @type {import('jest').Config} */
const configuration = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 4,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts', '!src/**/*.type.ts'],
  transform: {
    '^.+\\.(m?[tj]sx?)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  resolver: '<rootDir>/scripts/testing/jest-module-resolver.cjs',
};

module.exports = configuration;
