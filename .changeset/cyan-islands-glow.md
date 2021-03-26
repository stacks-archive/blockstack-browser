---
'@stacks/wallet-web': minor
---

This update fixes https://github.com/blockstack/stacks-wallet-web/issues/1067. It seems that there were some issues with the way that we were keeping `StacksTransactions` in recoil store. Recoil serializes everything that is in an atom/selector, and that serialization was breaking the transaction class.

**Changes & Improvements**
- validation has been improved on the send screen
- send screen design has been improved slightly moving towards the figma designs
- tickers are now displayed in the same way as the explorer
- error handling now displays a toast if the transaction fails for some reason
- assets now use the same kind of gradient as on the explorer
- amount placeholder updates based on asset selected

![stx-transfer](https://user-images.githubusercontent.com/11803153/111552123-b1cb7800-874f-11eb-9000-3d4cd499fd7c.gif)

![stella-transfer](https://user-images.githubusercontent.com/11803153/111552120-b09a4b00-874f-11eb-8599-b4e2c828e795.gif)
