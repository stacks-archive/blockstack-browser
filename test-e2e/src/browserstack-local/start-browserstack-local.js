/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
const browserstack = require("browserstack-local");
const bsLocal = new browserstack.Local();

/* replace <browserstack-accesskey> with your key.
 You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
  */
const BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';
const RANDOM_STRING = 'RANDOM_STRING';

const bsLocalArgs = {
  key: process.env[BROWSERSTACK_AUTH].trim().split(/:(.+)/)[1],
  "local-identifier": process.env[RANDOM_STRING],
  force: "true",
  verbose: "true",
};

bsLocal.start(bsLocalArgs, (error) => {
  if (error) return console.error(error);
  console.log("Started BrowserStackLocal");
  return null;
});
