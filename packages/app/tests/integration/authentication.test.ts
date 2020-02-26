import { Wallet } from '@blockstack/keychain';
import { validateMnemonic, generateMnemonic, wordlists } from 'bip39';

import { AuthPageObject } from './page-objects/auth.page';
import { DemoPageObject } from './page-objects/demo.page';

const SEED_PHRASE_LENGTH = 12;

async function bootstrapConnectModalPageTest(demo: DemoPageObject, auth: AuthPageObject) {
  await demo.goToPage();
  await page.click(demo.$openAuthButton);
  const newWindow = await browser.waitForTarget(target => target.url().startsWith(auth.url));
  const authPage = await newWindow.page();
  expect(authPage.url().startsWith(auth.url)).toBeTruthy();
  try {
    await authPage.waitFor(auth.$textareaReadOnlySeedPhrase, { timeout: 15000 });
  } catch (error) {
    await authPage.screenshot({ path: './tests/screenshot.png' });
    throw error;
  }
  return { authPage };
}

const getRandomWord = () => {
  const list = wordlists.EN;
  const word = list[Math.floor(Math.random() * list.length)];
  return word;
};

describe('Authentication', () => {
  let authPageObject: AuthPageObject;
  let demoPageObject: DemoPageObject;

  beforeEach(async () => {
    await jestPuppeteer.resetBrowser();
    authPageObject = new AuthPageObject();
    demoPageObject = new DemoPageObject();
  });

  test('creating a successful account', async done => {
    const { authPage } = await bootstrapConnectModalPageTest(demoPageObject, authPageObject);

    await authPage.waitFor(authPageObject.$textareaReadOnlySeedPhrase);

    const $secretKeyEl = await authPage.$(authPageObject.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey: string = await authPage.evaluate(el => el.value, $secretKeyEl);
    expect(secretKey.split(' ').length).toEqual(SEED_PHRASE_LENGTH);
    expect(validateMnemonic(secretKey)).toBeTruthy();

    await authPage.click(authPageObject.$buttonCopySecretKey);

    await authPage.waitFor(authPageObject.$buttonHasSavedSeedPhrase);
    await authPage.click(authPageObject.$buttonHasSavedSeedPhrase);

    const $usernameInputElement = await authPage.$(authPageObject.$inputUsername);
    if (!$usernameInputElement) {
      throw 'Could not find username field';
    }
    await authPage.type(
      authPageObject.$inputUsername,
      `${getRandomWord()}_${getRandomWord()}_${getRandomWord()}_${getRandomWord()}`
    );
    await authPage.click(authPageObject.$buttonUsernameContinue);

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(el => el.innerText, authResponseEl);
    expect(authResponse).toBeTruthy();
    done();
  }, 120_000);

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('signing in with an existing Secret Key', async () => {
    const { authPage } = await bootstrapConnectModalPageTest(demoPageObject, authPageObject);

    await authPage.waitFor('#onboarding-sign-in');
    await authPage.click('#onboarding-sign-in');
    const seed = generateMnemonic();
    const wallet = await Wallet.restore('password', seed);
    await authPage.type(authPageObject.$textareaSeedPhraseInput, seed);
    await authPage.click('#sign-in-continue');

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(el => el.innerText, authResponseEl);
    expect(authResponse).toBeTruthy();

    const appPrivateKeyEl = await page.$('#app-private-key');
    const appPrivateKey: string = await page.evaluate(el => el.innerText, appPrivateKeyEl);
    expect(appPrivateKey).toBeTruthy();
    expect(appPrivateKey).toEqual(await wallet.identities[0].appPrivateKey(demoPageObject.url));
  }, 60_000);
});
