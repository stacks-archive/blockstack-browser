/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CheckerPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

/* eslint-enable @typescript-eslint/no-var-requires */

const sourceRootPath = path.join(__dirname, 'src');
const distRootPath = path.join(__dirname, 'dist');
const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const webBrowser = process.env.WEB_BROWSER ? process.env.WEB_BROWSER : 'chrome';
const isDevelopment = process.env.NODE_ENV !== 'production';

const extEnv = process.env.EXT_ENV || 'web';

const hmtlProdOpts = !isDevelopment
  ? {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }
  : {};

const getSourceMap = () => {
  if (extEnv === 'web') {
    return nodeEnv === 'production' ? 'eval' : 'cheap-source-map';
  }
  return 'none';
};

const aliases =
  nodeEnv === 'development'
    ? {
        react: path.resolve('../../node_modules/react'),
      }
    : {
        react: path.resolve('../../node_modules/preact/compat'),
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      };

module.exports = {
  entry: {
    main: path.join(sourceRootPath, 'index.tsx'),
  },
  output: {
    path: distRootPath,
    chunkFilename: !isDevelopment
      ? '[name].[contenthash:8].chunk.js'
      : isDevelopment && '[name].chunk.js',
    filename: !isDevelopment ? '[name].[contenthash:8].js' : isDevelopment && '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    plugins: [new TsconfigPathsPlugin()],
    alias: aliases,
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: !isDevelopment,
          keep_fnames: !isDevelopment,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        sourceMap: false,
      }),
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } }, // or whatever your project requires
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              // ["@babel/plugin-proposal-decorators", { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-optional-chaining',
              'babel-plugin-styled-components',
              isDevelopment && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: './dist',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    open: true,
  },
  devtool: getSourceMap(),
  watch: false,
  plugins: [
    new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
    new webpack.HashedModuleIdsPlugin(),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, '../', 'public', 'html', 'index.html'),
      inject: 'body',
      filename: 'index.html',
      title: 'Blockstack',
      chunks: ['main', 'common'],
      ...hmtlProdOpts,
    }),

    new CopyWebpackPlugin([
      {
        from: path.join(sourceRootPath, '../', 'public', 'assets'),
        to: path.join(distRootPath, 'assets'),
        test: /\.(jpg|jpeg|png|gif|svg)?$/,
      },
    ]),
    new webpack.DefinePlugin({
      'process.env.AUTH_ORIGIN': JSON.stringify(process.env.AUTH_ORIGIN),
      NODE_ENV: JSON.stringify(nodeEnv),
      WEB_BROWSER: JSON.stringify(webBrowser),
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    isDevelopment && new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),
  ].filter(Boolean),
};

if (nodeEnv === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin({ verbose: true, dry: false }));
}
