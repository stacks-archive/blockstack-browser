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
const Stylish = require('webpack-stylish')
const TerserPlugin = require('terser-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isWebapp = process.env.WEBAPP === 'true'
const isDev = !isProd
const analyze = !!process.env.ANALYZE

/**
 * Output config
 */
const output = {
  filename: isProd ? 'static/js/[name].[contenthash].js' : '[name].js',
  chunkFilename: isProd
    ? 'static/js/[name].[contenthash].chunk.js'
    : '[name].chunk.js',
  path: path.resolve(__dirname, 'build'),
  publicPath: '/',
  globalObject: 'self'
}

/**
 * Our Config Object
 */
module.exports = {
  stats: analyze ? 'normal' : 'none',
  mode: isProd ? 'production' : 'development',
  devtool: !isProd ? 'source-map' : 'source-map',
  entry: {
    main: [path.resolve(__dirname, 'app/js/index.js')]
  },
  node: {
    fs: 'empty',
    __filename: true
  },
  output,
  devServer: {
    open: false,
    writeToDisk: true,
    historyApiFallback: true,
    port: 3000,
    contentBase: path.resolve(__dirname, 'build'),
    /* watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }, */
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // comments: true,
            // compact: true,
            babelrc: true,
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(gif|png|webp|jpe?g|svg)$/i,
        exclude: [path.resolve(__dirname, 'app/fonts')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/images/[name].[ext]'
            }
          },
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
        include: [path.resolve(__dirname, 'app/fonts')],
        options: {
          name: 'static/fonts/[name][hash].[ext]'
        }
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
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      '@components': path.resolve(__dirname, 'app/js/components'),
      '@styled': path.resolve(__dirname, 'app/js/components/styled'),
      '@blockstack/ui': path.resolve(__dirname, 'app/js/components/ui'),
      '@ui/components': path.resolve(
        __dirname,
        'app/js/components/ui/components'
      ),
      '@ui/containers': path.resolve(
        __dirname,
        'app/js/components/ui/containers'
      ),
      '@ui/common': path.resolve(__dirname, 'app/js/components/ui/common'),
      '@images': path.resolve(__dirname, 'app/images'),
      log4js: path.resolve(__dirname, 'app/js/logger.js')
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
        sourceMap: false,
        cache: true,
        exclude: /[\\/]node_modules[\\/]/,
        terserOptions: {
          mangle: {
            // https://github.com/bitcoinjs/bitcoinjs-lib/issues/998
            reserved: ['BigInteger', 'ECPair', 'Point']
          }
        }
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
    new Stylish(),
    new WebpackBar({
      color: '#9E5FC1',
      minimal: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.WEBAPP': JSON.stringify(isWebapp),
      'process.env.DEBUG_LOGGING': JSON.stringify(process.env.DEBUG_LOGGING)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedChunksPlugin(chunk => {
      // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      // https://github.com/webpack/webpack/issues/1315#issuecomment-386267369
      if (chunk.name) {
        return chunk.name
      }
      // eslint-disable-next-line no-underscore-dangle
      return [...chunk._modules]
        .map(m =>
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
    })
  ]
    .concat(
      isProd
        ? [
            new workboxPlugin.GenerateSW({
              swDest: 'static/js/sw.js',
              precacheManifestFilename:
                'static/js/wb-manifest.[manifestHash].js',
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
            })
          ]
        : []
    )
    .concat(analyze ? [new BundleAnalyzerPlugin()] : [])
}
