const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const createTestSuites = require('../utils/create-test-suites');
const helpers = require('../utils/helpers');
const canOpenProtocol = require('../utils/can-open-protocol');
const sampleAccount = require('./sample-account');
const createHelloBlockStackServer = require('../hello-blockstack-app/server');

const helloServerPort = 5790;

// A promise that resolves to a running instance of the express server for the hello-blockstack webapp.
// Only gets instantiated when this test suite is ran, and should only be created once.
let helloServer;

createTestSuites('login-to-hello-blockstack-app', ({driver, browserHostUrl, loopbackHost, browserName, browserStackEnabled}) => {

  before('spawn web server for hello-blockstack app', async () => {
    // We only need to initialize this server once, so assign the promise object immediately,
    // so that subsequent executions do not attempt to spawn a new server.
    helloServer = helloServer || createHelloBlockStackServer(helloServerPort);
    await helloServer;
  });

  before('check if supported environment', function () {
    if (!browserStackEnabled && browserName === 'chrome' && canOpenProtocol()) {
      console.log('Skipping for Chrome - the native app is installed on this machine and Selenium is incapable of progressing past the open prompt.');
      this.skip();
    }
  })

  step('load initial page', async () => {
    await driver.get(browserHostUrl);
    await driver.el(By.xpath('//*[contains(.,"Create your Blockstack ID")]'));
  });

  step('load app list', async () => {
    await driver.waitForElementLocated(By.id('apps-loaded'));
  });

  step('fast account recovery via localStorage update', async () => {
    // This test suite is for testing "sign in with Blockstack" on a 3rd party
    // web app, and we don't care about or want to waste test execution time doing
    // account restoration the long way.
    // Directly write the sample account localStorage data as a quick and dirty way
    // to restore the account into the blockstack browser session.
    await driver.executeScript(`
      window.localStorage.setItem("BLOCKSTACK_STATE_VERSION", "ignore");
      var authedReduxObj = JSON.parse(arguments[0]);
      var localReduxObj = JSON.parse(window.localStorage.getItem("redux"));
      var mergedReduxState = Object.assign({}, localReduxObj, authedReduxObj);
      window.localStorage.setItem("redux", JSON.stringify(mergedReduxState));
    `, sampleAccount.LOCAL_STORAGE_DATA);

    // Wait a bit for localStorage writes since some browsers will not flush changes to disk if
    // page is immediately navigated away.
    await driver.sleep(100);
  });

  step('load page', async () => {
    await driver.navigate().to(`http://${loopbackHost}:${helloServerPort}`);
  });

  step('set blockstack auth host', async () => {
    await driver.executeScript(`
      window.BLOCKSTACK_HOST = '${browserHostUrl}/auth';
    `);
  });

  step('click login button', async () => {
    const windowHandle = await driver.getWindowHandle();
    await driver.click(By.css('#signin-button'));
    await driver.sleep(1500);
    if (await driver.elementExists(By.css('#signin-button'))) {
      // This closes the "Open app?" dialog on Edge.
      console.log('Performing window open & switch workaround for closing protocol handler dialog');
      await driver.executeScript(`window.open("about:config")`);
      await driver.sleep(1000);
      await driver.switchTo().window(windowHandle);
      await driver.sleep(4000);
    }
  });

  step('wait for auth page to load', async () => {
    await driver.el(By.xpath('//div[contains(.,"Select an ID")]'));
  });

  step('click allow auth button', async () => {
    await driver.click(By.xpath('//span[text()="test_e2e_recovery"]'));
  });

  step('ensure logged into hello-blockstack app', async () => {
    await driver.el(By.xpath('//div[contains(.,"Hello, Alice")]'));
  });

  let userData;
  step('validate blockstack user data', async () => {
    userData = await driver.executeScript(`return blockstack.loadUserData()`);
    expect(userData.appPrivateKey).to.have.lengthOf(64);
    expect(userData.decentralizedID).to.equal("did:btc-addr:1NDsatzAEqrErxkB1osfJXouADgrHXuDs1");
    expect(userData.hubUrl).to.equal("https://hub.blockstack.org");
    expect(userData.username).to.equal("test_e2e_recovery.id.blockstack");
    expect(userData.profile.name).to.equal("Alice Devname");
    expect(userData.profile.api.gaiaHubUrl).to.equal("https://hub.blockstack.org");
    expect(userData.profile.api.gaiaHubConfig.url_prefix).to.equal("https://gaia.blockstack.org/hub/");
  });

  step('validate blockstack.encryptContent(...) & blockstack.decryptContent(...) with account key', async () => {
    const exampleData = "example data";
    const cipher = await driver.executeScript(`return blockstack.encryptContent(arguments[0])`, exampleData);
    expect(JSON.parse(cipher)["wasString"]).to.be.true;
    const decrypted = await driver.executeScript(`return blockstack.decryptContent(arguments[0])`, cipher);
    expect(decrypted).to.equal(exampleData);
  });

  step('validate blockstack.encryptContent(...) & blockstack.decryptContent(...) with specified keys', async () => {
    const publicKey = "0420a5c99852eae2e51d2638564cb4eb1066ac0126a534b25c31a9386b0d97c55abf77ba60dd029be0414d082a2acbc1477ebb6e028d37bbe16c354532e9de61dc";
    const privateKey = "80e626ad4bf501f58be7a1c4763a4c544bb83cc334ebee122321e8f30e41770f";
    const exampleData = "example data";
    const cipher = await driver.executeScript(
      `return blockstack.encryptContent(arguments[0], arguments[1])`, 
      exampleData, { publicKey: publicKey });
    expect(JSON.parse(cipher)["wasString"]).to.be.true;
    const decrypted = await driver.executeScript(
      `return blockstack.decryptContent(arguments[0], arguments[1])`, 
      cipher, { privateKey: privateKey });
    expect(decrypted).to.equal(exampleData);
  });

  step('validate blockstack.getAppBucketUrl(...)', async () => {
    const appBucketUrl = await driver.executePromise(
      `blockstack.getAppBucketUrl(arguments[0], arguments[1])`, 
      userData.hubUrl, 
      userData.appPrivateKey);
    expect(appBucketUrl).to.match(new RegExp("https://gaia.blockstack.org/hub/[a-zA-Z0-9]{34}/"));
  });

  let gaiaFileData;

  step('validate blockstack.putFile(...)', async () => {
    gaiaFileData = helpers.getRandomString(20);
    const putFileResult = await driver.executePromise(
      `blockstack.putFile("/hello.txt", arguments[0])`, 
      gaiaFileData);
    expect(putFileResult).to.match(new RegExp("https://gaia.blockstack.org/hub/[a-zA-Z0-9]{34}//hello.txt"));
  });

  step('validate blockstack.getFile(...)', async () => {
    const getFileResult = await driver.executePromise(`blockstack.getFile("/hello.txt")`);
    expect(getFileResult).to.equal(gaiaFileData);
  });

  step('validate blockstack.listFiles(...)', async () => {
    const [error, result] = await driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      var files = [];
      blockstack.listFiles(function(filename) {
        files.push(filename);
        return true;
      })
        .then(result => callback([null, {files: files, count: result}]))
        .catch(error => callback([error.toString(), null]));
    `);
    if (error) {
      throw new Error(error);
    }
    expect(result.count).to.be.greaterThan(0);
    expect(result.files).to.include('/hello.txt');
  });

  step('validate blockstack.getUserAppFileUrl(...)', async () => {
    const userAppFileUrl = await driver.executePromise(
      `blockstack.getUserAppFileUrl(arguments[0], arguments[1], arguments[2])`, 
      'public/1547742731687.json', 
      'mattlittle_test1.id.blockstack', 
      'https://app.graphitedocs.com');
    expect(userAppFileUrl).to.equal("https://gaia.blockstack.org/hub/18e3diVDsRfq2ckqS56wYw9mQhS4kxC15F/public/1547742731687.json");
  });

  step('validate blockstack.getFile(...) with multi-player storage', async () => {
    const getFileResult = await driver.executePromise(
      `blockstack.getFile(arguments[0], arguments[1])`, 
      'public/1547742731687.json', { 
        username: 'mattlittle_test1.id.blockstack',
        app: 'https://app.graphitedocs.com',
        decrypt: false
      });
    // Sanity check on content..
    const resultJson = JSON.parse(getFileResult);
    expect(resultJson["shared"]).to.equal("2/21/2019");
  });

  step('validate blockstack.signUserOut(...)', async () => {
    const redirectUrl = `http://${loopbackHost}:${helloServerPort}/?some=param`;
    await driver.executeScript(`blockstack.signUserOut(arguments[0])`, redirectUrl);
    await driver.sleep(50);
    await driver.el(By.css('#signin-button'));
    const windowLocation = await driver.getCurrentUrl();
    expect(windowLocation).to.equal(redirectUrl);
  });

  step('validate localStorage user data is been cleared', async () => {
    const localStorageSession = await driver.executeScript(`return window.localStorage.getItem('blockstack-session')`);
    if (localStorageSession) {
      const sessionJson = JSON.parse(localStorageSession);
      const userData = sessionJson['userData'];
      expect(userData).to.not.exist;
    }
    else {
      expect(localStorageSession).to.not.exist;
    }
  });

});


after('dispose of hello-blockstack web server', async () => {
  if (helloServer) {
    const helloServerRef = helloServer;
    helloServer = null;
    const { server } = await helloServerRef;
    await new Promise(resolve => server.close(error => {
      if (error) {
        console.error(`Error disposing of hello-blockstack web server: ${error}`);
      }
      resolve();
    }));
  }
});
