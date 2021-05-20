---
'@stacks/wallet-web': patch
---

This update removes the `BlockstackProvider` that the extension would inejct into apps. This is to allow apps that are still using legacy auth (`app.blockstack.org`) to work without needing to update to the extension. Other apps should be on the latest versions of connect that no longer use `BlockstackProvider`, but instead use `StacksProvider`.
