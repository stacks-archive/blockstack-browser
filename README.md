# Hiro Wallet for Web

[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/ldinpeekobnhjjdofggfgjlcehhmanlj?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/stacks-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj)
[![Mozilla Add-on](https://img.shields.io/amo/stars/hiro-wallet?label=Firefox%20Add-on)](https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet/)
[![coverage](https://raw.githubusercontent.com/blockstack/stacks-wallet-web/gh-pages/badge.svg)](https://blockstack.github.io/stacks-wallet-web/)

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/blockstack/stacks-wallet-web)

Hiro Wallet is a browser extension for managing your digital assets and connecting to apps built with the Stacks blockchain.

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
  - [Adding a Changeset](#adding-a-changeset)
- [Production](#production)
  - [Building browser extensions](#building-browser-extensions)
    - [Optional: use Docker](#optional-use-docker)
  - [Install browser extension from source](#install-browser-extension-from-source)
    - [Chromium](#chromium-1)
    - [Firefox](#firefox-1)
- [Security](#security)
  - [Audit Report](#audit-report)

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

After starting development mode, you'll have to add it to your browser of choice. Hiro Wallet for web currently only
supports chromium and firefox browsers. When you run `yarn dev`, it will compile the application to the `/dist` folder
within the project.

#### Chromium

1. Go to: `chrome://extensions`
2. Toggle: **"developer mode"** on
3. Click on: **"Load unpacked"**
4. Navigate to the `stacks-wallet-web` project directory
5. Select the `dist` directory to load the extension

#### Firefox

1. Go to: `about:debugging`
2. Click on **"This Firefox"**
3. Click on: **"Load Temporary Add-on…"**
4. Navigate to the `stacks-wallet-web` project directory
5. Select the `manifest.json` file from the `stacks-wallet-web/dist` directory.

### Adding a Changeset

This repository utilizes [Changesets](https://github.com/atlassian/changesets) in order to create a `CHANGELOG.md` file and update the version of the wallet. Each pull request should include a changeset, which includes a description of the changes made in your PR. Most information can be found in the [changesets repository](https://github.com/atlassian/changesets), but the quickest way to add a changeset is to run `yarn changeset add`. You'll be prompted to enter a summary of your changes.

Once your PR is merged into the `main` branch, a new pull request will automatically be created. This is a "release" pull request. The PR will merge your changesets into the [`CHANGELOG.md`](https://github.com/blockstack/ux/blob/main/CHANGELOG.md) file, and will update the version of the wallet appropriately, depending on the type of change you've made.

In general, you should not update the version of the wallet (found in `package.json`). Each commit in a PR will generate a "beta" version, which can be used for testing.

## Production

### Build from source

Run the following from within this repository's root directory if you've pulled it with Git:

```bash
sh build-ext.sh
```

Alternatively, run the following if you've downloaded the source code as a zip file from GitHub:

#### Optional: Use docker

```
docker build -f Dockerfile -t stacks-wallet-web . \
  && docker run -d --name stacks-wallet-web stacks-wallet-web \
  && docker cp stacks-wallet-web:stacks-wallet-chromium.zip . \
  && docker rm -f stacks-wallet-web
```

The extension will be packaged as `stacks-wallet-chromium.zip`.

### Install from source

First, unzip the `stacks-wallet-chromium.zip` file that was generated in the previous step.

Then for Chrome, Brave or Edge:

1. Go to: `chrome://extensions`
2. Toggle: **"developer mode"** on.
3. Click on: **"Load unpacked"**
4. Select the new directory that was unzipped from `stacks-wallet-chromium.zip`.

Alternatively, for Firefox:

1. Go to: `about:debugging`
2. Click on **"This Firefox"**
3. Click on: **"Load Temporary Add-on…"**
4. Navigate inside the new directory that was unzipped from `stacks-wallet-chromium.zip`
5. Select the `manifest.json` file.

## Security

We consider the security of our systems a top priority. But no matter how much effort we put into system security, there can still be vulnerabilities present.

If you discover a security vulnerability, please use one of the following means of communications to report it to us:

- Report the security issue to our [HackerOne program](https://hackerone.com/hiro)
- Report the security issue directly at [security@hiro.so](mailto:security@hiro.so)

Please note this email is strictly for reporting security vulnerabilities. For support queries, contact [wallet@hiro.so](mailto:wallet@hiro.so). Your efforts to responsibly disclose your findings are sincerely appreciated and will be taken into account to acknowledge your contributions.

### Audit Report

In Q1 2021, Hiro partnered with [Least Authority](https://leastauthority.com/), a leading security consultancy with experience in the crypto space, to audit Hiro Wallet for Web. On April 29th 2021, after addressing the major concerns described in the initial findings, as well as a concluding sign off from the Least Authority team, a final report was delivered.

[Download and read the full report here](https://github.com/blockstack/stacks-wallet-web/blob/main/public/docs/least-authority-security-audit-report.pdf)
