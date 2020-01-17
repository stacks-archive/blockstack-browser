const {
  override,
  babelInclude,
  removeModuleScopePlugin,
  addWebpackAlias,
} = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');
const path = require('path');

/* config-overrides.js */
module.exports = override(
  removeModuleScopePlugin(),
  addWebpackAlias({
    react: path.resolve('./node_modules', 'react'),
    'react-dom': path.resolve('./node_modules', 'react-dom'),
  }),
  babelInclude([
    path.resolve('src'), // make sure you link your own source
    path.resolve('../src'),
  ]),
  addReactRefresh({ disableRefreshCheck: true })
);
