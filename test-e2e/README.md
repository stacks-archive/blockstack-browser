##Setup
Install node dependencies in root level and test-e2e folder: `npm install` 

## Running Tests

These test can be ran using the web browsers on your local machine or using BrowserStack's environments. The tests can be targeting against any provided hosted browser endpoint as well as a locally built & hosted endpoint. 

#### Using production endpoint and local browsers
Use `npm run test-e2e` to run tests using your local system web browsers and against the production endpoint.

#### Using local static web server and local browsers
Use `npm run test-e2e:localBuild` to build and host the local static web server, then run tests using your local system web browsers.

#### Using BrowserStack
In order to run tests against BrowserStack, auth credentials must be specified in the environmental variable `BROWSERSTACK_AUTH` with the format `"user:key"`. 
For example `BROWSERSTACK_AUTH="alice1:yUDBktWP1tRdrfq5Lpck"`.

Use `npm run test-e2e:browserstack` to build and host the browser locally, then run tests against BrowserStack's grid. All major operating systems and browsers are setup and working, including iOS and Android. 

## HTML Report
`index.html` Html report is generated in the 'test-e2e\target\site\serenity' folder.
