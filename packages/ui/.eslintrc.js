module.exports = {
  ignorePatterns: ['node_modules/'],
  extends: ['@blockstack/eslint-config'],
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
