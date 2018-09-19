const path = require('path')
const webpack = require('webpack')
/**
 * Plugins
 */
const WebpackBar = require('webpackbar')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const ReactLoadablePlugin = require('react-loadable/webpack')
  .ReactLoadablePlugin
const Stylish = require('webpack-stylish')
const HSWP = require('hard-source-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const webpackServeWaitpage = require('webpack-serve-waitpage')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd
const analyze = !!process.env.ANALYZE

/**
 * Output config
 */
const output = {
  filename: isProd ? 'static/js/[name].[contenthash:8].js' : '[name].js',
  chunkFilename: isProd ? 'static/js/[name].[contenthash:8].chunk.js' : '[name].chunk.js',
  path: path.resolve(__dirname, 'build'),
  publicPath: '/',
  globalObject: 'self'
}

/**
 * Webpack Serve config
 *
 * We have this as a conditional because the webpack config object does not
 * accept the key 'serve' when building for production.
 */
const serve = isDev
  ? {
    serve: {
      content: [__dirname],
      devMiddleware: {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers':
            'X-Requested-With, content-type, Authorization'
        }
      },
      add: (app, middleware, options) => {
        const historyOptions = {}
        app.use(webpackServeWaitpage(options))
        /**
         * Essentially devServer.historyApiFallback = true
         */
        app.use(convert(history(historyOptions)))
      }
    }
  }
  : {}


/**
 * Our Config Object
 */
module.exports = {
  stats: analyze ? 'normal' : 'none',
  mode: isProd ? 'production' : 'development',
  devtool: !isProd ? 'cheap-module-source-map' : 'source-map',
  entry: {
    main: ['./app/js/index.js']
  },
  node: {
    fs: 'empty',
    __filename: true
  },
  output,
  ...serve,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: true,
            babelrc: true,
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(gif|png|webp|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-70',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
        include: [path.resolve(__dirname, 'app/fonts')]
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: 'workerize-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@components': './app/js/components',
      '@common': './app/js/common',
      '@styled': './app/js/components/styled',
      '@utils': './app/js/utils',
      '@blockstack/ui': './app/js/components/ui',
      '@ui/components': './app/js/components/ui/components',
      '@ui/containers': './app/js/components/ui/containers',
      '@ui/common': './app/js/components/ui/common',
      '@images': './app/images',
      log4js: './app/js/logger.js'
    }
  },
  optimization: {
    nodeEnv: JSON.stringify(process.env.NODE_ENV),
    minimize: !isDev,
    concatenateModules: !isDev,
    namedModules: true,
    runtimeChunk: !isDev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: analyze,
        cache: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'initial',
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          test: /[\\/]app[\\/]/,
          priority: -5,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new HSWP(),
    new Stylish(),
    new WebpackBar({
      color: '#9E5FC1',
      minimal: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      // https://github.com/webpack/webpack/issues/1315#issuecomment-386267369
      if (chunk.name) {
        return chunk.name
      }
      // eslint-disable-next-line no-underscore-dangle
      return [...chunk._modules]
        .map((m) =>
          path.relative(
            m.context,
            m.userRequest.substring(0, m.userRequest.lastIndexOf('.'))
          )
        )
        .join('_')
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new LodashModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'app/fonts',
        to: path.resolve(__dirname, 'build', 'static', 'fonts')
      },
      { from: 'app/public', to: path.resolve(__dirname, 'build') }
    ]),
    new HtmlWebPackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'app/public', 'index.html'),
      filename: path.resolve(__dirname, 'build', 'index.html'),
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
        minifyURLs: true
      }
    }),
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json'
    })
  ].concat(isProd ? [new workboxPlugin.GenerateSW({
    swDest: 'static/sw.js',
    importWorkboxFrom: 'local',
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: '/',
        handler: 'networkFirst',
        options: {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  })] : [])
    .concat(analyze ? [new BundleAnalyzerPlugin()] : [])

}
