---
'@stacks/wallet-web': patch
---

Removes the `COMMIT_SHA` global variable for production builds, to help with reproducible builds in any environment.
