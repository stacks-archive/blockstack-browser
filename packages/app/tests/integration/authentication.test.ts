import { validateMnemonic, wordlists, generateMnemonic } from 'bip39';
import { BrowserContext } from 'playwright-core';
import { randomString, Browser, environments, SECRET_KEY } from './utils';
import { setupMocks } from './mocks';
import { DemoPage } from './page-objects/demo.page';
import { WalletPage } from './page-objects/wallet.page';
import { Wallet } from '@stacks/keychain';
import { ChainID } from '@blockstack/stacks-transactions';

const WRONG_SECRET_KEY =
  'invite helmet save lion indicate chuckle world pride afford hard broom yup';
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

jest.retryTimes(process.env.CI ? 2 : 0);
jest.setTimeout(20_000);
environments.forEach(([browserType, deviceType]) => {
  const deviceLabel = deviceType
    ? ` - ${deviceType.viewport.height}x${deviceType.viewport.width}`
    : '';
  describe(`Authentication integration tests - ${browserType.name()}${deviceLabel}`, () => {
    let browser: Browser;
    let context: BrowserContext;
    let demoPage: DemoPage;
    let consoleLogs: string[];

    beforeAll(async () => {
      const launchArgs: string[] = [];
      if (browserType.name() === 'chromium') {
        launchArgs.push('--no-sandbox');
      }
      browser = await browserType.launch({
        args: launchArgs,
      });
      console.log('[DEBUG]: Launched puppeteer browser');
    });

    beforeEach(async () => {
      console.log('[DEBUG]: Starting new browser context.');
      if (deviceType) {
        context = await browser.newContext({
          viewport: deviceType.viewport,
          userAgent: deviceType.userAgent,
        });
      } else {
        context = await browser.newContext();
      }
      await setupMocks(context);
      consoleLogs = [];
      demoPage = await DemoPage.init(context);
      demoPage.page.on('console', event => {
        consoleLogs = consoleLogs.concat(event.text());
      });
    }, 10000);

    afterAll(async () => {
      try {
        await browser.close();
      } catch (error) {
        // console.error(error);
      }
    });

    it('creating an account successfully', async () => {
      await demoPage.openConnect();
      await demoPage.clickConnectGetStarted();
      const auth = await WalletPage.getAuthPopup(context);
      await auth.clickSignUp();
      await auth.enterPassword();

      const username = `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`;
      await auth.enterUsername(username);

      const authResponse = await demoPage.waitForAuthResponse(browser);
      expect(authResponse).toBeTruthy();

      const homePage = await WalletPage.init(context);
      await homePage.enterPassword();
      const secretKey = await homePage.getSecretKey();
      expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
      expect(validateMnemonic(secretKey)).toBeTruthy();
    });

    it('creating an account - negative scenarious', async () => {
      await demoPage.goToPage();
      await demoPage.openConnect();
      await demoPage.clickConnectGetStarted();

      const auth = await WalletPage.getAuthPopup(context);
      await auth.clickSignUp();
      await auth.enterPassword();
      await auth.page.waitForSelector(auth.usernameInput);

      //TEST1 less than 7
      await auth.enterUsername(randomString(7));
      await auth.page.waitForSelector(auth.eightCharactersErrMsg);

      //TEST2 more than 37
      await auth.enterUsername(randomString(38));
      await auth.page.waitForSelector(auth.eightCharactersErrMsg);

      //TEST3 specal symbols
      await auth.enterUsername('!@#$%^&*()-=+/?.>,<`~');
      await auth.page.waitForSelector(auth.lowerCharactersErrMsg);

      //TEST4 UPPERCASE
      await auth.enterUsername(
        `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`.toUpperCase()
      );
      await auth.page.waitForSelector(auth.lowerCharactersErrMsg);

      //TEST5 with spaces
      await auth.enterUsername(
        `${getRandomWord()} ${getRandomWord()} ${getRandomWord()}_${getRandomWord()}`
      );
      await auth.page.waitForSelector(auth.lowerCharactersErrMsg);

      //TEST6 Name already taken
      await auth.enterUsername('test1234');
      await auth.page.waitForSelector('text="This username is not available"');
    });

    it('Sign in with existing key', async () => {
      //TEST #10,11
      await demoPage.openConnect();
      await demoPage.clickAlreadyHaveSecretKey();
      const auth = await WalletPage.getAuthPopup(context);
      await auth.loginWithPreviousSecretKey(SECRET_KEY);
      await auth.chooseAccount(USERNAME);
      const authResponse = await demoPage.waitForAuthResponse(browser);
      expect(authResponse).toBeTruthy();
    });

    it('Sign in with the wrong key', async () => {
      //TEST #12
      await demoPage.openConnect();
      await demoPage.clickAlreadyHaveSecretKey();
      const auth = await WalletPage.getAuthPopup(context);
      await auth.enterSecretKey(WRONG_SECRET_KEY);
      const error = await auth.page.waitForSelector(auth.signInKeyError);
      expect(error).toBeTruthy();
      expect(await error.innerText()).toEqual("The Secret Key you've entered is invalid");
    });

    it('Sign in with the wrong magic recovery code', async () => {
      //TEST #13
      await demoPage.openConnect();
      await demoPage.clickAlreadyHaveSecretKey();
      const auth = await WalletPage.getAuthPopup(context);
      await auth.enterSecretKey(WRONG_MAGIC_RECOVERY_KEY);
      await auth.decryptRecoveryCode(WRONG_PASSWORD);
      await auth.page.waitForSelector('text="Incorrect password"');
    });

    it('Sign in with the correct magic recovery code', async () => {
      //TEST #13
      await demoPage.openConnect();
      await demoPage.clickAlreadyHaveSecretKey();
      const auth = await WalletPage.getAuthPopup(context);
      await auth.enterSecretKey(WRONG_MAGIC_RECOVERY_KEY);
      await auth.decryptRecoveryCode(CORRECT_PASSWORD);
      await auth.chooseAccount('thisisit202020');
      const authResponse = await demoPage.waitForAuthResponse(browser);
      expect(authResponse).toBeTruthy();
    });

    it('generates the correct app private key', async () => {
      await demoPage.openConnect();
      await demoPage.clickAlreadyHaveSecretKey();
      const auth = await WalletPage.getAuthPopup(context);

      const seed = generateMnemonic();
      const wallet = await Wallet.restore('password', seed, ChainID.Testnet);
      await auth.loginWithPreviousSecretKey(seed);
      const username = `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`;
      await auth.enterUsername(username);

      const authResponse = await demoPage.waitForAuthResponse(browser);
      expect(authResponse).toBeTruthy();

      const appPrivateKeyEl = await demoPage.page.$('#app-private-key');
      const appPrivateKey = (await demoPage.page.evaluate(
        el => el?.getAttribute('value'),
        appPrivateKeyEl
      )) as string;
      expect(appPrivateKey).toBeTruthy();
      expect(appPrivateKey).toEqual(wallet.identities[0].appPrivateKey(DemoPage.url));
    });
  });
});
