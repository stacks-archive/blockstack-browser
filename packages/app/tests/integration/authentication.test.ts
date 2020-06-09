import { validateMnemonic, wordlists, generateMnemonic } from 'bip39';
import { devices, BrowserContext } from 'playwright-core';
import { DeviceDescriptor } from 'playwright-core/lib/types';
import { chromium, webkit, firefox } from 'playwright';
import { DemoPage } from './page-objects/demo.page';
import { randomString, Browser } from './utils';
import { AuthPage } from './page-objects/auth.page';
import { Wallet } from '@blockstack/keychain';
import { ChainID } from '@blockstack/stacks-transactions';

const SECRET_KEY = 'invite helmet save lion indicate chuckle world pride afford hard broom draft';
const WRONG_SECRET_KEY = 'invite helmet save lion indicate chuckle world pride afford hard broom yup';
const WRONG_MAGIC_RECOVERY_KEY =
  'KDR6O8gKXGmstxj4d2oQqCi806M/Cmrbiatc6g7MkQQLVreRA95IoPtvrI3N230jTTGb2XWT5joRFKPfY/2YlmRz1brxoaDJCNS4z18Iw5Y=';
const WRONG_PASSWORD = 'sstest202020';
const CORRECT_PASSWORD = 'test202020';
const USERNAME = 'thisis45678';

const SEED_PHRASE_LENGTH = 12;

const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

type BrowserLauncher = typeof chromium | typeof webkit | typeof firefox;

const environments: [BrowserLauncher, DeviceDescriptor | undefined][] = [[chromium, undefined]];
// const environments: [BrowserLauncher, DeviceDescriptor | undefined][] = [[webkit, undefined]];

if (process.env.CI_TEST_DEVICES) {
  // environments.push([firefox, undefined]);
  environments.push([webkit, devices['iPhone 11 Pro']]);
  environments.push([chromium, devices['Pixel 2']]);
}

jest.retryTimes(process.env.CI ? 3 : 1);
describe.each(environments)('auth scenarios - %o %o', (browserType, deviceType) => {
  let browser: Browser;
  let context: BrowserContext;
  let demoPage: DemoPage;
  beforeEach(async () => {
    browser = await browserType.launch();
    if (deviceType) {
      context = await browser.newContext({
        viewport: deviceType.viewport,
        userAgent: deviceType.userAgent,
      });
    } else {
      context = await browser.newContext();
    }
    demoPage = await DemoPage.init(context);
  }, 10000);

  afterEach(async () => {
    try {
      await browser.close();
    } catch (error) {
      // console.error(error);
    }
  });

  it('creating a successful account', async () => {
    await demoPage.openConnect();
    await demoPage.clickConnectGetStarted();
    const auth = await AuthPage.getAuthPage(browser);
    const authPage = auth.page;

    await authPage.waitFor(auth.$textareaReadOnlySeedPhrase);

    const $secretKeyEl = await authPage.$(auth.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = (await authPage.evaluate(el => el.textContent, $secretKeyEl)) as string;
    expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
    expect(validateMnemonic(secretKey)).toBeTruthy();

    await authPage.click(auth.$buttonCopySecretKey);

    await authPage.waitFor(auth.$buttonHasSavedSeedPhrase);
    await authPage.click(auth.$buttonHasSavedSeedPhrase);

    const $usernameInputElement = await authPage.$(auth.$inputUsername);
    if (!$usernameInputElement) {
      throw 'Could not find username field';
    }
    await authPage.type(
      auth.$inputUsername,
      `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`
    );
    await authPage.click(auth.$buttonUsernameContinue);

    const authResponse = await demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();
  }, 120_000);

  it('creating a successful local account', async () => {
    await demoPage.openConnect();
    await demoPage.clickConnectGetStarted();
    const authPage = await AuthPage.getAuthPage(browser);
    const secretKey = await authPage.saveSecretPhrase();
    expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
    expect(validateMnemonic(secretKey)).toBeTruthy();
    await authPage.clickIHaveSavedIt();
    await authPage.setUserName(`${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`);
    await authPage.page.click(authPage.$buttonUsernameContinue);
    const authResponse = await demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();
  }, 90000);

  it('creating an account - negative scenarious', async () => {
    await demoPage.goToPage();
    await demoPage.openConnect();
    await demoPage.clickConnectGetStarted();
    const authPage = await AuthPage.getAuthPage(browser);
    await authPage.saveSecretPhrase();
    await authPage.clickIHaveSavedIt();
    await authPage.page.waitForSelector(authPage.$inputUsername);

    //TEST1 less than 7
    await authPage.page.type(authPage.$inputUsername, randomString(7));
    await authPage.page.click(authPage.$buttonUsernameContinue);
    let element = await authPage.page.$(authPage.eightCharactersErrMsg);
    expect(element).toBeTruthy();
    await authPage.page.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]') as HTMLInputElement;
      el.value = '';
    });

    //TEST2 more than 37
    await authPage.page.type(authPage.$inputUsername, randomString(38));
    await authPage.page.click(authPage.$buttonUsernameContinue);
    element = await authPage.page.$(authPage.eightCharactersErrMsg);
    expect(element).toBeTruthy();
    await authPage.page.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]') as HTMLInputElement;
      el.value = '';
    });

    //TEST3 specal symbols
    await authPage.page.type(authPage.$inputUsername, '!@#$%^&*()-=+/?.>,<`~');
    await authPage.page.click(authPage.$buttonUsernameContinue);
    element = await authPage.page.$(authPage.lowerCharactersErrMsg);
    expect(element).toBeTruthy();
    await authPage.page.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]') as HTMLInputElement;
      el.value = '';
    });

    //TEST4 UPPERCASE
    await authPage.page.type(
      authPage.$inputUsername,
      `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`.toUpperCase()
    );
    await authPage.page.click(authPage.$buttonUsernameContinue);
    element = await authPage.page.$(authPage.lowerCharactersErrMsg);
    expect(element).toBeTruthy();
    await authPage.page.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]') as HTMLInputElement;
      el.value = '';
    });

    //TEST5 with spaces
    await authPage.page.type(
      authPage.$inputUsername,
      `${getRandomWord()} ${getRandomWord()} ${getRandomWord()}_${getRandomWord()}`
    );
    await authPage.page.click(authPage.$buttonUsernameContinue);
    element = await authPage.page.$(authPage.lowerCharactersErrMsg);
    expect(element).toBeTruthy();
    await authPage.page.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]') as HTMLInputElement;
      el.value = '';
    });
    //TEST6 Name already taken
    await authPage.page.type(authPage.$inputUsername, 'test1234');
    await authPage.page.click(authPage.$buttonUsernameContinue);
    expect(await authPage.page.waitForSelector('text="This username is not available"')).toBeTruthy();
    await authPage.page.evaluate(() => {
      const el = document.querySelector('[data-test="input-username"]') as HTMLInputElement;
      el.value = '';
    });
  }, 90000);

  it('Sign in with existing key', async () => {
    //TEST #10,11
    await demoPage.openConnect();
    await demoPage.clickAlreadyHaveSecretKey();
    const authPage = await AuthPage.getAuthPage(browser, false);
    await authPage.loginWithPreviousSecretKey(SECRET_KEY);
    await authPage.chooseAccount(USERNAME);
    const authResponse = await demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();
  }, 90000);

  it('Sign in with the wrong key', async () => {
    //TEST #12
    await demoPage.openConnect();
    await demoPage.clickAlreadyHaveSecretKey();
    const authPage = await AuthPage.getAuthPage(browser, false);
    await authPage.loginWithPreviousSecretKey(WRONG_SECRET_KEY);
    const element = await authPage.page.$(authPage.invalidSecretKey);
    expect(element).toBeTruthy();
  }, 90000);

  it('Sign in with the wrong magic recovery code', async () => {
    //TEST #13
    await demoPage.openConnect();
    await demoPage.clickAlreadyHaveSecretKey();
    const authPage = await AuthPage.getAuthPage(browser, false);
    await authPage.loginWithPreviousSecretKey(WRONG_MAGIC_RECOVERY_KEY);
    await authPage.setPassword(WRONG_PASSWORD);
    const element = await authPage.page.waitForSelector(authPage.incorrectPassword);
    expect(element).toBeTruthy();
  }, 90000);

  it('Sign in with the correct magic recovery code', async () => {
    //TEST #13
    await demoPage.openConnect();
    await demoPage.clickAlreadyHaveSecretKey();
    const authPage = await AuthPage.getAuthPage(browser, false);
    await authPage.loginWithPreviousSecretKey(WRONG_MAGIC_RECOVERY_KEY);
    await authPage.setPassword(CORRECT_PASSWORD);
    await authPage.chooseAccount('thisisit202020');
    const authResponse = await demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();
  }, 90000);

  it('generates the correct app private key', async () => {
    await demoPage.openConnect();
    await demoPage.clickAlreadyHaveSecretKey();
    const auth = await AuthPage.getAuthPage(browser, false);
    const authPage = auth.page;

    const seed = generateMnemonic();
    const wallet = await Wallet.restore('password', seed, ChainID.Testnet);
    await auth.loginWithPreviousSecretKey(seed);
    await authPage.click(auth.$firstAccount);

    const authResponse = await demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();

    const appPrivateKeyEl = await demoPage.page.$('#app-private-key');
    const appPrivateKey = (await demoPage.page.evaluate(el => el?.getAttribute('value'), appPrivateKeyEl)) as string;
    expect(appPrivateKey).toBeTruthy();
    expect(appPrivateKey).toEqual(await wallet.identities[0].appPrivateKey(DemoPage.url));
  }, 60_000);
});
