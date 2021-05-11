---
'@stacks/wallet-web': minor
---

Adds support for sponsored transactions. When a developer includes the option `sponsored: true` in a transaction request, the transaction will not be broadcasted. Instead, the developer will need to get the raw transaction and sign it as a sponsor, and then broadcast it.
