
import { execSync } from 'child_process';

/** @type {boolean} */
let cachedValue = undefined;

/**
 * Queries the local system for the ability to open the `blockstack:` protocol.
 * As in, determines if the native Blockstack Browser app is installed.
 * Note: Currently only supported on MacOS. Always returns false on other systems. 
 * @returns {boolean} Returns true if the protocol handler is registered.
 */

export class Canopenprotocol{ 

        static async canOpenProtocol() {
        if (cachedValue !== undefined) {
            return cachedValue;
        }
        return cachedValue = (() => {
            try {
            switch (process.platform) {
                case 'darwin': return Canopenprotocol;
                default: return false;
            }
            } catch (error) {
            console.log(`Error trying to detect protocol handler: ${error}`);
            return false;
            }
        })();
        }

        /**
         * For more details..
         * @see https://superuser.com/a/413606
         * @see https://github.com/nwjs/nw.js/issues/951#issuecomment-130117544
         */

        static async canOpenProtocolDarwin() {
            const launchServicesDir = '/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support';

            const lsregisterDump = () => execSync(`${launchServicesDir}/lsregister -dump`, { encoding: 'utf8' });

            const checkIsHandlerRegistered = async () => {
                const stdout = lsregisterDump();
                const hasHandler = /bindings:\s+blockstack:/.test(stdout);
                return hasHandler;
            };

            const clearRegisteredHandlers = async () => {
                const stdout = lsregisterDump();
                const pathRegex = /path:\s+(.*?)\/Blockstack.app\n/g;
                let match = null;
// tslint:disable-next-line: no-conditional-assignment
                while (match = pathRegex.exec(stdout)) {
                const appPath = `${match[1]}/Blockstack.app`
                await execSync(`${launchServicesDir}/lsregister -u "${appPath}"`, { encoding: 'utf8' });
                }
            };

            const isHandlerRegistered = checkIsHandlerRegistered();
            if (isHandlerRegistered) {
                // Try clearing out the handler registrations
                console.warn('Notice: Clearing the native blockstack protocol handler from the local system. To restore, just re-open Blockstack.app');
                clearRegisteredHandlers();
                // Then check again and return the result.
                const isStillRegistered = checkIsHandlerRegistered();
                if (isStillRegistered) {
                console.warn('Was unable to clear the native protocol handler registration from the system.')
                }
                return isStillRegistered;
            } else {
                return false;
            }

            }

}