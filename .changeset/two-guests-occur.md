---
'@stacks/wallet-web': patch
---

Fixes webpack's versioning logic to only use "canonical" version on exactly the 'main' branch. Previously it only checked if the branch included "main", so this logic would execute for a branch named like `XX-main`.

This also updates the `@changesets/action` version to point to a specific commit, for security reasons.
