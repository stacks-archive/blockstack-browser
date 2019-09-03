module.exports = {
  "extends": [
    "../.eslintrc.js"
  ],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "plugins": ["jest"],
  "env": {
    "jest/globals": true
  },
};
