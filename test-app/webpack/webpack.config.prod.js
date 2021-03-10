/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  flagIncludedChunks: false,
  concatenateModules: false,
  minimize: process.env.NODE_ENV !== 'test',
  moduleIds: 'deterministic',
  splitChunks: {
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
  minimizer: [
    new ESBuildMinifyPlugin({
      target: 'es2015',
      tsconfigRaw: require('../tsconfig.json')
    }),
  ],
};

config.devtool = false;

module.exports = config;
