import { Wallet } from '@blockstack/keychain';
import { validateMnemonic, generateMnemonic } from 'bip39';

import { AuthPageObject } from './page-objects/auth.page';
import { DemoPageObject } from './page-objects/demo.page';

const SEED_PHRASE_LENGTH = 12;

async function bootstrapConnectModalPageTest(demo: DemoPageObject, auth: AuthPageObject) {
  await demo.goToPage();
  await page.click(demo.$openAuthButton);
  const newWindow = await browser.waitForTarget(target => target.url().startsWith(auth.url));
  const authPage = await newWindow.page();
  expect(authPage.url().startsWith(auth.url)).toBeTruthy();
  await authPage.waitFor(auth.$textareaReadOnlySeedPhrase);
  return { authPage };
}

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

    //
    // These steps commented out as the flow has changed slightly
  
    // await authPage.waitFor(authPageObject.$buttonConnectFlowFinished);
    // await expect(authPage).toMatch('You’re all set!');
    // await authPage.click(authPageObject.$buttonConnectFlowFinished);

    await page.waitFor('#auth-response');
    const authResponseEl = await page.$('#auth-response');
    const authResponse: string = await page.evaluate(el => el.innerText, authResponseEl);
    expect(authResponse).toBeTruthy();
    done();
  }, 150_000);

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('that it does not let you proceed when passing an incorrect seed phrase', async done => {
    const { authPage } = await bootstrapConnectModalPageTest(demoPageObject, authPageObject);

    await authPage.click(authPageObject.$buttonCopySecretKey);
    await authPage.waitFor(authPageObject.$buttonHasSavedSeedPhrase);
    await authPage.click(authPageObject.$buttonHasSavedSeedPhrase);
    await authPage.waitFor(authPageObject.$buttonConfirmReenterSeedPhrase);

    const nonsenseRhymingSeed = 'You might encounter some delays, if you forget your seed phrase';

    await authPage.type(authPageObject.$textareaSeedPhraseInput, nonsenseRhymingSeed);
    await authPage.click(authPageObject.$buttonConfirmReenterSeedPhrase);

    await expect(authPage).not.toMatch('You’re all set!');

    done();
  }, 150_000);

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
  }, 150_000);
});
