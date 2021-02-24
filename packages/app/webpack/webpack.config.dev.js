/* eslint-disable @typescript-eslint/no-var-requires */
const ExtensionReloader = require('webpack-extension-reloader');
const baseConfig = require('./webpack.config.base');

const config = {
  ...baseConfig,
  mode: 'development',
  output: {
    ...baseConfig.output,
    pathinfo: false,
    chunkFilename: '[name].chunk.js',
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devtool: 'eval', // fastest
  plugins: [
    new ExtensionReloader({
      port: 9128,
      reloadPage: true,
      entries: {
        background: 'background',
        contentScript: ['message-bus'],
      },
    }),
    ...baseConfig.plugins,
  ],
};

module.exports = config;
