# Stacks Wallet for web

Stacks Wallet is a browser extension for managing your digital assets and connecting to apps built with the Stacks blockchain.

Source code is available on GitHub at https://github.com/blockstack/stacks-wallet-web/tree/main

To use this extension with your own Stacks App, we recommend using [Connect](https://github.com/blockstack/connect).

Table of Contents:

<!-- TOC depthFrom:2 -->

- [Development](#development)
  - [Setup](#setup)
  - [Dev mode](#dev-mode)
    - [Optional: run test app](#optional-run-test-app)
  - [Add extension to your browser](#add-extension-to-your-browser)
    - [Chromium](#chromium)
    - [Firefox](#firefox)
- [Production](#production)
  - [Building browser extensions](#building-browser-extensions)
    - [Optional: use Docker](#optional-use-docker)
  - [Install browser extension from source](#install-browser-extension-from-source)
    - [Chromium](#chromium-1)
    - [Firefox](#firefox-1)

<!-- /TOC -->

## Development

When working locally with `stacks-wallet-web`, it can only be used as you'd use any extension. There is no ability to
run it as a standalone web application.

### Setup

Clone this repository and install dependencies:

```bash
git clone https://github.com/blockstack/stacks-wallet-web
cd stacks-wallet-web
yarn
```

### Dev mode

When working on the extension, you can run it in `development` mode which will watch for any file changes and
use `react-refresh` to update the extension as you work. This gives us near instant reloading of our changes, and
persists the state of the application between changes. To start development mode for the extension, run this command:

```bash
yarn dev
```

#### Optional: run test app

We bundle a test app to use along with the extension. It gives easy access to the various functions that the extension
can do.

In a separate terminal, run:

```bash
yarn dev:test-app
```

### Add extension to your browser

After starting development mode, you'll have to add it to your browser of choice. Stacks Wallet for web currently only
supports chromium and firefox browsers. When you run `yarn dev`, it will compile the application to the `/dist` folder
within the project.

#### Chromium

1. Go to: `chrome://extensions`
2. Toggle: **"developer mode"** on
3. Click on: **"Load unpacked"**
4. Navigate to the `stacks-wallet-web` project directory
5. Select the `dist` directory to load the extension

#### Firefox

1. Go to: `about:debugging `
2. Click on **"This Firefox"**
3. Click on: **"Load Temporary Add-on…"**
4. Navigate to the `stacks-wallet-web` project directory
5. Select the `manifest.json` file.

## Production

### Building browser extensions

From the root of this repository, in the command line, run:

```bash
sh build-ext.sh
```

The extension will be packaged as `stacks-wallet-chromium.zip` inside this folder.

#### Optional: use Docker

1. Build the docker image locally:
   ```bash
   docker build . -t stacks-wallet-web
   ```
2. Copy the built extensions to your local machine:
   ```bash
   docker run -d --name stacks-wallet-web stacks-wallet-web && docker cp stacks-wallet-web:stacks-wallet-chromium.zip . && docker rm -f stacks-wallet-web
   ```

### Install browser extension from source

First, unzip the `stacks-wallet-chromium.zip` file that was generated in the previous step.

#### Chromium

Use these steps when using a Chromium browser, like Chrome, Brave, and Edge.

1. Go to: `chrome://extensions`
2. Toggle: **"developer mode"** on.
3. Click on: **"Load unpacked"**
4. Select the new directory that was unzipped from `stacks-wallet-chromium.zip`.

#### Firefox

1. Go to: `about:debugging `
2. Click on **"This Firefox"**
3. Click on: **"Load Temporary Add-on…"**
4. Navigate inside the new directory that was unzipped from `stacks-wallet-chromium.zip`
5. Select the `manifest.json` file.
