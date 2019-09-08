/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
const browserstack = require("browserstack-local");

const bsLocal = new browserstack.Local();

// stop the Local instance
bsLocal.stop((error) => {
  if (error) return console.error(error);
  console.log("Stopped BrowserStackLocal");
  return null;
});
