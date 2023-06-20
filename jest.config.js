module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 4,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
};