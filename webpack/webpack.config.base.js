/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { version: _version } = require('../package.json');

// plugins
const WebpackBarPlugin = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const SRC_ROOT_PATH = path.join(__dirname, '../', 'src');
const DIST_ROOT_PATH = path.join(__dirname, '../', 'dist');
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = !IS_DEV;
const TEST_ENV = !!process.env.TEST_ENV;
const ANALYZE_BUNDLE = process.env.ANALYZE === 'true';
const MAIN_BRANCH = 'refs/heads/main';
const GITHUB_REF = process.env.GITHUB_REF;
const GITHUB_SHA = process.env.GITHUB_SHA;

/**
 * For non main branch builds, we add a random number after the patch version.
 */
const getVersion = ref => {
  if (ref === MAIN_BRANCH || !ref) return _version;
  return `${_version}.${Math.floor(Math.floor(Math.random() * 1000))}`;
};

const BRANCH = GITHUB_REF;
const COMMIT_SHA = GITHUB_SHA;
const VERSION = getVersion(BRANCH);

// to measure speed :~)
const smp = new SpeedMeasurePlugin({
  disable: !ANALYZE_BUNDLE,
  granularLoaderData: true,
});

const APP_TITLE = 'Stacks Wallet for Web';

const HTML_OPTIONS = {
  inject: 'body',
  title: APP_TITLE,
  chunks: ['index', 'common'],
};

const HTML_PROD_OPTIONS = IS_DEV
  ? HTML_OPTIONS
  : {
      ...HTML_OPTIONS,
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
    };

const aliases = IS_DEV
  ? {}
  : {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    };

const config = {
  entry: {
    background: path.join(SRC_ROOT_PATH, 'extension', 'background', 'index.ts'),
    inpage: path.join(SRC_ROOT_PATH, 'extension', 'inpage.ts'),
    'message-bus': path.join(SRC_ROOT_PATH, 'extension', 'content-scripts', 'message-bus.ts'),
    index: path.join(SRC_ROOT_PATH, 'index.tsx'),
  },
  output: {
    path: DIST_ROOT_PATH,
    chunkFilename: !IS_DEV ? '[name].[contenthash:8].chunk.js' : IS_DEV && '[name].chunk.js',
    filename: () => '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.d.ts'],
    plugins: [new TsconfigPathsPlugin()],
    alias: aliases,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      assert: require.resolve('assert'),
      fs: false,
      path: false,
    },
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      name: 'common',
    },
    runtimeChunk: false,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
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
                ['@babel/plugin-proposal-class-properties', { loose: false }],
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-proposal-optional-chaining',
                IS_DEV && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'esnext',
            },
          },
        ],
      },
      {
        test: /\.wasm$/,
        // Tells WebPack that this module should be included as
        // base64-encoded binary file and not as code
        loader: 'base64-loader',
        // Disables WebPack's opinion where WebAssembly should be,
        // makes it think that it's not WebAssembly
        //
        // Error: WebAssembly module is included in initial chunk.
        type: 'javascript/auto',
      },
    ].filter(Boolean),
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },
  devtool: 'cheap-module-source-map',
  watch: false,
  plugins: [
    new WebpackBarPlugin({}),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    }),
    new HtmlWebpackPlugin({
      template: path.join(SRC_ROOT_PATH, '../', 'public', 'html', 'extension.html'),
      filename: 'extension.html',
      ...HTML_PROD_OPTIONS,
    }),
    new HtmlWebpackPlugin({
      template: path.join(SRC_ROOT_PATH, '../', 'public', 'html', 'popup.html'),
      filename: 'popup.html',
      ...HTML_PROD_OPTIONS,
    }),
    new HtmlWebpackPlugin({
      template: path.join(SRC_ROOT_PATH, '../', 'public', 'html', 'full-page.html'),
      filename: 'full-page.html',
      ...HTML_PROD_OPTIONS,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(SRC_ROOT_PATH, '../', 'public', 'assets'),
          to: path.join(DIST_ROOT_PATH, 'assets'),
        },
        {
          from: path.join(SRC_ROOT_PATH, 'manifest.json'),
          to: path.join(DIST_ROOT_PATH, 'manifest.json'),
          toType: 'file',
          transform(content, path) {
            const csrTag = '<% DEV_CSR %>';
            const objSrcTag = '<% DEV_OBJECT_SRC %>';
            const versionTag = '<% VERSION %>';
            content = content.toString();
            if (IS_DEV) {
              content = content.replace(csrTag, " 'unsafe-eval'");
              content = content.replace(objSrcTag, "'self'");
            } else {
              content = content.replace(csrTag, " 'wasm-eval'");
              content = content.replace(objSrcTag, "'none'");
            }
            console.info('Extension Version:', VERSION);
            content = content.replace(versionTag, VERSION);
            return Buffer.from(content);
          },
        },
        { from: 'node_modules/argon2-browser/dist/argon2.wasm', to: '.' },
      ],
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      VERSION: JSON.stringify(VERSION),
      COMMIT_SHA: JSON.stringify(COMMIT_SHA),
      BRANCH: JSON.stringify(BRANCH),
      'process.env.USERNAMES_ENABLED': JSON.stringify(process.env.USERNAMES_ENABLED || 'false'),
      'process.env.TEST_ENV': JSON.stringify(TEST_ENV ? 'true' : 'false'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      fetch: 'cross-fetch',
    }),
  ],
};

module.exports = smp.wrap(config);

if (IS_PROD) {
  module.exports.plugins.push(
    new CleanWebpackPlugin({ verbose: true, dry: false, cleanStaleWebpackAssets: false })
  );
}
if (ANALYZE_BUNDLE) {
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
