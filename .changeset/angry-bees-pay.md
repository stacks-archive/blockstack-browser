---
'@stacks/wallet-web': patch
---

Adds [dependency-cruiser](https://github.com/sverweij/dependency-cruiser), a tool which can both visualize and validate import dependencies in the Stacks Wallet. This PR adds a single rule stating that the `src/components` folder cannot import from `src/pages`
