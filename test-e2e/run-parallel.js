const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mochaSteps = require('mocha-steps');
const PQueue = require('p-queue');

const mocha = new Mocha({
  timeout: 200000
});

mocha.files = Mocha.utils
  .lookupFiles(__dirname, [ 'js' ], true)
  .filter(f => path.basename(f) !== path.basename(__filename))
  .sort();

mocha.loadFiles();

const testSuites = mocha.suite.suites;
const rootRunner = new Mocha.Runner(mocha.suite);
const queue = new PQueue({ concurrency: 5 });

async function start() { 

  await promisify(rootRunner.hook).call(rootRunner, 'beforeAll');

  testSuites.forEach(suite => {

    queue.add(async () => {
      await promisify(rootRunner.hook).call(rootRunner, 'beforeEach');

      const runner = new Mocha.Runner(suite);
      runner.addListener('test', (test) => {
        //console.log(`Test started: ${test.fullTitle()}`);
      });
      runner.addListener('pass', (test) => {
        //console.log(`Test passed: ${test.fullTitle()}`);
      });
      runner.addListener('fail', (test, error) => {
        console.error(`Test failed: ${test.fullTitle()} - ${error}`);
      });
      runner.addListener('suite', (s) => {
        console.log(`Suite started: ${s.fullTitle()}`);
      });
      runner.addListener('suite end', (s) => {
        console.log(`Suite ended: ${s.fullTitle()}`);
      });

      await new Promise(res => {
        runner.run((failures) => {
          setTimeout(() => res(), 2000);
        });
      });

      await promisify(rootRunner.hook).call(rootRunner, 'afterEach');
    });

  });

  await queue.onIdle();

  await promisify(rootRunner.hook).call(rootRunner, 'afterAll');

}

start().then(() => {
  console.log('Finished');
}).catch(err => {
  console.error(`Finished with error: ${err}`);
});
