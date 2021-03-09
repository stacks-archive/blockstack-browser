/* eslint-disable @typescript-eslint/no-var-requires */
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
  plugins: [...baseConfig.plugins],
};

module.exports = config;
