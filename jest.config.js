module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 4,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  }
};