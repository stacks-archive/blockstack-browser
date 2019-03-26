const { promisify } = require('util');
const request = promisify(require('request'));
const config = require('./config');

/**
 * Uses a legacy BrowserStack rest API endpoint to retrieve the console logs for a given session. 
 * This method doesn't need the buildID and so doesn't require the hacky regex required to extract it.
 * However, the log endpoint it uses is deprecated and probably won't work in the future. 
 * @param {string} sessionID The WebDriver Session ID.
 * @returns {Promise<string>} The console log file dump.
 */
async function getSessionConsoleLogsLegacy(sessionID) {
  try { 
    const sessionInfoUrl = `https://api.browserstack.com/automate/sessions/${sessionID}.json`;
    const sessionInfoRequest = await request({ 
      url: sessionInfoUrl, 
      auth: { user: config.browserStack.user, pass: config.browserStack.key, sendImmediately: true },
      followRedirect: false,
    });
    const sessionInfo = JSON.parse(sessionInfoRequest.body).automation_session;
    const consoleLogUrl = sessionInfo.browser_console_logs_url;
    const logRequest = await request({ 
      url: consoleLogUrl,
      followRedirect: false,
    });
    if (logRequest.statusCode !== 200) {
      throw new Error(`${logRequest.statusCode}: ${logRequest.statusMessage}`);
    }
    const logBody = logRequest.body;
    return logBody;
  } catch (error) {
    console.log(`Error getting BrowserStack session console.log: ${error}`);
  }
}

/**
 * Uses the BrowserStack rest API to retrieve the console logs for a given session. 
 * @param {string} sessionID The WebDriver Session ID.
 * @returns {Promise<string>} The console log file dump.
 */
async function getSessionConsoleLogs(sessionID) {
  const sessionInfoUrl = `https://api.browserstack.com/automate/sessions/${sessionID}.json`;
  const sessionInfoRequest = await request({ 
    url: sessionInfoUrl, 
    auth: { user: config.browserStack.user, pass: config.browserStack.key, sendImmediately: true },
    followRedirect: false
  });
  const sessionInfo = JSON.parse(sessionInfoRequest.body).automation_session;
  // This seems to be the best way to determine the BuildID
  const buildID = sessionInfo.logs.match("builds/([a-z0-9]+)/sessions")[1];
  const consoleLogUrl = `https://api.browserstack.com/automate/builds/${buildID}/sessions/${sessionID}/consolelogs`;
  const logRequest = await request({ 
    url: consoleLogUrl, 
    auth: { user: config.browserStack.user, pass: config.browserStack.key, sendImmediately: true },
    followRedirect: false,
    headers: {
      // Required by BrowserStack's API server..
      'Accept': '*/*',
    }
  });
  if (logRequest.statusCode !== 200) {
    throw new Error(`${logRequest.statusCode}: ${logRequest.statusMessage}`);
  }
  const logBody = logRequest.body;
  return logBody;
}

module.exports = { getSessionConsoleLogs, getSessionConsoleLogsLegacy };
