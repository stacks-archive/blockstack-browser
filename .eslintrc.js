module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  extends: ['@blockstack/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  }
};
