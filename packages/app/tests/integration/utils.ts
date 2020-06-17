export { Browser } from 'playwright-core';
import { Page } from 'playwright-core';

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
      resolve();
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
        resolve();
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
