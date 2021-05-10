/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./webpack.config.base');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const shouldMinify = JSON.parse(process.env.MINIFY_PRODUCTION_BUILD || false);

// Basically, disable any code splitting stuff
config.optimization = {
  ...config.optimization,
  flagIncludedChunks: false,
  concatenateModules: false,
  minimize: shouldMinify,
  moduleIds: 'deterministic',
  splitChunks: {
    hidePathInfo: false,
    minSize: 10000,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
  },
  ...(shouldMinify
    ? {
        minimizer: [
          new ESBuildMinifyPlugin({
            target: 'esnext',
          }),
        ],
      }
    : {}),
};

config.devtool = false;

module.exports = config;
