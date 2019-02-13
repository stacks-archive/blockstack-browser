const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const createTestSuites = require('../utils/create-test-suites');
const helpers = require('../utils/helpers');
const sampleAccount = require('./sample-account');
const createHelloBlockStackServer = require('../hello-blockstack-app/server');

const helloServerPort = 5790;

// A promise that resolves to a running instance of the express server for the hello-blockstack webapp.  
// Only gets instantiated when this test suite is ran, and should only be created once.
let helloServer;

createTestSuites('login to hello-blockstack app', ({driver, browserHostUrl}) => {
  
  step('spawn web server for hello-blockstack app', async () => {
    // We only need to initialize this server once, so assign the promise object immediately,
    // so that subsequent executions do not attempt to spawn a new server. 
    helloServer = helloServer || createHelloBlockStackServer(helloServerPort);
    await helloServer;
  });

  step('load initial page', async () => {
    await driver.get(browserHostUrl);
    await driver.el(By.xpath('//*[contains(.,"Create your Blockstack ID")]'));
  });

  step('fast account recovery via localStorage update', async () => {
    // This test suite is for testing "sign in with Blockstack" on a 3rd party
    // web app, and we don't care about or want to waste test execution time doing
    // account restoration the long way. 
    // Directly write the sample account localStorage data as a quick and dirty way 
    // to restore the account into the blockstack browser session. 
    await driver.executeScript(`
      window.localStorage.setItem('redux', arguments[0]);
      window.localStorage.setItem('BLOCKSTACK_STATE_VERSION', 'ignore');
    `, sampleAccount.LOCAL_STORAGE_DATA);

    // Wait a bit for localStorage writes since some browsers will not flush changes to disk if
    // page is immediately navigated away.
    await driver.sleep(100);
  });

  step('load page', async () => {
    await driver.get((await helloServer).url);
  });

  step('set blockstack auth host', async () => {
    await driver.executeScript(`
      window.BLOCKSTACK_HOST = '${browserHostUrl}/auth';
    `);
  });

  step('click login button', async () => {
    await driver.click(By.css('#signin-button'));
    await driver.sleep(1000);
    // Failed attempt to close protocol handler prompt on chrome:
    // await driver.actions({ bridge: true }).sendKeys(Key.ESCAPE).perform();
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
