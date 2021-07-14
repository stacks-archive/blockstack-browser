---
'@stacks/wallet-web': patch
---

This fixes a bug where if a user switched accounts while on a page like the receive or view secret key, and navigated home, their balances would show stale data related to the previous account they were on.
