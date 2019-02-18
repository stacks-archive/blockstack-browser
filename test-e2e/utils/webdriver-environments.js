const { WebDriver, Builder, By, Key, until, logging } = require('selenium-webdriver');
const chromeOptions = require('selenium-webdriver/chrome').Options;
const firefoxOptions = require('selenium-webdriver/firefox').Options;
const path = require('path');
const fs = require('fs');
const os = require('os');
const ExtendedWebDriver = require('./ExtendedWebDriver');
const browserStackEnvironments = require('./browserstack-environments');
const helpers = require('./helpers');
const config = require('./config');

function getLoggingPrefs() {
  const prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
  return prefs;
};

/**
 * @typedef {Object} TestEnvironment
 * @property {string} description Human-readable name of the operating system & web browser.
 * @property {string} browserName Lowercase name of web browser (for mobile this can be 'android' or 'iphone').
 * @property {Promise<ExtendedWebDriver>} createDriver Promise that resolves to a ready-to-use WebDriver instance.
 */

/**
 * @generator
 * @param {string} user BrowserStack user credential.
 * @param {string} key BrowserStack key credential.
 * @yields {TestEnvironment}
 */
function* getBrowserstackEnvironments(user, key) {
  for (let capability of browserStackEnvironments) {
    capability = Object.assign(capability, {
      'browserstack.user': user,
      'browserstack.key': key,
      'browserstack.console': 'verbose'
    });
    if (config.browserStack.localEnabled) {
      capability['browserstack.local'] = 'true';
    }
    yield {
      description: capability.desc,
      browserName: capability.browserName.toLowerCase(),
      createDriver: async () => {
        const driver = await new Builder()
          .usingServer(config.browserStack.hubUrl)
          .withCapabilities(capability)
          .setLoggingPrefs(getLoggingPrefs())
          .build();
        return new ExtendedWebDriver(driver);
      }
    };
  }
}

/**
 * Generates test environments for the local machine. Always includes 'chrome' and 'firefox'.
 * If on macOS then also includes 'safari'. If on Windows then also includes 'edge'. 
 * @generator
 * @yields {TestEnvironment}
 */
function* getLocalSystemBrowserEnvironments() {
  const browsers = ['firefox', 'chrome'];

  // Ensure the browser webdriver binaries are added to env path
  require('chromedriver');
  require('geckodriver');

  if (process.platform === 'darwin') {
    browsers.push('safari');
  } else if (process.platform === 'win32') {
    browsers.push('edge');
  }

  // Disable Chrome's protocol handler for `blockstack:` in case the native browser is installed on this machine
  // https://stackoverflow.com/a/41299296/794962
  // Note: This ability has since been disabled by Chrome, there is no way to hide the prompt.
  // https://github.com/chromium/chromium/blob/5f0fb8c9021d25d1fadc1ae3706b4790dbcded5a/chrome/browser/external_protocol/external_protocol_handler.cc#L194
  const chromeOpts = new chromeOptions()
    .setUserPreferences({protocol_handler: { excluded_schemes: { 'blockstack': true } } })
    .setLoggingPrefs(getLoggingPrefs());

 // Disable Firefox's protocol handler for `blockstack:` in case the native browser is installed on this machine
 // https://stackoverflow.com/a/53154527/794962
  const firefoxOpts = (() => {
    const handlers = '{"defaultHandlersVersion":{"en-US":4},"schemes":{"blockstack":{"action":2,"handlers":[{"name":"None","uriTemplate":"#"}]}}}';
    const tempDir = path.resolve(os.tmpdir(), helpers.getRandomString());
    fs.mkdirSync(tempDir);
    fs.writeFileSync(path.resolve(tempDir, 'handlers.json'), handlers);
    return new firefoxOptions().setProfile(tempDir);
  })();

  for (let browser of new Set(browsers)) {
    yield {
      description: `${process.platform} ${browser}`,
      browserName: browser.toLowerCase(),
      createDriver: async () => {        
        const driver = await new Builder()
          .forBrowser(browser)
          .setChromeOptions(chromeOpts)
          .setFirefoxOptions(firefoxOpts)
          .build();
        return new ExtendedWebDriver(driver);
      }
    };
  }
}


module.exports.getTestEnvironments = function () {
  if (config.browserStack.enabled) {
    return getBrowserstackEnvironments(config.browserStack.user, config.browserStack.key);
  } else {
    return getLocalSystemBrowserEnvironments();
  }
};
