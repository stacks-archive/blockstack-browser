Blockstack Browser
============

[![Slack](http://chat.blockstack.org/badge.svg)](http://chat.blockstack.org/)

The Blockstack Browser allows you to explore the Blockstack internet.

---

## Table of contents

- [Releases](#releases)
- [Developing](#developing)
- [Building for macOS](#building-for-macos)
- [Building for the Web](#building-for-the-web)
- [Contributing](#contributing)
- [Tech Stack](#tech-stack)
- [Testing](#testing)

---

## Releases

[Download the latest release](https://github.com/blockstack/blockstack-portal/releases)

## Developing

Blockstack Portal requires a local instance of Blockstack Core to run. To get started, first install Blockstack Core and then proceed with the installation of Blockstack Portal.

### Part 1: Install Blockstack Core

1. Create and enter a virtual environment
1. Install blockstack core from the latest development branch: `pip install git+https://github.com/blockstack/virtualchain.git@rc-0.14.1 git+https://github.com/blockstack/blockstack-profiles-py.git@rc-0.14.1 git+https://github.com/blockstack/dns-zone-file-py.git@rc-0.14.1 git+https://github.com/blockstack/blockstack-core.git@rc-0.14.1b`
1. Setup the Blockstack Core wallet: `blockstack setup`
1. Start the Blockstack Core API: `blockstack api start`
1. Make sure there's a local Blockstack Core API running by checking `http://localhost:6270/v1/names/blockstack.id` to see if it returns a response.

### Part 2: Install Blockstack Portal

1. Clone this repo: `git clone https://github.com/blockstack/blockstack-browser.git`
1. Install node dependencies: `npm install`
1. Run `npm run dev` to run locally

*Note: When you do `npm run dev` you're running two concurrent processes. One starts a CORS proxy on port 1337. The second runs a BrowserSync process that watches the assets in `/app`, then builds them and places them in `/build`, and in turn serves them up on port 3000. Anytime changes are made to the original files, they are rebuilt and resynced to the browser frames you have open.*


## Building for macOS

1. Make sure you have a working installation of Xcode 8 or higher & valid Mac Developer signing certificate
1. Run `npm install nexe -g` to install the "node to native" binary tool globally
1. Open the Blockstack macOS project in Xcode and configure your code signing development team (You only need to do this once)
1. Run `npm run mac` to build a release signed with your Mac Developer certificate

*Note: You only need to run `nexe` once but the first build will take a while as `nexe` downloads and compiles a source copy of node. Then it creates and copies the needed proxy binaries into place and copies a built version of the browser web app into the source tree.*

*Note: This has only been tested on macOS Sierra 10.12.*

### Building a macOS release for distribution

1. Ensure you have valid Developer ID signing credentials in your Keychain. (See https://developer.apple.com/developer-id/ for more information)
1. Follow the instructions in the above section for building for macOS.
1. Open the Blockstack macOS project in Xcode.
1. Select the Product menu and click Archive.
1. When the archive build completes, the Organizer window will open. Select your new build.
1. Click "Export..."
1. Click "Export a Developer ID-signed Application"
1. Choose the development team with the Developer ID you'd like to use to sign the application.
1. Click "Export" and select the location to which you would like to save the signed build.


## Building for the Web

1. Make sure you've cloned the repo and installed all npm assets (as shown above)
1. Run `npm run web`


## Contributing

We do project-wide sprints every two weeks and we're always looking for more help.

If you'd like to contribute, head to the [contributing guidelines](/CONTRIBUTING.md). Inside you'll find directions for opening issues, coding standards, and notes on development.


## Tech Stack

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


## Testing

1. If you haven't already, follow steps 1 & 2 above
2. If you haven't already run `npm run dev` or `npm run build` at least once, run `npm run build`
3. Run all tests in the `tests/` directory with the `npm run test` command
  * A single file can be run by specifing an `-f` flag: `npm run test -f <PATH_TO_TEST_FILE>`
    * In the `PATH_TO_TEST_FILE`, it is possible to omit the `tests/` prefix, as well as the `.test.js` suffix. They will be automatically added if not detected.

*Note: When running tests, code coverage will be automatically calculated and output to an HTML file using the [Istanbul](https://github.com/gotwarlost/istanbul) library. These files can be seen in the generated `coverage/` directory.*
