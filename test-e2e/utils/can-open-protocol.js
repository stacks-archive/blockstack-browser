const { execSync } = require('child_process');

/** @type {boolean} */
let cachedValue = undefined;

/**
 * Queries the local system for the ability to open the `blockstack:` protocol.
 * As in, determines if the native Blockstack Browser app is installed.
 * Note: Currently only supported on MacOS. Always returns false on other systems. 
 * @returns {boolean} Returns true if the protocol handler is registered.
 */
function canOpenProtocol() {
  if (cachedValue !== undefined) {
    return cachedValue;
  }
  return cachedValue = (() => {
    try {
      switch (process.platform) {
        case 'darwin': return canOpenProtocolDarwin();
        default: return false;
      }
    } catch (error) {
      console.log(`Error trying to detect protocol handler: ${error}`);
      return false;
    }
  })();
}

function canOpenProtocolDarwin() {
  /**
   * For more details..
   * @see https://superuser.com/a/413606
   * @see https://github.com/nwjs/nw.js/issues/951#issuecomment-130117544
   */
  const launchServicesDir = '/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support';
  const stdout = execSync(`${launchServicesDir}/lsregister -dump`, { encoding: 'utf8' });
  const hasHandler = /bindings:\s+blockstack:/.test(stdout);
  return hasHandler;
}

module.exports = canOpenProtocol;
