module.exports = {
  "extends": [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": [
    "import",
    "@typescript-eslint"
  ],
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/resolver": { "typescript": {} }
  },
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "no-tabs": 0,
    "no-restricted-globals": 0,
    "import/prefer-default-export": 0,
    "no-buffer-constructor": 0,
    "no-mixed-operators": 0,
    "no-plusplus": 0,
    "no-bitwise": 0,
    "prefer-promise-reject-errors": 0,
    "class-methods-use-this": 0,
    "import/no-cycle": 0,
    "prefer-destructuring": 0,
    "no-prototype-builtins": 0,
    "comma-dangle": ["error", "never"],
    "quotes": [2, "single"],
    "eol-last": 2,
    "no-debugger": 1,
    "no-mixed-requires": 0,
    "no-underscore-dangle": 0,
    "no-multi-spaces": 0,
    "no-trailing-spaces": 0,
    "no-extra-boolean-cast": 0,
    "no-undef": 2,
    "no-var": 2,
    "no-param-reassign": 0,
    "no-else-return": 0,
    "no-console": 0,
    "prefer-const": 2,
    "new-cap": 0,
    "semi": [2, "never"],
    "valid-jsdoc": "off",
    "object-curly-newline": "off",    
    "arrow-parens": "off",
    "function-paren-newline": 0,
    "no-shadow": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/indent": [2, 2, {
      "FunctionDeclaration": { "parameters": "first" },
      "FunctionExpression": { "parameters": "first" },
      "ObjectExpression": "first",
      "ArrayExpression": "first",
      "ImportDeclaration": "first",
      "CallExpression": { "arguments": "first" }
    }],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-angle-bracket-type-assertion": "off",
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "off",

    // TODO: enable this when reasonable
    "@typescript-eslint/no-explicit-any": "off",

    // TODO: enable this when reasonable
    "@typescript-eslint/promise-function-async": "off",

    // TODO: enable when this is fixed https://github.com/benmosher/eslint-plugin-import/issues/1282
    "import/named": "off"
  }
}
