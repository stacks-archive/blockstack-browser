module.exports = {
  extends: ['@blockstack/eslint-config'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    page: true,
    browser: true,
    context: true,
  },
  rules: {
    '@typescript-eslint/no-unnecessary-type-assertion': [0],
  },
};
