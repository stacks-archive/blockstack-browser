# Blockstack UX Team Monorepo

This monorepo contains a few key packages that the User Experience team at Blockstack maintains:

- [`app`](./packages/app): An application for authenticating into Blockstack apps. Available as a web app and a browser extension.
- [`@blockstack/connect`](./packages/connect): A developer tool for building excellent user experiences in Blockstack apps
- [`@blockstack/ui`](./packages/ui): Blockstack's internal design system and React component library
- [`@blockstack/keychain`](./packages/keychain): A library for Blockstack identity management
- [`test-app`](./packages/test-app): A simple React app for testing out Connect and the App.
- [`ui-docs`](./packages/ui-docs): A documentation site for `@blockstack/ui`.

## Development environment setup

The first time you setup a development environment for this repository, follow these steps:

1. Clone this package.
2. Run `yarn` to install dependencies
3. Run `yarn bootstrap` to link dependencies within this repository
4. In the command line, run `yarn dev` which will run two apps:
    - `packages/test-app` which runs at localhost:3000 and implements an example of connect
    - `packages/app` which is the auth app, running at localhost:8080

For development instructions of specific packages, see the `README` in each package folder.
