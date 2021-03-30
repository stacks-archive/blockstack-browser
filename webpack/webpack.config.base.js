/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { version: _version } = require('../package.json');
const { execSync } = require('child_process');

// plugins
const WebpackBarPlugin = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { ESBuildPlugin } = require('esbuild-loader');

// utils
const getSegmentKey = () => {
  // Netlify sets CONTEXT=production for production releases.
  // https://docs.netlify.com/site-deploys/overview/#deploy-contexts
  if (process.env.CONTEXT === 'production') {
    return 'KZVI260WNyXRxGvDvsX4Zz0vhshQlgvE';
  }
  return 'Cs2gImUHsghl4SZD8GB1xyFs23oaNAGa';
};

const getBranch = () => {
  const branch = execSync(`git rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim();
  return branch;
};

const getCommit = () => {
  const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  return commit;
};

/**
 * For CI builds, we add a random number after the patch version.
 */
const getVersion = () => {
  const branch = getBranch();
  if (branch === 'main') return _version;
  return `${_version}.${Math.floor(Math.floor(Math.random() * 1000))}`;
};

const VERSION = getVersion();
const COMMIT_SHA = getCommit();
const BRANCH = getBranch();

const SRC_ROOT_PATH = path.join(__dirname, '../', 'src');
const DIST_ROOT_PATH = path.join(__dirname, '../', 'dist');
const NODE_ENV = process.env.NODE_ENV || 'development';
const WEB_BROWSER = process.env.WEB_BROWSER ? process.env.WEB_BROWSER : 'chrome';
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = !IS_DEV;

const ANALYZE_BUNDLE = process.env.ANALYZE === 'true';
const SEGMENT_KEY = process.env.SEGMENT_KEY || getSegmentKey();
const STATS_URL = process.env.STATS_URL || 'https://stats.blockstack.xyz';
const EXT_ENV = process.env.EXT_ENV || 'web';

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
    filename: () => {
      if (EXT_ENV === 'prod' || IS_DEV) {
        return '[name].js';
      }
      return '[name].[contenthash:8].js';
    },
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
                ['@babel/plugin-proposal-class-properties', { loose: true }],
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
    new ESBuildPlugin(),
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
            const fullVersion = getVersion();
            console.log('Extension Version:', fullVersion);
            content = content.replace(versionTag, fullVersion);
            return Buffer.from(content);
          },
        },
        { from: 'node_modules/argon2-browser/dist/argon2.wasm', to: '.' },
      ],
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      WEB_BROWSER: JSON.stringify(WEB_BROWSER),
      EXT_ENV: JSON.stringify(EXT_ENV),
      SEGMENT_KEY: JSON.stringify(SEGMENT_KEY),
      STATS_URL: JSON.stringify(STATS_URL),
      VERSION: JSON.stringify(VERSION),
      COMMIT_SHA: JSON.stringify(COMMIT_SHA),
      BRANCH: JSON.stringify(BRANCH),
      'process.env.USERNAMES_ENABLED': JSON.stringify(process.env.USERNAMES_ENABLED || 'false'),
      'process.env.NODE_ENV': `'${NODE_ENV}'`,
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
