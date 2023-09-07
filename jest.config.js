module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 4,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/*.interface.ts', '!src/**/*.type.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^internal\\:typedi$': '<rootDir>/src/index.mts',
    '^internal\\:typedi/(.+)': '<rootDir>/src/$1'
  }
};
