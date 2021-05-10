/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  flagIncludedChunks: false,
  concatenateModules: false,
  // Chrome web store doesn't allow minified code
  minimize: false,
  moduleIds: 'deterministic',
  splitChunks: {
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
};

config.devtool = false;

module.exports = config;
