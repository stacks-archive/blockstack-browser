# Blockstack UX Team Monorepo

This monorepo contains a few key packages that the User Experience team at Blockstack maintains:

- [`app`](./packages/app): An application for authenticating into Blockstack apps. Available as a web app and a browser extension.
- [`@stacks/connect`](./packages/connect): A developer tool for building excellent user experiences in Blockstack apps
- [`@stacks/connect-react`](./packages/connect-react): A library for using `@stacks/connect` in React apps
- [`@stacks/connect-ui`](./packages/connect-ui): WebComponent-based UI for displaying an intro modal in Stacks Apps during authentication.
- [`test-app`](./packages/test-app): A simple React app for testing out Connect and the App.

<!-- TOC depthFrom:2 -->

- [Development environment setup](#development-environment-setup)
  - [Running the apps locally](#running-the-apps-locally)
- [Building browser extensions](#building-browser-extensions)
  - [Optional - Build browser extensions using Docker](#optional---build-browser-extensions-using-docker)
- [Install browser extension from source](#install-browser-extension-from-source)

<!-- /TOC -->

## Development environment setup

The first time you setup a development environment for this repository, follow these steps:

~~~bash
git clone https://github.com/blockstack/ux
cd ux
yarn
yarn bootstrap
~~~

1. Clone this package.
2. Run `yarn` to install dependencies
3. Run `yarn bootstrap` to link dependencies within this repository

### Running the apps locally

In the command line, run `yarn dev` which will run two apps:
  - `packages/test-app` which runs at localhost:3000 and implements an example of connect
  - `packages/app` which is the auth app, running at localhost:8080

For development instructions of specific packages, see the `README` in each package folder.

## Building browser extensions

1. From the root of this repository, in the command line, run `sh build-ext.sh`
2. The extension will be packaged as `stacks-wallet-chromium.zip` inside this folder.

### Optional - Build browser extensions using Docker

1. Build the docker image locally:
    ```bash
    docker build . -t ux
    ```

1. Copy the built extensions to your local machine:
    ```bash
    docker run -d --name ux ux && docker cp ux:stacks-wallet-chromium.zip . && docker rm -f ux
    ```

## Install browser extension from source

First, unzip the `stacks-wallet-chromium.zip` file that was generated in the previous step.

If installing for Chrome or Brave:

1. Go to: [**chrome://extensions**](chrome://extensions)
2. Toggle: "**developer mode**" on.
3. Click on: "**Load unpacked**"
4. Select the new folder that was unzipped from `stacks-wallet-chromium.zip`.

If installing for Firefox:

1. Go to: [**about:debugging**](about:debugging)
2. Click on "**This Firefox**"
3. Click on: "**Load Temporary Add-on…**"
4. Inside the new folder that was unzipped from `stacks-wallet-chromium.zip`, select the `manifest.json` file.