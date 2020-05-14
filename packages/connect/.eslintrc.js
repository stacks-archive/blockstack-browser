module.exports = {
  extends: ['@blockstack/eslint-config'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['test-app/', 'node_modules/'],
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
