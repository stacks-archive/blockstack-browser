const path = require('path');
const url = require('url');
const helpers = require('./helpers');

const BROWSERSTACK_LOOPBACK_HOST = 'bs-local.com';
const BROWSERSTACK_HUB_URL = 'http://hub-cloud.browserstack.com/wd/hub';

const config = {
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
};

/**
 * Note: This config has to be loaded immediately and synchronously since the config values
 * are used for generating the Mocha test suites, and Mocha requires tests to be defined 
 * immediately and synchronously on script load. 
 */
(function initializeConfig() {

  // Determine which browser host endpoint to run tests against.
  const E2E_BROWSER_HOST = 'E2E_BROWSER_HOST';
  const PROD_HOST = 'https://browser.blockstack.org';
  config.browserHostUrl = process.env[E2E_BROWSER_HOST] || PROD_HOST;
  if (!process.env[E2E_BROWSER_HOST]) {
    console.warn(`WARNING: The browser host url was not set via the ${E2E_BROWSER_HOST} env var.. running tests against the production endpoint "${PROD_HOST}"`);
  } else if (config.browserHostUrl.startsWith('http:') || config.browserHostUrl.startsWith('https:')) {
    console.log(`Running e2e tests against endpoint ${config.browserHostUrl}`);
  } else {
    config.serveDirectory = path.resolve(config.browserHostUrl);
    config.browserHostUrl = 'http://localhost:5757';
    console.log(`Local static web server will be started at ${config.browserHostUrl} for directory ${config.serveDirectory}`);
  }

  // Check environment vars for BrowserStack usage settings.
  const USE_BROWSERSTACK = 'USE_BROWSERSTACK';
  const BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';
  config.browserStack.enabled = process.env[USE_BROWSERSTACK] && process.env[USE_BROWSERSTACK] !== 'false';
  if (config.browserStack.enabled) {
    config.browserStack.hubUrl = BROWSERSTACK_HUB_URL;
    const browserstackAuth = process.env[BROWSERSTACK_AUTH];
    if (!browserstackAuth) {
      const errMsg = `The BrowserStack auth must be set as environment variables. Use the format \`${BROWSERSTACK_AUTH}="user:key"\``;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    // Auth string formatted as "user:key"
    [config.browserStack.user, config.browserStack.key] = browserstackAuth.trim().split(/:(.+)/);
  }

  /**
   * If the auth-browser host endpoint is set to localhost and BrowserStack testing is enabled
   * then BrowserStack Local must be used.
   * @see https://www.npmjs.com/package/browserstack-local
   * @see https://www.browserstack.com/local-testing
   */
  if (config.browserStack.enabled) {
    const parsedUrl = url.parse(config.browserHostUrl);
    config.browserStack.localEnabled = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
    config.browserStack.localIdentifier = helpers.getRandomString(20);
    
    /** 
     * Check if the host port is the expected port that is supported by BrowserStack Safari environments.
     * @see https://www.browserstack.com/question/664
     */
    const expectedPort = '5757';
    if (config.browserStack.localEnabled && parsedUrl.port !== expectedPort) {
      console.warn(`WARNING: BrowserStack Local is enabled but the host port is ${parsedUrl.port} rather than the expected port ${expectedPort}. ` + 
        `This may cause problems for BrowserStack Safari environments.. for more information see https://www.browserstack.com/question/664`);
    }
  }

  /**
   * If BrowserStack is enabled, then include their 'fast-selenium.js' script.
   * @see https://www.browserstack.com/automate/node#add-on
   * @see https://raw.githubusercontent.com/browserstack/fast-selenium-scripts/master/node/fast-selenium.js
   */
  if (config.browserStack.enabled) {
    require('./fast-selenium');
  }

  /**
   * If BrowserStack Local is enabled then the host url needs swapped from localhost to bs-local.com
   * This required due to a technical limitation with BrowserStack's Safari environments.
   * @see https://www.browserstack.com/question/759
   */
  if (config.browserStack.localEnabled) {
    const parsedUrl = url.parse(config.browserHostUrl);
    [ parsedUrl.hostname, parsedUrl.host ] = [ BROWSERSTACK_LOOPBACK_HOST, undefined ];
    config.browserHostUrl = url.format(parsedUrl);
    config.loopbackHost = BROWSERSTACK_LOOPBACK_HOST;
  }

  // Trim trailing url slash(es).
  config.browserHostUrl = config.browserHostUrl.replace(/\/+$/, "");

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
