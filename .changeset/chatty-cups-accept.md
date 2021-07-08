---
'@stacks/wallet-web': patch
---

This fixes the logic used to allow or disallow the usage of decimals in the send field. Previously SIP 10 compliant tokens that defined a value of "0" would pass the condition, thus allowing users to incorrectly try to send a decimal value of a token which uses no decimal places.
