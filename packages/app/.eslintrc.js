module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "plugins": [
    "@typescript-eslint",
    "react"
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "quotes": [2, "single"],
    "eol-last": 2,
    "no-mixed-requires": 0,
    "no-var": 2,
    "no-param-reassign": "error",
    "brace-style": 2,
    "no-empty": "off",
    //"max-len": ["error", { "code": 100 }],
    "@typescript-eslint/indent": [2, 2, {
      "FunctionDeclaration": { "parameters": "first" },
      "FunctionExpression": { "parameters": "first" },
      "ObjectExpression": "first",
      "ArrayExpression": "first",
      "ImportDeclaration": "first",
      "CallExpression": { "arguments": "first" }
    }],
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "none",
        "requireLast": true
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": true
      },
    }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/semi": ["error", "never"],
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/await-thenable": "error",

    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "react/jsx-uses-vars": [2]
  }
};
