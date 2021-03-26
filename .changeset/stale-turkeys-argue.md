---
'@stacks/wallet-web': patch
---

This update resolves these issues:
- fixes [#969](https://github.com/blockstack/stacks-wallet-web/issues/969)
- fixes [#1093](https://github.com/blockstack/stacks-wallet-web/issues/1093)

**Changes**

refactors the hook `use-setup-tx` ([before](https://github.com/blockstack/stacks-wallet-web/blob/35bb9d7a786ffe236322a7c96eb091cc3b94fa49/src/common/hooks/use-setup-tx.ts#L28), [after](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/use-setup-tx.ts)) into smaller, more manageable parts. From the original hook, there are a few new ones that each take care of their own responsibility:
- [useAccountSwitchCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-account-switch-callback.ts)
- [useDecodeRequestCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-decode-request-callback.ts)
- [useNetworkSwitchCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-network-switch-callback.ts)
- [usePostConditionsCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-post-conditions-callback.ts) (the one we care about for this PR)
  - [post-conditions-utils.ts](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/post-condition-utils.ts#L16)
  - [postConditionFromString](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/utils.ts#L168)

**Other misc fixes**
- There was a bug where if a `token_transfer` had post conditions defined (which it should not), it would not display them. [This fixes that bug.](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/components/transactions/post-conditions/list.tsx#L33)
- Very briefly refactored the base component that displays the post conditions, [see component](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/components/transactions/post-conditions/single.tsx#L88).
