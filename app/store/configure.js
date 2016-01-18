if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configure/production')
} else {
  module.exports = require('./configure/development')
}