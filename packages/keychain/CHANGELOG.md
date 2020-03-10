# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.1](https://github.com/blockstack/ux/compare/@blockstack/keychain@0.3.0-beta.3...@blockstack/keychain@0.3.1) (2020-03-10)


### Bug Fixes

* remove alpha/beta versions from ui, keychain ([81dee96](https://github.com/blockstack/ux/commit/81dee96113f26fa5609dbe753d503c909b98ec5f))





# 0.3.0-beta.3 (2020-03-10)


### Bug Fixes

* **keychain:** fixes TS error when deriving config key ([08f9b18](https://github.com/blockstack/ux/commit/08f9b1827c8588aeb42a5b90fe1bd4d786509474))
* **wallet:** typo when fetching config ([816e46b](https://github.com/blockstack/ux/commit/816e46b5dc37fa519d4508f647a62f5a85d3177a))


### Features

* recursively create identities by looking up username ([d5b20ea](https://github.com/blockstack/ux/commit/d5b20ea4cdb94aa2a92c6096642e9abad467e966))
* restore identities from walletConfig ([61ae914](https://github.com/blockstack/ux/commit/61ae914247c45b46a7c1ef42805a37d51309fc03))





# `@blockstack/keychain` Changelog

## 0.2.3 - 2020/2/4

- Added `Wallet#walletConfig`, which allows storing private settings and information related to the current wallet. Data is stored in Gaia, and is encrypted with a uniquely derived wallet-level private key.

## 0.2.0 - 2020/1/27

- All included in PR [#15](https://github.com/blockstack/blockstack-keychain/pull/15)
- Fetch and store a profile.json
- Register subdomains
- Fetch existing usernames
- Update profile.json `apps` section with the `publish_data` scope

## 0.1.1 - 2019/12/2

- Export `encrypt` and `decrypt` from `index.ts`

## 0.1.0 - 2019/11/25

- Integrate asynchronous code from `blockstack.js`
- Use `tsdx` for deployment
- MVP keychain-related methods
