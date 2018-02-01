var goodConsole = require('good-console')
module.exports = {
  opsInterval: 1000,
  reporters: [{
    reporter: goodConsole,
    events: {
      log: '*',
      request: '*',
      response: '*'
    }
  }]
}
