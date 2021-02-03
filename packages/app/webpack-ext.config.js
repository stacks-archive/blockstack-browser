/* eslint-disable @typescript-eslint/no-var-requires */
const baseWebpack = require('./webpack.config');

// Basically, disable any code splitting stuff
baseWebpack.optimization = {
  flagIncludedChunks: false,
  occurrenceOrder: false,
  concatenateModules: false,
  minimize: process.env.NODE_ENV !== 'test',
  splitChunks: {
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
};

module.exports = baseWebpack;
