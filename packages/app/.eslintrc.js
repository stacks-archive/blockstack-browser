module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
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
    '@typescript-eslint/no-unsafe-assignment': [0],
    '@typescript-eslint/no-unsafe-return': [0],
    '@typescript-eslint/no-unsafe-call': [0],
    '@typescript-eslint/no-unsafe-member-access': [0],
    '@typescript-eslint/ban-types': [0],
    '@typescript-eslint/restrict-template-expressions': [0],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    "no-warning-comments": [1],
    "react-hooks/exhaustive-deps": [
      "warn", {
        additionalHooks: "useRecoilCallback",
      },
    ]
  },
};
