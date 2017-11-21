/* global before, after*/
'use strict'

require('colors')
var wd = require('wd')
var sauceConnectLauncher = require('sauce-connect-launcher')

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()
var request = require('request').defaults({json: true})

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness

var SELENIUM_HUB = 'http://localhost:4444/wd/hub/status'

var username = process.env.SAUCE_USERNAME
var accessKey = process.env.SAUCE_ACCESS_KEY
var tunnelId = process.env.TRAVIS_JOB_NUMBER || 'tunnel-' + Date.now()

// process.env.TEST_CLIENT is a colon seperated list of
// (saucelabs|selenium):browserName:browserVerion:platform
var tmp = (process.env.TEST_CLIENT || 'selenium:chrome').split(':')
var client = {
  runner: tmp[0] || 'selenium',
  browser: tmp[1] || 'chrome',
  version: tmp[2] || null, // Latest
  platform: tmp[3] || null
}

wd.configureHttp({timeout: 180000}) // 3 minutes

before(function (done) {
  var self = this
  this.timeout(180000)

  var retries = 0
  var started = function () {
    if (++retries > 60) {
      done('Unable to connect to selenium')
      return
    }

    if (client.runner === 'saucelabs') {
      startSauceConnect(startTest)
    } else {
      startSelenium(startTest)
    }

    function startSelenium (callback) {
      request(SELENIUM_HUB, function (error, resp) {
        if (error) throw error

        if (resp && resp.statusCode === 200) {
          self.browser = wd.promiseChainRemote()
          callback()
        } else {
          console.log('.')
          setTimeout(started, 1000)
        }
      })
    }

    function startSauceConnect (callback) {
      console.log('connecting to saucelabs')
      var options = {
        username: username,
        accessKey: accessKey,
        tunnelIdentifier: tunnelId
      }

      sauceConnectLauncher(options, function (err, process) {
        if (err) {
          console.error('Failed to connect to saucelabs')
          console.error(err)
          return process.exit(1)
        }
        self.browser = wd.promiseChainRemote('localhost', 4445, username, accessKey)
        callback()
      })
    }

    function startTest () {
      // optional extra logging
      self.browser.on('status', function (info) {
        console.log(info.cyan)
      })
      self.browser.on('command', function (eventType, command, response) {
        if (eventType === 'RESPONSE') {
          return console.log(' <', (response || 'ok').grey)
        }
        console.log(' > ' + eventType.cyan, command)
      })

      var options = {
        browserName: client.browser,
        version: client.version,
        platform: client.platform,
        tunnelTimeout: 30 * 60 * 1000,
        name: client.browser + ' - ' + tunnelId,
        'max-duration': 60 * 45,
        'command-timeout': 599,
        'idle-timeout': 599,
        'tunnel-identifier': tunnelId
      }

      self.browser.init(options, done)
    }
  }

  started()
})

after(function () {
  return this.browser.quit()
})
