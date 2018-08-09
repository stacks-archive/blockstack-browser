const path = require('path')
const webpack = require('webpack')
const ReactLoadablePlugin = require('react-loadable/webpack')
  .ReactLoadablePlugin

/**
 * Plugins
 */
const WebpackBar = require('webpackbar')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const workboxPlugin = require('workbox-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

/**
 * Output config
 */
const output = {
  filename: 'js/[name].[hash:8].js',
  chunkFilename: 'js/[name].[hash:8].chunk.js',
  path: path.resolve(__dirname, 'build'),
  publicPath: '/'
}

/**
 * Production changes
 *
 * We change path/publicPath in prod because having
 * them in dev affects webpack-dev-server
 */
if (isProd) {
  output.path = path.resolve(__dirname, 'build/static')
  output.publicPath = '/static/'
}

/**
 * Our Config Object
 */
module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: !isProd ? 'cheap-module-source-map' : false,
  entry: {
    main: ['./app/js/index.js']
  },
  node: {
    fs: 'empty'
  },
  output,
  devServer: {
    open: true,
    historyApiFallback: true,
    port: 3000,
    contentBase: path.resolve(__dirname, 'build'),
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
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
              },
              webp: {
                quality: 60
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
    minimize: isProd,
    nodeEnv: isProd ? 'production' : 'development',
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          parse: {
            // we want uglify-js to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
          },
          mangle: {
            safari10: true,
            reserved: ['BigInteger', 'ECPair', 'Point']
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      name: false,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          reuseExistingChunk: true
        },
        vendors: {
          name: 'vendors',
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new WebpackBar({
      color: '#9E5FC1',
      minimal: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
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
    }),
    new workboxPlugin.GenerateSW({
      swDest: '../sw.js',
      clientsClaim: true,
      skipWaiting: true,
      include: [/\.html$/, /\.js$/, /\.webp/]
    })
  ]
}
