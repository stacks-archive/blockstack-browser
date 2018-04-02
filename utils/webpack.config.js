/**
 * Webpack Resolve
 *
 * This file is to allow for certain IDEs to understand the module path mappings we have in .babelrc
 * Eventually this will be the actual config for when we switch over to webpack for packaging
 *
 */
const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './../app/js/components'),
      '@styled': path.resolve(__dirname, './../app/js/components/styled'),
      '@utils': path.resolve(__dirname, './../app/js/utils')
    }
  }
}
