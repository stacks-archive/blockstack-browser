---
'@stacks/wallet-web': patch
---

This removes any git commands and instead relies on default env vars provided by github actions. If they don't exist, they aren't used.
