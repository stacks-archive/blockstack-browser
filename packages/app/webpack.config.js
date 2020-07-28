/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CheckerPlugin = require('fork-ts-checker-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const { version } = require('./package.json');

/* eslint-enable @typescript-eslint/no-var-requires */

const getSegmentKey = () => {
  // Netlify sets CONTEXT=production for production releases.
  // https://docs.netlify.com/site-deploys/overview/#deploy-contexts
  if (process.env.CONTEXT === 'production') {
    return 'KZVI260WNyXRxGvDvsX4Zz0vhshQlgvE';
  }
  return 'Cs2gImUHsghl4SZD8GB1xyFs23oaNAGa';
};

const sourceRootPath = path.join(__dirname, 'src');
const distRootPath = path.join(__dirname, 'dist');
const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const webBrowser = process.env.WEB_BROWSER ? process.env.WEB_BROWSER : 'chrome';
const isDevelopment = process.env.NODE_ENV !== 'production';
const analyzeBundle = process.env.ANALYZE === 'true';
const segmentKey = process.env.SEGMENT_KEY || getSegmentKey();
const statsURL = process.env.STATS_URL || 'https://stats.blockstack.xyz';
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
    return nodeEnv === 'production' ? 'eval' : 'cheap-module-source-map';
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
    background: path.join(sourceRootPath, 'extension', 'background.ts'),
    inpage: path.join(sourceRootPath, 'extension', 'inpage.ts'),
    'message-bus': path.join(sourceRootPath, 'extension', 'content-scripts', 'message-bus.ts'),
    index: path.join(sourceRootPath, 'index.tsx'),
  },
  output: {
    path: distRootPath,
    chunkFilename: !isDevelopment
      ? '[name].[contenthash:8].chunk.js'
      : isDevelopment && '[name].chunk.js',
    filename: () => {
      if (extEnv === 'prod' || isDevelopment) {
        return '[name].js';
      }
      return '[name].[contenthash:8].js';
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.d.ts'],
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
              isDevelopment && extEnv === 'web' && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },
  node: {
    Buffer: true,
    BufferReader: true,
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
      chunks: ['index', 'common'],
      ...hmtlProdOpts,
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(sourceRootPath, '../', 'public', 'assets'),
        to: path.join(distRootPath, 'assets'),
        test: /\.(jpg|jpeg|png|gif|svg)?$/,
      },
      {
        from: path.join(sourceRootPath, 'manifest.json'),
        to: path.join(distRootPath, 'manifest.json'),
        toType: 'file',
        transform(content, path) {
          const csrTag = '<% DEV_CSR %>';
          const versionTag = '<% VERSION %>';
          content = content.toString();
          if (nodeEnv === 'development') {
            content = content.replace(csrTag, " 'unsafe-eval'");
          } else {
            content = content.replace(csrTag, '');
          }
          content = content.replace(versionTag, version);
          return Buffer.from(content);
        },
      },
    ]),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(nodeEnv),
      WEB_BROWSER: JSON.stringify(webBrowser),
      EXT_ENV: JSON.stringify(extEnv),
      SEGMENT_KEY: JSON.stringify(segmentKey),
      STATS_URL: JSON.stringify(statsURL),
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
    isDevelopment &&
      extEnv === 'web' &&
      new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),
  ].filter(Boolean),
};

if (process.env.EXT_ENV === 'watch') {
  module.exports.watch = true;
  module.exports.plugins.push(
    new ChromeExtensionReloader({
      port: 9128,
      reloadPage: true,
      entries: {
        background: 'background',
        options: 'index',
        contentScript: ['message-bus'],
      },
    })
  );
}

if (nodeEnv === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin({ verbose: true, dry: false }));
}
if (analyzeBundle) {
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
