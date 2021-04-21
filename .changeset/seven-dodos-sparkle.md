---
'@stacks/wallet-web': minor
---

This removes the dependence on `redirect_uri` when generating an `appPrivateKey`. Instead, the wallet will use the URL of the tab that originated this request.

It also includes two chores:

- Remove the `terser-webpack-plugin` package, which is unused and was flagged in `yarn audit`
- Bumps the version of node.js used in Github Actions from 12.16 to 12.22
