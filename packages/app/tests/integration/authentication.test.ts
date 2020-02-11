import { Wallet } from '@blockstack/keychain';
import { validateMnemonic, generateMnemonic, wordlists } from 'bip39';
import { Page } from 'puppeteer';

import { AuthPageObject } from './page-objects/auth.page';
import { DemoPageObject } from './page-objects/demo.page';

const SEED_PHRASE_LENGTH = 12;

async function bootstrapConnectModalPageTest(demo: DemoPageObject, auth: AuthPageObject) {
  await demo.goToPage();
  await page.click(demo.$openAuthButton);
  const newWindow = await browser.waitForTarget(target => target.url().startsWith(auth.url));
  const authPage = await newWindow.page();
  expect(authPage.url().startsWith(auth.url)).toBeTruthy();
  await authPage.waitFor(auth.$inputUsername, { timeout: 15000 });
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

    const $usernameInputElement = await authPage.$(authPageObject.$inputUsername);
    if (!$usernameInputElement) {
      throw 'Could not find username field';
    }
    await authPage.type(
      authPageObject.$inputUsername,
      `${getRandomWord()}-${getRandomWord()}-${getRandomWord()}-${getRandomWord()}`
    );
    await authPage.click(authPageObject.$buttonUsernameContinue);

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

    await authPage.waitFor(authPageObject.$buttonConfirmReenterSeedPhrase);
    await authPage.type(authPageObject.$textareaSeedPhraseInput, secretKey);
    await authPage.click(authPageObject.$buttonConfirmReenterSeedPhrase);

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(el => el.innerText, authResponseEl);
    expect(authResponse).toBeTruthy();
    done();
  }, 120_000);

  describe('Secret Key validation', () => {
    let authPage: Page;

    async function navigateThroughToSecretKeyPage() {
      const pages = await bootstrapConnectModalPageTest(demoPageObject, authPageObject);

      authPage = pages.authPage;

      await authPage.type(
        authPageObject.$inputUsername,
        `${getRandomWord()}-${getRandomWord()}-${getRandomWord()}-${getRandomWord()}`
      );
      await authPage.click(authPageObject.$buttonUsernameContinue);
      await authPage.waitFor(authPageObject.$textareaReadOnlySeedPhrase);
      await authPage.click(authPageObject.$buttonCopySecretKey);
      await authPage.waitFor(authPageObject.$buttonHasSavedSeedPhrase);
      await authPage.click(authPageObject.$buttonHasSavedSeedPhrase);
      await authPage.waitFor(authPageObject.$buttonConfirmReenterSeedPhrase);
    }

    beforeEach(async () => navigateThroughToSecretKeyPage(), 15_000);

    test('it does not let you proceed when entering an incorrect seed phrase', async done => {
      const nonsenseRhymingSeed = 'You might encounter some delays, if you forget your seed phrase';

      await authPage.type(authPageObject.$textareaSeedPhraseInput, nonsenseRhymingSeed);
      await authPage.click(authPageObject.$buttonConfirmReenterSeedPhrase);

      await expect(authPage).toMatch("You've entered your 12-word Secret Key incorrectly");
      await expect(authPage).not.toMatch('You’re all set!');

      done();
    }, 60_000);

    test('it does not let you proceed without entering your secret key', async done => {
      await authPage.click(authPageObject.$buttonConfirmReenterSeedPhrase);

      await expect(authPage).toMatch('You must enter your Secret Key');
      await expect(authPage).not.toMatch('You’re all set!');

      done();
    }, 60_000);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('signing in with an existing seed phrase', async () => {
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
