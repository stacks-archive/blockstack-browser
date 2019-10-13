import * as chai from 'chai';
// tslint:disable-next-line: prefer-const
import {browser, By, element, until} from 'protractor';
import {Canopenprotocol} from '../../src/utils/can-open-protocol';
import {SampleAccount} from '../../src/utils/sample-account';
import {Utils} from '../../src/utils/Utils';
import * as createHelloBlockStackServer from '../hello-blockstack-app/server';

const expect = chai.expect;
const error: any = "";
const result: any = "";
const loopbackHost = 'localhost';
const helloServerPort = 5790;

module.exports = function signIn() {
  let helloServer;
  let userData;
  let cipher;
  let gaiaFileData;
  let getFileResult;
  let localStorageSession;

  this.Before({tags: ["@login"]}, async () => {
    // We only need to initialize this server once, so assign the promise object immediately,
    // so that subsequent executions do not attempt to spawn a new server.
    try {
      helloServer = helloServer || createHelloBlockStackServer(helloServerPort);
      await helloServer;
    } catch (err) {
      console.log(err);
    }

  });

  this.Before({tags: ["@login"]}, async () => {
    const capabilities = await browser.getCapabilities();
    const browserName = capabilities.get('browserName');
    if (!browser.params.browserStack.enabled && browserName === 'chrome' && await Canopenprotocol.canOpenProtocol()) {
      console.log('Skipping for Chrome - the native app is installed on this machine and Selenium is incapable of progressing past the open prompt.');
      this.skip();
    }
  });

  this.After({tags: ["@login"]}, async () => {
    if (helloServer) {
      const helloServerRef = helloServer;
      helloServer = null;
      const {server} = await helloServerRef;
      await new Promise((resolve) => server.close(error => {
        if (error) {
          console.error(`Error disposing of hello-blockstack web server: ${error}`);
        }
        resolve();
      }));
    }
  });

  this.Then(/^load app list$/, async () => {
    browser.sleep(20000);
    await browser.wait(until.elementLocated(By.id('apps-loaded')), 20000);
    // await Utils.waitForElement(element(By.id('apps-loaded')));
  });

  this.Then(/^fast account recovery via localStorage update$/, async () => {
    await browser.executeScript(`
      window.localStorage.setItem("BLOCKSTACK_STATE_VERSION", "ignore");
      var authedReduxObj = JSON.parse(arguments[0]);
      var localReduxObj = JSON.parse(window.localStorage.getItem("redux"));
      var mergedReduxState = Object.assign({}, localReduxObj, authedReduxObj);
      window.localStorage.setItem("redux", JSON.stringify(mergedReduxState));
    `, SampleAccount.LOCAL_STORAGE_DATA);

  });
  this.Then(/^load page$/, async () => {
    await browser.navigate().to(`http://${loopbackHost}:${helloServerPort}`);
  });

  this.Given(/^set blockstack auth host$/, async () => {
    await browser.executeScript(`
        window.BLOCKSTACK_HOST = '${browser.params.browserHostUrl}/auth';
      `);
  });

  this.Then(/^click login button$/, async () => {
    const windowHandle = await browser.getWindowHandle();
    await Utils.waitForElement(element(By.css('#signin-button')));
    console.log("signin-button isDisplayed : " + await element(By.css('#signin-button')).isDisplayed());
    console.log("signin-button href: " + await element(By.css('#signin-button')).getAttribute("href"));
    await browser.executeScript("document.getElementById('signin-button').click()");
    await browser.sleep(1500);

    const isSignInButtonDisplayed = await browser.element(By.css('#signin-button')).isPresent();
    if (isSignInButtonDisplayed) {
      const capabilities = await browser.getCapabilities();
      const browserName = capabilities.get('browserName');
      if (browserName === 'MicrosoftEdge') {
        // This closes the "Open app?" dialog on Edge.
        console.log('Performing window open & switch workaround for closing protocol handler dialog');
        await browser.executeScript(`window.open("about:config")`);
        await browser.sleep(1000);
        await browser.switchTo().window(windowHandle);
        await browser.sleep(4000);
      }
    }
  });

  this.Given(/^wait for auth page to load$/, async () => {
    await browser.element(By.xpath('//div[contains(.,"Select an ID")]'));
  });

  this.Then(/^click allow auth button$/, async () => {
    await Utils.waitForElementToDisplayed(element(By.xpath('//span[text()="test_e2e_recovery"]')));
    await Utils.click(element(By.xpath('//span[text()="test_e2e_recovery"]')));
    // await element(By.xpath('//span[text()="test_e2e_recovery"]')).click();
  });

  this.Given(/^ensure logged into hello-blockstack app$/, async () => {
    await Utils.waitForElement(element(By.xpath('//div[contains(.,"Hello, Alice")]')));
  });

  this.Then(/^validate blockstack user data$/, async () => {
    userData = await browser.executeScript(`return blockstack.loadUserData()`);
    await expect(userData.appPrivateKey).to.have.lengthOf(64);
    await expect(userData.decentralizedID).to.equal("did:btc-addr:1NDsatzAEqrErxkB1osfJXouADgrHXuDs1");

    await expect(userData.hubUrl).to.equal("https://hub.blockstack.org");
    await expect(userData.username).to.equal("test_e2e_recovery.id.blockstack");
    await expect(userData.profile.name).to.equal("Alice Devname");
    await expect(userData.profile.api.gaiaHubUrl).to.equal("https://hub.blockstack.org");
    await expect(userData.profile.api.gaiaHubConfig.url_prefix).to.equal("https://gaia.blockstack.org/hub/");

  });
  const exampleData = "example data";
  this.Then(/^validate blockstack encryptContent and blockstack decryptContent with account key$/, async () => {
    try {
      cipher = await browser.executeScript(`return blockstack.encryptContent(arguments[0])`, exampleData);
      // tslint:disable-next-line: no-unused-expression
      await expect(JSON.parse(cipher)["wasString"]).to.be.true;
      const decrypted = await browser.executeScript(`return blockstack.decryptContent(arguments[0])`, cipher);
      await expect(decrypted).to.equal(exampleData);
    } catch (err) {
      console.log(err);
    }
  });

  this.Then(/^validate blockstack encryptContent and blockstack decryptContent and with specified keys$/, async () => {
    const publicKey = "0420a5c99852eae2e51d2638564cb4eb1066ac0126a534b25c31a9386b0d97c55abf77ba60dd029be0414d082a2acbc1477ebb6e028d37bbe16c354532e9de61dc";
    const privateKey = "80e626ad4bf501f58be7a1c4763a4c544bb83cc334ebee122321e8f30e41770f";
// tslint:disable-next-line: no-shadowed-variable
    const exampleData = "example data";
    cipher = await browser.executeScript(
      `return blockstack.encryptContent(arguments[0], arguments[1])`,
      exampleData, {publicKey});
    // tslint:disable-next-line: no-unused-expression
    await expect(JSON.parse(cipher)["wasString"]).to.be.true;
    const decrypted = await browser.executeScript(
      `return blockstack.decryptContent(arguments[0], arguments[1])`,
      cipher, {privateKey});
    await expect(decrypted).to.equal(exampleData);
  });

  this.Then(/^validate blockstack getAppBucketUrl$/, async () => {
    const appBucketUrl = await Utils.executePromise(
      `blockstack.getAppBucketUrl(arguments[0], arguments[1])`,
      userData.hubUrl,
      userData.appPrivateKey);
    expect(appBucketUrl).to.match(new RegExp("https://gaia.blockstack.org/hub/[a-zA-Z0-9]{34}/"));
  });

  this.Then(/^validate blockstack putFile$/, async () => {
    gaiaFileData = Math.random().toString(36).substr(2);
    const putFileResult = await Utils.executePromise(
      `blockstack.putFile("/hello.txt", arguments[0])`,
      gaiaFileData);
    expect(putFileResult).to.match(new RegExp("https://gaia.blockstack.org/hub/[a-zA-Z0-9]{34}//hello.txt"));
  });

  this.Then(/^validate blockstack getFile$/, async () => {
    // tslint:disable-next-line: no-shadowed-variable
    const getFileResult = await Utils.executePromise(`blockstack.getFile("/hello.txt")`);
    // tslint:disable-next-line: no-shadowed-variable
    //expect(getFileResult).equal(gaiaFileData);

    chai.expect(getFileResult[0]).to.equal(gaiaFileData);
  });

  this.Then(/^validate blockstack listFiles$/, async () => {
    // tslint:disable-next-line: no-shadowed-variable
    const result = await browser.executeAsyncScript(`
        var callback = arguments[arguments.length - 1];
        var files = [];
        blockstack.listFiles(function(filename) {
          files.push(filename);
          return true;
        })
          .then(result => callback([null, {files: files, count: result}]))
      `);
    expect(result[1].count).to.be.greaterThan(0);
    expect(result[1].files).to.include('/hello.txt');
  });

  this.Given(/^validate blockstack getUserAppFileUrl$/, async () => {
    const pack = 'public/1547742731687.json';
    const block = 'mattlittle_test1.id.blockstack';
    const graphite = 'https://app.graphitedocs.com';
    const userAppFileUrl = await Utils.executePromise(
      `blockstack.getUserAppFileUrl(arguments[0], arguments[1], arguments[2])`,
      pack,
      block,
      graphite,
    );
    expect(userAppFileUrl[0]).to.equal("https://gaia.blockstack.org/hub/18e3diVDsRfq2ckqS56wYw9mQhS4kxC15F/public/1547742731687.json");
  });

  this.Then(/^validate blockstack.getFile with multi-player storage$/, async () => {
    const blockstack = {
      username: 'mattlittle_test1.id.blockstack',
      app: 'https://app.graphitedocs.com',
      decrypt: false,
    };
    const publicjson = 'public/1547742731687.json';
    getFileResult = await Utils.executePromise(
      `blockstack.getFile(arguments[0], arguments[1])`,
      publicjson,
      blockstack,
    );
    // Sanity check on content..
    const resultJson = JSON.parse(getFileResult);
    expect(resultJson["shared"]).to.equal("2/21/2019");
  });

  this.Then(/^validate blockstack.signUserOut$/, async () => {
    const redirectUrl = `http://${browser.params.loopbackHost}:${helloServerPort}/?some=param`;
    await browser.executeScript(`blockstack.signUserOut(arguments[0])`, redirectUrl);
    await browser.sleep(50);
    await Utils.waitForElement(element(By.css('#signin-button')));
    const windowLocation = await browser.getCurrentUrl();
    expect(windowLocation).to.equal(redirectUrl);
  });

  const newLocal = `return window.localStorage.getItem('blockstack-session')`;
  this.Then(/^validate localStorage user data is been cleared$/, async () => {
    localStorageSession = await browser.executeScript(newLocal);
    if (localStorageSession) {
      const sessionJson = JSON.parse(localStorageSession);
      // tslint:disable-next-line: no-shadowed-variable
      const userData = sessionJson['userData'];
      // tslint:disable-next-line: no-unused-expression
      await expect(userData).to.not.exist;
    } else {
      // tslint:disable-next-line: no-unused-expression
      await expect(localStorageSession).to.not.exist;
    }
  });
};

