module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['jest'],
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true,
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
