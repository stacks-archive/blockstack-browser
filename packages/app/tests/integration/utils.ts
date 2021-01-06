export { Browser } from 'playwright-core';
import { Page } from 'playwright-core';
import { BrowserType, WebKitBrowser } from 'playwright-core/types/types';
import { devices, chromium } from 'playwright';

type Device = typeof devices['iPhone 11 Pro'];

export const environments: [BrowserType<WebKitBrowser>, Device | undefined][] = [
  [chromium, undefined],
];

if (process.env.CI) {
  // environments.push([webkit, undefined]);
  // environments.push([webkit, devices['iPhone 11 Pro']]);
  // environments.push([chromium, devices['Pixel 2']]);
  // Playwright has issues with Firefox and multi-page
  // environments.push([firefox, undefined]);
}

export const SECRET_KEY =
  'invite helmet save lion indicate chuckle world pride afford hard broom draft';

export function createTestSelector(name: string) {
  return `[data-test="${name}"]`;
}

export function randomString(len: number) {
  const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export const wait = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};

export const debug = async (page: Page) => {
  // this.setTimeout(345600000);
  // Run a debugger (in case Playwright has been launched with `{ devtools: true }`)
  await page.evaluate(() => {
    // eslint-disable-next-line no-debugger
    debugger;
  });

  const KEYS = {
    CONTROL_C: '\u0003',
    CONTROL_D: '\u0004',
    ENTER: '\r',
  };
  console.log('\n\n🕵️‍  Code is paused, press enter to resume');
  // Run an infinite promise
  return new Promise(resolve => {
    const { stdin } = process;
    const listening = stdin.listenerCount('data') > 0;
    const onKeyPress = (key: string): void => {
      if (key === KEYS.CONTROL_C || key === KEYS.CONTROL_D || key === KEYS.ENTER) {
        stdin.removeListener('data', onKeyPress);
        if (!listening) {
          if (stdin.isTTY) {
            stdin.setRawMode(false);
          }
          stdin.pause();
        }
        resolve(true);
      }
    };
    if (!listening) {
      if (stdin.isTTY) {
        stdin.setRawMode(true);
      }
      stdin.resume();
      stdin.setEncoding('utf8');
    }
    stdin.on('data', onKeyPress);
  });
};
