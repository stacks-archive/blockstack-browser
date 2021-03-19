---
'@stacks/wallet-web': patch
---

Added extra verification to a transaction signing request. If an app tries to have you sign a transaction, but you haven't logged into that app with any of the accounts currently in your wallet, the transaction will be blocked. Fixes [#1076](https://github.com/blockstack/stacks-wallet-web/issues/1076) and [#1078](https://github.com/blockstack/stacks-wallet-web/issues/1078).
