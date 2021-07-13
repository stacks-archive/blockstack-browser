---
'@stacks/wallet-web': patch
---

This update adds better error handling for when a transaction is failed to broadcast. Sometimes the endpoint returns a string as an error message, and previously that was accepted because there was no validation happening on the string. The string is now validated to be a correct txid, and if it fails, the UI will display the correct error message.
