---
'@stacks/wallet-web': patch
---

This update does a minor refactor to how we were fetching BNS names for a given address, and improves the performance of the application by removing the use of the jotai util `waitForAll` from the names atom.
