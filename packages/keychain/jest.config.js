module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  setupFiles: [
    './tests/global-setup.ts'
  ],
  setupFilesAfterEnv: [
    './tests/setup.ts'
  ]
};
