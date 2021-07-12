const { version } = require('./package.json');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('./tsconfig');
const pathNames = {};
Object.keys(compilerOptions.paths).forEach(key => {
  const [path] = compilerOptions.paths[key];
  if (key.includes('/ui')) {
    return;
  }
  if (path.startsWith('../')) {
    pathNames[key.replace(/\*/g, '(.*)')] = `<rootDir>/${path.slice(3).replace(/\*/g, '$1')}`;
    return;
  } else {
    pathNames[key.replace(/\*/g, '(.*)')] = `<rootDir>/src/${path.replace(/\*/g, '$1')}`;
  }
});

module.exports = {
  collectCoverage: true,
  coverageReporters: ['html', 'json-summary'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  globals: {
    'ts-jest': {
      // https://huafu.github.io/ts-jest/user/config/diagnostics
      diagnostics: false,
      tsconfig: '<rootDir>/tests/tsconfig.json',
    },
    VERSION: version,
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],

  moduleNameMapper: {
    ...pathNames,
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec).(js|ts|tsx)'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc-node/jest',
  },
  testEnvironment: 'jsdom',
  cacheDirectory: '<rootDir>/.jest-cache',
};
