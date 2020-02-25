# Blockstack UX Team Monorepo

This monorepo contains a few key packages that the User Experience team at Blockstack maintains:

- [app]('./packages/app'): An application for authenticating into Blockstack apps. Available as a web app and a browser extension.
- [connect]('./packages/connect'): A developer tool for building excellent user experiences in Blockstack apps
- [ui]('./packages/ui'): Blockstack's internal design system and React component library
- [keychain]('./packages/keychain'): A library for Blockstack identity management

## Development environment setup

The first time you setup a development environment for this repository, follow these steps:

1. Clone this package. 
2. Run `yarn` to install top-level dependencies
3. In the command line, run `yarn lerna bootstrap`
  a. First, this will install dependencies in all packages
  b. Second, `lerna` will "link" each interdependent package
3. Run `yarn build:libs` to build each library package

For development instructions of specific packages, see the `README` in each package folder.