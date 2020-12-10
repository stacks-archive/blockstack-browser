<div align="center" style="margin-bottom: 50px;">

# The Blockstack App

</div>

Source code is available on Github at https://github.com/blockstack/ux/tree/master/packages/app

The Blockstack App is an application for interacting and authenticating with [Blockstack](https://blockstack.org) apps. It can be used as a hosted web app (available at [app.blockstack.org](https://app.blockstack.org)) or as a browser extension.

To use this application with your own Blockstack App, we recommend using [Blockstack Connect](https://github.com/blockstack/ux/packages/connect).

Table of Contents:

<!-- TOC depthFrom:2 -->

- [Development](#development)
  - [Setup](#setup)
  - [Run Locally](#run-locally)
- [Build and install browser extension](#build-and-install-browser-extension)

<!-- /TOC -->

## Development

Although this app is usable as a browser extension, the best interface for development is as a normal web app. This is because it's faster and easier to develop it as a web app, for reasons like hot module loading, and not having to deal with the browser extensions UI constantly.

### Setup

Clone this repository and install dependencies:

~~~bash
git clone https://github.com/blockstack/ux
cd ux
yarn
~~~

### Run Locally

~~~bash
yarn dev
~~~

Then, open [localhost:8080](http://localhost:8080).

## Build and install browser extension

Documentation for building browser extensions can be found in the [top-level README.md file](https://github.com/blockstack/ux/tree/master#building-browser-extensions) of this repository.
