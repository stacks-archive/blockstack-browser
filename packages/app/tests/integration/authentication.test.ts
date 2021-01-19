import { validateMnemonic, wordlists } from 'bip39';
import { randomString, SECRET_KEY, setupBrowser, BrowserDriver } from './utils';
import { DemoPage } from './page-objects/demo.page';
import { WalletPage } from './page-objects/wallet.page';
import { USERNAMES_ENABLED } from '@common/constants';
import { generateSecretKey, generateWallet, getAppPrivateKey } from '@stacks/wallet-sdk';

const WRONG_SECRET_KEY =
  'invite helmet save lion indicate chuckle world pride afford hard broom yup';
const WRONG_MAGIC_RECOVERY_KEY =
  'KDR6O8gKXGmstxj4d2oQqCi806M/Cmrbiatc6g7MkQQLVreRA95IoPtvrI3N230jTTGb2XWT5joRFKPfY/2YlmRz1brxoaDJCNS4z18Iw5Y=';
const WRONG_PASSWORD = 'sstest202020';
const CORRECT_PASSWORD = 'test202020';
const USERNAME = 'thisis45678';

const SEED_PHRASE_LENGTH = 24;

const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

jest.retryTimes(process.env.CI ? 2 : 0);
jest.setTimeout(20_000);
describe(`Authentication integration tests`, () => {
  let browser: BrowserDriver;

  beforeEach(async () => {
    browser = await setupBrowser();
  }, 10000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {
      // console.error(error);
    }
  });

  it('creating an account successfully', async () => {
    await browser.demoPage.openConnect();
    const auth = await WalletPage.getAuthPopup(browser);
    await auth.clickSignUp();
    await auth.enterPassword();

    const username = `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`;
    await auth.enterUsername(username);

    const authResponse = await browser.demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();

    const homePage = await WalletPage.init(browser);
    const secretKey = await homePage.getSecretKey();
    expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
    expect(validateMnemonic(secretKey)).toBeTruthy();
  });

  it('creating an account - negative scenarious', async () => {
    if (!USERNAMES_ENABLED) {
      if (process.env.CI) {
        console.log(
          'Skipping username validation tests, because subdomain registration is disabled.'
        );
      }
      return;
    }
    await browser.demoPage.goToPage();
    await browser.demoPage.openConnect();
    await browser.demoPage.clickConnectGetStarted();

    const auth = await WalletPage.getAuthPopup(browser);
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
    await browser.demoPage.openConnect();
    const auth = await WalletPage.getAuthPopup(browser);
    await auth.clickSignIn();
    await auth.loginWithPreviousSecretKey(SECRET_KEY);
    await auth.chooseAccount(USERNAME);
    const authResponse = await browser.demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();
  });

  it('Sign in with the wrong key', async () => {
    //TEST #12
    await browser.demoPage.openConnect();
    const auth = await WalletPage.getAuthPopup(browser);
    await auth.clickSignIn();
    await auth.enterSecretKey(WRONG_SECRET_KEY);
    const error = await auth.page.waitForSelector(auth.signInKeyError);
    expect(error).toBeTruthy();
    expect(await error.innerText()).toEqual("The Secret Key you've entered is invalid");
  });

  it('Sign in with the wrong magic recovery code', async () => {
    //TEST #13
    await browser.demoPage.openConnect();
    const auth = await WalletPage.getAuthPopup(browser);
    await auth.clickSignIn();
    await auth.enterSecretKey(WRONG_MAGIC_RECOVERY_KEY);
    await auth.decryptRecoveryCode(WRONG_PASSWORD);
    await auth.page.waitForSelector('text="Incorrect password"');
  });

  it('Sign in with the correct magic recovery code', async () => {
    //TEST #13
    await browser.demoPage.openConnect();
    const auth = await WalletPage.getAuthPopup(browser);
    await auth.clickSignIn();
    await auth.enterSecretKey(WRONG_MAGIC_RECOVERY_KEY);
    await auth.decryptRecoveryCode(CORRECT_PASSWORD);
    const authResponse = await browser.demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();
  });

  it('generates the correct app private key', async () => {
    await browser.demoPage.openConnect();
    const auth = await WalletPage.getAuthPopup(browser);
    await auth.clickSignIn();
    const secretKey = generateSecretKey();
    const wallet = await generateWallet({ secretKey, password: 'password' });
    await auth.loginWithPreviousSecretKey(secretKey);
    const username = `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`;
    await auth.enterUsername(username);

    const authResponse = await browser.demoPage.waitForAuthResponse();
    expect(authResponse).toBeTruthy();

    const appPrivateKeyEl = await browser.demoPage.page.$('#app-private-key');
    const appPrivateKey = (await browser.demoPage.page.evaluate(
      el => el?.getAttribute('value'),
      appPrivateKeyEl
    )) as string;
    expect(appPrivateKey).toBeTruthy();
    expect(appPrivateKey).toEqual(
      getAppPrivateKey({ account: wallet.accounts[0], appDomain: DemoPage.url })
    );
  });
});
// });
