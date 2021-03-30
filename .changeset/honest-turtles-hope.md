---
'@stacks/wallet-web': patch
---

Adds Argon2 password hashing. This greatly improves the security of user's encrypted secret keys, because Argon2 vastly increases the time it takes to test a password.
