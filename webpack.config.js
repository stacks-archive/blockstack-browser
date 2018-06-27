const HtmlWebPackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const isProd = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    main: ['./app/js/index.js']
  },
  node: {
    fs: 'empty'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: true
          }
        }
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
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
    alias: {
      '@components': './app/js/components',
      '@common': './app/js/common',
      '@styled': './app/js/components/styled',
      '@utils': './app/js/utils',
      '@blockstack/ui': './app/js/components/ui',
      '@ui/components': './app/js/components/ui/components',
      '@ui/containers': './app/js/components/ui/containers',
      '@ui/common': './app/js/components/ui/common',
      log4js: './app/js/logger.js'
    }
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ecma: 8,
          compress: {
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
            comments: false,
            // Turned on because emoji and regex are not minified properly using default
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
        vendors: {
          name: 'vendors',
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          test: /[\\/]src[\\/]/,
          priority: -5,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new WebpackBar({
      color: '#9E5FC1'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      filename: path.resolve(__dirname, 'build', 'index.html')
    }),
    new CopyWebpackPlugin([
      { from: 'app/images', to: 'images' },
      { from: 'app/assets' }
    ])
  ]
}

module.exports.serve = {
  content: ['app', 'build'],
  add: (app, middleware, options) => {
    const historyOptions = {
      // ... see: https://github.com/bripkens/connect-history-api-fallback#options
    }
    app.use(convert(history(historyOptions)))

    middleware.webpack()
    middleware.content()
  }
}
