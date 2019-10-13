const path = require('path');
const url = require('url');
const glob = require('glob');
const protractor = require.resolve('protractor');

const nodeModules = protractor.substring(0, protractor.lastIndexOf('node_modules') + 'node_modules'.length);
const seleniumJar = glob.sync(`${nodeModules}/protractor/**/selenium-server-standalone-*.jar`).pop();

const helpers = require('./src/utils/helpers');

const BROWSERSTACK_LOOPBACK_HOST = 'bs-local.com';
const BROWSERSTACK_HUB_URL = 'http://hub-cloud.browserstack.com/wd/hub';
const browserStackEnvironments = require('./src/utils/browserstack-environments');

const config = {
  params: {
    browserHostUrl: '',
    browserStack: {
      enabled: false,
      user: '',
      key: '',
      localEnabled: false,
      localIdentifier: '',
      hubUrl: ''
    },
    serveDirectory: '',
    loopbackHost: 'localhost'
  },
  // https://github.com/angular/protractor/blob/master/docs/timeouts.md
  allScriptsTimeout: 200000,
  getPageTimeout: 60000,
  SELENIUM_PROMISE_MANAGER: false,

  // Load Serenity/JS
  framework: 'custom',
  frameworkPath: require.resolve('serenity-js'),

  specs: ['features/**/*.feature'],

  cucumberOpts: {
    require: ['features/**/*.ts'],
    format: 'pretty',
    compiler: 'ts:ts-node/register'
  },
  maxSessions: 1,
  commonCapabilities:{},
};

/**
 * Note: This config has to be loaded immediately and synchrMochaonously since the config values
 * are used for setting up the env to run the test suites.
 */
(function initializeConfig() {
  // Determine which browser host endpoint to run tests against.
  const E2E_BROWSER_HOST = 'E2E_BROWSER_HOST';
  const PROD_HOST = 'https://browser.blockstack.org';
  config.params.browserHostUrl = process.env[E2E_BROWSER_HOST] || PROD_HOST;
  if (!process.env[E2E_BROWSER_HOST]) {
    console.warn(`WARNING: The browser host url was not set via the ${E2E_BROWSER_HOST} env var.. running tests against the production endpoint "${PROD_HOST}"`);
  } else if (config.params.browserHostUrl.startsWith('http:') || config.params.browserHostUrl.startsWith('https:')) {
    console.log(`Running e2e tests against endpoint ${config.params.browserHostUrl}`);
  } else {
    config.params.serveDirectory = path.resolve(config.params.browserHostUrl);
    config.params.browserHostUrl = 'http://localhost:5757';
    console.log(`Local static web server will be started at ${config.params.browserHostUrl} for directory ${config.params.serveDirectory}`);
  }

  // Check environment vars for BrowserStack usage settings.
  const USE_BROWSERSTACK = 'USE_BROWSERSTACK';
  const BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';
  config.params.browserStack.enabled = !helpers.isFalsy(process.env[USE_BROWSERSTACK]);
  if (config.params.browserStack.enabled) {
    config.params.browserStack.hubUrl = BROWSERSTACK_HUB_URL;
    const browserstackAuth = process.env[BROWSERSTACK_AUTH];
    if (!browserstackAuth) {
      const errMsg = `The BrowserStack auth must be set as environment variables. Use the format \`${BROWSERSTACK_AUTH}="user:key"\``;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    // Auth string formatted as "user:key"
    [config.params.browserStack.user, config.params.browserStack.key] = browserstackAuth.trim().split(/:(.+)/);
    [config.browserstackUser, config.browserstackKey] = browserstackAuth.trim().split(/:(.+)/);
    config.commonCapabilities = {
      'browserstack.user': config.params.browserStack.user,
      'browserstack.key': config.params.browserStack.key,
      'browserstack.console': 'verbose',
      'browserstack.debug': 'true'
    };
    config.multiCapabilities = browserStackEnvironments;
  }

  /**
   * If the auth-browser host endpoint is set to localhost and BrowserStack testing is enabled
   * then BrowserStack Local must be used.
   * @see https://www.npmjs.com/package/browserstack-local
   * @see https://www.browserstack.com/local-testing
   */
  if (config.params.browserStack.enabled) {
    const RANDOM_STRING = 'RANDOM_STRING';
    const parsedUrl = url.parse(config.params.browserHostUrl);
    config.params.browserStack.localEnabled = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
    config.params.browserStack.localIdentifier = process.env[RANDOM_STRING];

    /**
     * Check if the host port is the expected port that is supported by BrowserStack Safari environments.
     * @see https://www.browserstack.com/question/664
     */
    const expectedPort = '5757';
    if (config.params.browserStack.localEnabled && parsedUrl.port !== expectedPort) {
      console.warn(`WARNING: BrowserStack Local is enabled but the host port is ${parsedUrl.port} rather than the expected port ${expectedPort}. ` +
        `This may cause problems for BrowserStack Safari environments.. for more information see https://www.browserstack.com/question/664`);
    }

    config.commonCapabilities = {
      'browserstack.console': 'verbose',
      'browserstack.debug': 'true'
    };
  }

  /**
   * If BrowserStack is enabled, then include their 'fast-selenium.js' script.
   * @see https://www.browserstack.com/automate/node#add-on
   * @see https://raw.githubusercontent.com/browserstack/fast-selenium-scripts/master/node/fast-selenium.js
   */
  if (config.params.browserStack.enabled) {
    require('./src/utils/fast-selenium');
  }

  /**
   * If BrowserStack Local is enabled then the host url needs swapped from localhost to bs-local.com
   * This required due to a technical limitation with BrowserStack's Safari environments.
   * @see https://www.browserstack.com/question/759
   */
  if (config.params.browserStack.localEnabled) {
    const parsedUrl = url.parse(config.params.browserHostUrl);
    [parsedUrl.hostname, parsedUrl.host] = [BROWSERSTACK_LOOPBACK_HOST, undefined];
    config.params.browserHostUrl = url.format(parsedUrl);
    config.params.loopbackHost = BROWSERSTACK_LOOPBACK_HOST;

    config.commonCapabilities = {
      'browserstack.console': 'verbose',
      'browserstack.local': 'true',
      'browserstack.debug': 'true',
      'browserstack.localIdentifier': config.params.browserStack.localIdentifier
    };
  }

  if (!config.params.browserStack.enabled) {
    const browsers = [{
      'browserName': 'chrome'
    }, {
      'browserName': 'firefox'
    }];

    if (process.platform === 'darwin') {
      browsers.push({
        'browserName': 'safari'
      });
    } else if (process.platform === 'win32') {
      browsers.push({
        'browserName': 'edge'
      });
    }
    config.multiCapabilities = browsers;
    config.seleniumServerJar = seleniumJar;
  }

  if (config.params.browserStack.enabled) {
    // Code to support common capabilities
    config.multiCapabilities.forEach(function (caps) {
      for (let i in config.commonCapabilities) caps[i] = caps[i] || config.commonCapabilities[i]
    });
  }

  // Trim trailing url slash(es).
  config.params.browserHostUrl = config.params.browserHostUrl.replace(/\/+$/, '');
  const CUCUMBER_TAG = 'CUCUMBER_TAG';
  if (process.env[E2E_BROWSER_HOST]) {
    config.cucumberOpts.tags = process.env[CUCUMBER_TAG];
  }
  return config;
})();


// Prevent the error message
// "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added. Use emitter.setMaxListeners() to increase limit"
// We don't care about this..
// https://github.com/SeleniumHQ/selenium/issues/6812
// https://github.com/nightwatchjs/nightwatch/issues/408
process.setMaxListeners(0);
require('events').EventEmitter.defaultMaxListeners = 1000;

module.exports = config;

