module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: ['TS151001']
      }
    }
  },
  setupFiles: [
    './tests/global-setup.ts'
  ],
  setupFilesAfterEnv: [
    './tests/setup.ts'
  ]
};
