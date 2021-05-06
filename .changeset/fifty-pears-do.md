---
'@stacks/wallet-web': patch
---

**This fixes two issues:**

There was a race condition such that sometimes when a transaction would be generated from the requestToken, the
postCondition hook would run before the token was decoded, and as such always returned an empty postConditions array.

There was a bug where if the account had a pending function call transaction, the nonce store would never be correct
while the tx was still pending.
