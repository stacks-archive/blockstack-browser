<p align="center">
  <img src="https://blockstack.org/images/resources/browser-home-screen@2x.png" alt="Blockstack Browser screenshot" width="686" height="306">
</p>

# Blockstack Browser [![CircleCI](https://img.shields.io/circleci/project/blockstack/blockstack-browser/master.svg)](https://circleci.com/gh/blockstack/blockstack-browser/tree/master) [![License](https://img.shields.io/github/license/blockstack/blockstack-browser.svg)](https://github.com/blockstack/blockstack-browser/blob/master/LICENSE.md) [![Slack](https://img.shields.io/badge/join-slack-e32072.svg?style=flat)](http://slack.blockstack.org/)

The Blockstack Browser allows you to explore the Blockstack internet.

## Table of contents

- [Releases](#releases)
- [Developing](#developing)
- [Building for macOS](#building-for-macos)
- [Building for the Web](#building-for-the-web)
- [Contributing](#contributing)
- [Logging](#logging)
- [Tech Stack](#tech-stack)
- [Maintainer](#maintainer)
- [Testing](#testing)

## Releases

[Download the latest release](https://github.com/blockstack/blockstack-browser/releases)

## Developing

### macOS

*Please note these instructions have only been tested on macOS 10.13*

1. Download and install the [latest release of Blockstack for Mac](https://github.com/blockstack/blockstack-browser/releases).
1. Start Blockstack
1. Option-click the Blockstack menu bar item and select "Enable Development Mode"
1. Clone this repo: `git clone https://github.com/blockstack/blockstack-browser.git`
1. Install node dependencies: `npm install`
1. Run `npm run dev`


### Linux

1. Clone this repo: `git clone https://github.com/blockstack/blockstack-browser.git`
1. Install node dependencies: `npm install`
1. Run `npm run dev-proxy` to start the CORS proxy
1. Run `npm run dev`

*Note: npm dev runs a BrowserSync process that watches the assets in `/app`, then builds them and places them in `/build`, and in turn serves them up on port 3000. When changes are made to the original files, they are rebuilt and re-synced to the browser frames you have open.*

##### Troubleshooting

Common problems and solutions:

* **The sign-in page does not load**:  These instructions run the Browser in development
  mode, which uses a different port (3000) than the production mode (8888).
However, existing applications will direct you to `http://localhost:8888` on
sign-in.  You will need to *manually* edit the URL to change `8888` to `3000`
and refresh the page.

* **The sign-in page does not load with localhost:3000**:  If you have taken the
  above step and the page still does not load, check your `auth=` query
parameter.  If it starts with any number of `/` characters, remove them and
reload the page.  For example, if your `auth=` query looks like
`auth=///abcdef...`, then you will need to change it to `auth=abcdef...`.

## Building for macOS

1. Make sure you have a working installation of Xcode 9 or higher & valid Mac Developer signing certificate
1. Make sure you have an OpenSSL ready for bottling by homebrew by running `brew install openssl --build-bottle`
1. Make sure you have `hg` installed by running `brew install hg`
1. Run `npm install nexe -g` to install the "node to native" binary tool globally
1. Open the Blockstack macOS project in Xcode and configure your code signing development team (You only need to do this once)
1. Run `npm run mac` to build a debug release signed with your Mac Developer certificate

*Note: You only need to run `nexe` once but the first build will take a while as `nexe` downloads and compiles a source copy of node. Then it creates and copies the needed proxy binaries into place and copies a built version of the browser web app into the source tree.*

*Note: This has only been tested on macOS High Sierra 10.13*

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

## Logging

The Browser uses `log4js` for logging. The macOS app uses macOS's unified logging
API, `os_log` for logging.

### macOS

On macOS, the Browser sends log events to the macOS
app's log server. These are then included in macOS's unified logging API. You
can view logs by starting `Console.app`.

To see only `Blockstack` process logs, filter by process by
typing `process: Blockstack` in the search box. You can also filter for only log
entries proactively generated by the BLockstack project using this query:
`subsystem:org.blockstack.portal subsystem:org.blockstack.core subsystem:org.blockstack.mac`
If you'd like to see more detail, enable the inclusion
of Info and Debug messages in the Action menu. Please note that in our experience,
`Console.app` doesn't always show debug messages in real time and only shows them
when doing a log dump as described below.

#### Sending logs to developers

Blockstack logs are included in macOS's unified logging system. This allows
us to easily collect a large amount of information about the user's system when
we need to troubleshoot a problem while protecting their privacy.

1. Press Shift-Control-Option-Command-Period. Your screen will briefly flash.
2. After a few minutes, a Finder window will automatically open to `/private/var/tmp`
3. Send the most recent `sysdiagnose_DATE_TIME.tar.gz` file to your friendly developers.

The most important file in this archive is `system_logs.logarchive`, which will
include recent system logs including Blockstack's logs. You can open it on
a Mac using `Console.app`. The other files include information about your computer
that may help in diagnosing problems.

If you're worried about inadvertently sending some private information,
you can select the log entries you'd like to send inside `Console.app` and copy
them into an email or github issue. To help us debug your problem, we ask that
at a minimum you enable Info and Debug messages and filter by `process: Blockstack`.

More technical users (with admin permission) can use the `sysdiagnose` command
to generate a custom dump of information.

## Tech Stack

This app uses the latest versions of the following libraries:

- [React Rocket Boilerplate](https://github.com/jakemmarsh/react-rocket-boilerplate)
- [ReactJS](https://github.com/facebook/react)
- [React Router](https://github.com/rackt/react-router)
- [RefluxJS](https://github.com/spoike/refluxjs)
- [Redux](https://github.com/reactjs/redux)
- [Babel](https://github.com/babel/babel)
- [Webpack](https://github.com/webpack/webpack)

And a few other smaller modules (these can be found in `package.json`).

## Maintainer

This repository is maintained by [yukan.id](https://explorer.blockstack.org/name/yukan.id).

## Testing

Run all tests in the `test/` directory with the `npm run test` command. A single
file can be run by specifing an `-f` flag: `npm run test <PATH_TO_TEST_FILE>`.

*Note: When running tests, code coverage will be automatically calculated and output to an HTML file using the [Istanbul](https://istanbul.js.org/) library. These files can be seen in the generated `__coverage__/` directory.*

## App Development
### Run the browser in the Blockstack Test Environment

When developing apps, the browser can be run in a docker test environment that is backed by the regtest bitcoin network, hence no real money involved.

The easiest way to get that setup is through docker containers for the api, the browser and the cors-proxy. There is a  [docker-compose.yaml file](https://github.com/blockstack/blockstack-todos/blob/master/docker-compose.yaml) published in the Blockstack todo app repo that does this. To use it, first [install Docker](https://docs.docker.com/engine/installation/) and stop any running Blockstack applications (blockstack-browser or blockstack api) then:

```
$ docker-compose up -d
```

This brings up
1. a `blockstack-core api` node that is backed
   * by a `bitcoind` instance running **regtest** and
   * by a [`blockstack-core`](https://github.com/blockstack/blockstack-core) node built from the test chain.

   The initialization script generates 50 BTCs for the core wallet.
1. a blockstack-browser node. It uses bitcoin addresses that are mapped to regtest bitcoin addresses.
1. a [cors-proxy](https://www.npmjs.com/package/corsproxy) to bypass origin policy issues.

The easiest way to work with this setup is in **Incognito mode** in your browser. Once the images have been pulled down and the containers are started you can open http://localhost:8888.

Choose the Advanced Mode setup and enter the API Password as `blockstack_integration_test_api_password`

### Common Tasks
* You can send bitcoins from the core wallet to the browser wallet by opening the hidden url [http://localhost:8888/wallet/send-core](http://localhost:8888/wallet/send-core)

* You can inspect the mapped bitcoin addresses from the browser node to the regtest address by looking into the log file of the api node (execute `bash` in the api container and look at /tmp/blockstack-run-scenario.blockstack_integration_tests.scenarios.portal_test_env/client/api_endpoint.log).

* You can inspect the api password by looking into the client.ini file of the api node (execute `bash` in the api container and look at /tmp/blockstack-run-scenario.blockstack_integration_tests.scenarios.portal_test_env/client/client.ini)

* You can verify the blockstack version of the api node by running `curl localhost:6270/v1/node/ping`
