Blockstack Browser
============

[![Slack](http://slack.blockstack.org/badge.svg)](http://slack.blockstack.org/)

The Blockstack Browser allows you to explore the Blockstack internet.

---

### Getting up and running

1. Clone this repo from `https://github.com/blockstack/blockstack-browser.git`
2. Run `npm install` from the root directory
3. Run `gulp proxy` which starts the CORS proxy on port 1337
4. In another terminal, run `gulp dev` (may require installing Gulp globally `npm install gulp -g`)
5. Your browser will automatically be opened and directed to the browser-sync proxy address
6. To prepare assets for production, run the `npm run build` task (Note: the production task does not fire up the browser-sync server, and won't provide you with browser-sync's live reloading. Simply use `gulp dev` during development. More information below)

Now that `gulp dev` is running, the server is up as well and serving files from the `/build` directory. Any changes in the `/app` directory will be automatically processed by Gulp and the changes will be injected to any open browsers pointed at the proxy address.

---

This app uses the latest versions of the following libraries:

- [React Rocket Boilerplate](https://github.com/jakemmarsh/react-rocket-boilerplate)
- [ReactJS](https://github.com/facebook/react)
- [React Router](https://github.com/rackt/react-router)
- [RefluxJS](https://github.com/spoike/refluxjs)
- [Gulp](http://gulpjs.com/)
- [Browserify](http://browserify.org/)
- [Redux](https://github.com/reactjs/redux)
- [Babel](https://github.com/babel/babel)

Along with many Gulp libraries (these can be seen in either `package.json`, or at the top of each task in `/gulp/tasks/`).

---

### Running tests

1. If you haven't already, follow steps 1 & 2 above
2. If you haven't already run `gulp dev` or `npm run build` at least once, run `npm run build`
3. Run all tests in the `tests/` directory with the `gulp test` command
  * A single file can be run by specifing an `-f` flag: `gulp test -f <PATH_TO_TEST_FILE>`
    * In the `PATH_TO_TEST_FILE`, it is possible to omit the `tests/` prefix, as well as the `.test.js` suffix. They will be automatically added if not detected.

##### Code coverage

When running tests, code coverage will be automatically calculated and output to an HTML file using the [Istanbul](https://github.com/gotwarlost/istanbul) library. These files can be seen in the generated `coverage/` directory.


### Building for macOS

You'll need a working installation of Xcode 8 (or higher). You will need to
install the node to native binary tool globally by running: `npm install nexe -g`.

Before working on the Mac app in Xcode, you'll need to go through this build process
once. It creates and copies the needed proxy binaries into place and copies a built version of
the browser web app into the source tree. Please note that the first build will take
a while as `nexe` downloads and compiles a source copy of node.

Run `gulp mac`.

This has only been tested on macOS Sierra 10.12.
