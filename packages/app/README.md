<div align="center" style="margin-bottom: 50px;">

# The Blockstack App

</div>

Source code is available on Github at https://github.com/blockstack/ux/tree/master/packages/app

The Blockstack App is an application for interacting and authenticating with [Blockstack](https://blockstack.org) apps. It can be used as a hosted web app (available at [app.blockstack.org](https://app.blockstack.org)) or as a browser extension.

To use this application with your own Blockstack App, we recommend using [Blockstack Connect](https://github.com/blockstack/connect).

Table of Contents:

<!-- TOC depthFrom:2 -->

- [Development](#development)
  - [Setup](#setup)
  - [Run Locally](#run-locally)
- [Building and using as a browser extension](#building-and-using-as-a-browser-extension)
  - [Installing for Chrome/Brave](#installing-for-chromebrave)
  - [Installing for Firefox](#installing-for-firefox)

<!-- /TOC -->

## Development

Although this app is usable as a browser extension, the best interface for development is as a normal web app. This is because it's faster and easier to develop it as a web app, for reasons like hot module loading, and not having to deal with the browser extensions UI constantly.

### Setup

After cloning this repository, install dependencies:

~~~bash
yarn
~~~

### Run Locally

~~~bash
yarn dev
~~~

Then, open [localhost:8080](http://localhost:8080).

## Build and install browser extension

First navigate to the app directory:

~~~bash
cd packages/app
~~~

Then build the project:

~~~bash
yarn prod:ext
~~~

If installing for Chrome or Brave:

1. Go to: [**chrome://extensions**](chrome://extensions)
2. Toggle: "**developer mode**" on.
3. Click on: "**Load unpacked**"
4. Select the newly created folder "**dist**" from the project folder.

If installing for Firefox:

1. Go to: [**about:debugging**](about:debugging)
2. Click on "**This Firefox**"
3. Click on: "**Load Temporary Add-on…**"
4. Open the newly created folder "**dist**" from the project folder, and choose the "**manifest.json**" file.
