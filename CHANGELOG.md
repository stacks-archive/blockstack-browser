# Changelog

## 2.12.1

### Patch Changes

- [#1440](https://github.com/blockstack/stacks-wallet-web/pull/1440) [`c587eb44`](https://github.com/blockstack/stacks-wallet-web/commit/c587eb44b2481cada9999ace201c5ba8690049a5) Thanks [@aulneau](https://github.com/aulneau)! - This fixes an issue with our github actions deployment process.

## 2.12.0

### Minor Changes

- [#1420](https://github.com/blockstack/stacks-wallet-web/pull/1420) [`0097c7bb`](https://github.com/blockstack/stacks-wallet-web/commit/0097c7bbd31272c0ca9a7d3460dfec363c602a99) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes a visual bug that caused the network drawer to persist longer than expected, and adds in a global app error boundary to capture run time errors and provide a way for users to report issues.

* [#1326](https://github.com/blockstack/stacks-wallet-web/pull/1326) [`f1382d1b`](https://github.com/blockstack/stacks-wallet-web/commit/f1382d1b5f849a19ebe8d2b24ecfce6433de187d) Thanks [@aulneau](https://github.com/aulneau)! - This update replaces our use of recoil for state management to jotai. This gives us tighter integrations with tools such as react-query and rxjs.

### Patch Changes

- [#1301](https://github.com/blockstack/stacks-wallet-web/pull/1301) [`9c24f96e`](https://github.com/blockstack/stacks-wallet-web/commit/9c24f96ef7c3fb6b1dc175ceac7fc9f1f387b9b7) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds [dependency-cruiser](https://github.com/sverweij/dependency-cruiser), a tool which can both visualize and validate import dependencies in the Stacks Wallet. This PR adds a single rule stating that the `src/components` folder cannot import from `src/pages`

* [#1408](https://github.com/blockstack/stacks-wallet-web/pull/1408) [`dcca229f`](https://github.com/blockstack/stacks-wallet-web/commit/dcca229f9efe52136a3b6fde878d901d502cf4e9) Thanks [@aulneau](https://github.com/aulneau)! - This fixes the logic used to allow or disallow the usage of decimals in the send field. Previously SIP 10 compliant tokens that defined a value of "0" would pass the condition, thus allowing users to incorrectly try to send a decimal value of a token which uses no decimal places.

- [#1437](https://github.com/blockstack/stacks-wallet-web/pull/1437) [`df71881e`](https://github.com/blockstack/stacks-wallet-web/commit/df71881e8b0d28e2b5f31e00f2967cb3fa6950b4) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a bug where if a user switched accounts while on a page like the receive or view secret key, and navigated home, their balances would show stale data related to the previous account they were on.

* [#1386](https://github.com/blockstack/stacks-wallet-web/pull/1386) [`cf687aa7`](https://github.com/blockstack/stacks-wallet-web/commit/cf687aa74dca474c560d088cdde1751da78f5672) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This sets up the ability to perform integration tests in full page rather than in the extension popup for transactions.

- [#1294](https://github.com/blockstack/stacks-wallet-web/pull/1294) [`d40af091`](https://github.com/blockstack/stacks-wallet-web/commit/d40af091dc872ed7f21626d0c0738bea86984065) Thanks [@aulneau](https://github.com/aulneau)! - This update adds the current version number next to the logo for better debugging and information display.

* [#1333](https://github.com/blockstack/stacks-wallet-web/pull/1333) [`b6c9a5b8`](https://github.com/blockstack/stacks-wallet-web/commit/b6c9a5b808f4306c2bf6c9cd835070db93e012ca) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates connect version packages to capture changes to the intro modal in the test-app.

- [#1222](https://github.com/blockstack/stacks-wallet-web/pull/1222) [`08fe3e99`](https://github.com/blockstack/stacks-wallet-web/commit/08fe3e996428f23e7ede969d9ab03004ed0be6d0) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Removes unused old code once used in the authenticator

* [#1365](https://github.com/blockstack/stacks-wallet-web/pull/1365) [`8bc31589`](https://github.com/blockstack/stacks-wallet-web/commit/8bc31589e5b696b5b2ec6020313f4b8318729ecb) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This adds integration tests for the wallet settings menu.

- [#1431](https://github.com/blockstack/stacks-wallet-web/pull/1431) [`07b79809`](https://github.com/blockstack/stacks-wallet-web/commit/07b79809ec1115d5c5655e726aaecad416e99951) Thanks [@aulneau](https://github.com/aulneau)! - This update does a minor refactor to how we were fetching BNS names for a given address, and improves the performance of the application by removing the use of the jotai util `waitForAll` from the names atom.

* [#1434](https://github.com/blockstack/stacks-wallet-web/pull/1434) [`ff55f99c`](https://github.com/blockstack/stacks-wallet-web/commit/ff55f99c74e4904d7cf8795e466fe8e602dc3d5d) Thanks [@aulneau](https://github.com/aulneau)! - This update adds better error handling for when a transaction is failed to broadcast. Sometimes the endpoint returns a string as an error message, and previously that was accepted because there was no validation happening on the string. The string is now validated to be a correct txid, and if it fails, the UI will display the correct error message.

- [#1285](https://github.com/blockstack/stacks-wallet-web/pull/1285) [`859d9a64`](https://github.com/blockstack/stacks-wallet-web/commit/859d9a64260be58a096a95b2e685b3658a9a9caf) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes issue where the fee wasn't subtracted from the maximum amount you can send, as well as using the principal's available balance, rather than total.

* [#1404](https://github.com/blockstack/stacks-wallet-web/pull/1404) [`af763d56`](https://github.com/blockstack/stacks-wallet-web/commit/af763d5655948a414ccf7078b835de75061565d9) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds validation to prevent a user from being able to send more than their SIP-10 balance. Fixes #1400

- [#1433](https://github.com/blockstack/stacks-wallet-web/pull/1433) [`a895107f`](https://github.com/blockstack/stacks-wallet-web/commit/a895107f3da2a9a3eed543c29f63575b74be5f7c) Thanks [@aulneau](https://github.com/aulneau)! - This update enables quicker and more responsive refreshing of an accounts remote data

## 2.11.1

### Patch Changes

- [#1308](https://github.com/blockstack/stacks-wallet-web/pull/1308) [`4eeec781`](https://github.com/blockstack/stacks-wallet-web/commit/4eeec7813cbce1ec64919157552484a7c4cb59ed) Thanks [@aulneau](https://github.com/aulneau)! - This updates fixes a display bug that rounded STX values incorrectly. This bug had no effect on values used in transactions, only with the display of the amounts.

## 2.11.0

### Minor Changes

- [#1221](https://github.com/blockstack/stacks-wallet-web/pull/1221) [`b438b324`](https://github.com/blockstack/stacks-wallet-web/commit/b438b324d10dd34d1b22474983f7f62b9d9a3df3) Thanks [@aulneau](https://github.com/aulneau)! - This update refactors much of the architecture of the internal state of the extension and attempts to reduce much of the tech debt we have accumulated.

* [#1293](https://github.com/blockstack/stacks-wallet-web/pull/1293) [`ce60d212`](https://github.com/blockstack/stacks-wallet-web/commit/ce60d212b3f9c0f8e24bac3aa8b73f21a15d8d97) Thanks [@aulneau](https://github.com/aulneau)! - This update improves the error handling we have around unauthorized transactions and expired requests.

- [#1268](https://github.com/blockstack/stacks-wallet-web/pull/1268) [`b2ecacf9`](https://github.com/blockstack/stacks-wallet-web/commit/b2ecacf975875fadeddaa2c195667456c2a2b5e3) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Changes transaction activity screen to order transactions by date, rather than in a single list

### Patch Changes

- [#1292](https://github.com/blockstack/stacks-wallet-web/pull/1292) [`d93a6eac`](https://github.com/blockstack/stacks-wallet-web/commit/d93a6eac2ca0610c5a6fc013895090c313695c48) Thanks [@SergeyVolynkin](https://github.com/SergeyVolynkin)! - This update fixes a regression where the set-password page became mis-aligned.

* [#1299](https://github.com/blockstack/stacks-wallet-web/pull/1299) [`99434b6c`](https://github.com/blockstack/stacks-wallet-web/commit/99434b6c91e49023b3b48386a028f0be6a80ff61) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Refactor of our component organization, making efforts to structure by feature, and giving clearer responsibilities to each top level directory

- [#1269](https://github.com/blockstack/stacks-wallet-web/pull/1269) [`6777a57a`](https://github.com/blockstack/stacks-wallet-web/commit/6777a57a6a474ce204410d349d6bccfc1b5e1ec8) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes issue where pending transactions aren't always shown

* [#1267](https://github.com/blockstack/stacks-wallet-web/pull/1267) [`117abb0c`](https://github.com/blockstack/stacks-wallet-web/commit/117abb0c2a584ee2460603e517961a9bfe77f92e) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes border radius

- [#1291](https://github.com/blockstack/stacks-wallet-web/pull/1291) [`342a1144`](https://github.com/blockstack/stacks-wallet-web/commit/342a11445e409d3d8e8316d19e5da8c3d45bb896) Thanks [@kyranjamie](https://github.com/kyranjamie)! - A handful of UI-related errors were being thrown, this PR fixes them, as well as addressing unknown prop issues with the tooltip component

## 2.10.0

### Minor Changes

- [#1208](https://github.com/blockstack/stacks-wallet-web/pull/1208) [`b76efa57`](https://github.com/blockstack/stacks-wallet-web/commit/b76efa5793ab64a0c7a679c8441ac2e3a6bea0a9) Thanks [@aulneau](https://github.com/aulneau)! - ### SIP 010 support

  The main goal behind this PR was to support tokens that conform to the [SIP 010 Fungible token standard](https://github.com/stacksgov/sips/pull/5). Changes to the
  extension to enable this touched many areas, but mostly had to do with how we construct the state for each token and
  how we are displaying it. I've designed things in a way that we can still display older tokens or other FTs that do not conform
  by using the code we had from before as a fallback when there aren't decimals/symbol/name methods available.

  _High level overview of changes:_

  - dynamically fetch and cache meta data for a given token
  - display and format balances with correct decimal offset
  - display ticker/name as defined in contract
  - allow only tokens that have a correct transfer method to be sent via the extension
  - correct decimal placeholder in amount input field
  - better fallback/loading UI for FTs
  - progressive fallback for tokens that don't conform
  - improved form validation based on meta data
  - automatically switch to "activity" tab on successful transfer
  - other misc improvements

### Patch Changes

- [#1233](https://github.com/blockstack/stacks-wallet-web/pull/1233) [`09dddb5a`](https://github.com/blockstack/stacks-wallet-web/commit/09dddb5a4d034e7d42a854e010fe600b638c4e9e) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds code coverage and deploys to Github Pages https://blockstack.github.io/stacks-wallet-web/

## 2.9.0

### Minor Changes

- [#1175](https://github.com/blockstack/stacks-wallet-web/pull/1175) [`09c9b857`](https://github.com/blockstack/stacks-wallet-web/commit/09c9b857bffab754381703df1314b19fc7fb9ca6) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This adds firing an event when a user cancels an auth or transaction popup which triggers calling an onCancel callback function.

### Patch Changes

- [#1214](https://github.com/blockstack/stacks-wallet-web/pull/1214) [`71524bfc`](https://github.com/blockstack/stacks-wallet-web/commit/71524bfcb1e22792f9429d3fbe11238254ee7da0) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes #1204, where a rerender issues causes users in the onboarding flow to enter a prohibative glitch. Credit to community member @whoabuddy for reporting

## 2.8.0

### Minor Changes

- [#1193](https://github.com/blockstack/stacks-wallet-web/pull/1193) [`0e3619ea`](https://github.com/blockstack/stacks-wallet-web/commit/0e3619eadfbed22c5a7668c0518cf0c5928ca085) Thanks [@aulneau](https://github.com/aulneau)! - This update refactors and improve much of the UI and functionality of the transaction signing popup. Fixes these issues: #1172 #1165 #1146 #1115 #1147.

### Patch Changes

- [#1194](https://github.com/blockstack/stacks-wallet-web/pull/1194) [`c331563a`](https://github.com/blockstack/stacks-wallet-web/commit/c331563aefe2a37d7161a7998e5ed19190483db1) Thanks [@aulneau](https://github.com/aulneau)! - This update adds initial support for fetching and dispaying names associated with a given account stx address.

* [#1200](https://github.com/blockstack/stacks-wallet-web/pull/1200) [`5d863cb8`](https://github.com/blockstack/stacks-wallet-web/commit/5d863cb8a21bf85ddef0a267a31ddbe184d65c42) Thanks [@aulneau](https://github.com/aulneau)! - This update removes the `BlockstackProvider` that the extension would inejct into apps. This is to allow apps that are still using legacy auth (`app.blockstack.org`) to work without needing to update to the extension. Other apps should be on the latest versions of connect that no longer use `BlockstackProvider`, but instead use `StacksProvider`.

- [#1178](https://github.com/blockstack/stacks-wallet-web/pull/1178) [`3c26a6b8`](https://github.com/blockstack/stacks-wallet-web/commit/3c26a6b88b3095b20444cccd8efbebf93f2098d4) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a bug with the positioning of the popup to fallback to the default window object if the chrome extension api window is not available.

## 2.7.1

### Patch Changes

- [#1173](https://github.com/blockstack/stacks-wallet-web/pull/1173) [`c6d18b45`](https://github.com/blockstack/stacks-wallet-web/commit/c6d18b4507eab3420ce29946c6bad15a11769e41) Thanks [@aulneau](https://github.com/aulneau)! - This removes any git commands and instead relies on default env vars provided by github actions. If they don't exist, they aren't used.

## 2.7.0

### Minor Changes

- [#1168](https://github.com/blockstack/stacks-wallet-web/pull/1168) [`7ac4c8fe`](https://github.com/blockstack/stacks-wallet-web/commit/7ac4c8fe66d47fbad58983f240299713f808c900) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes the positioning of the popup in relation to the primary window that fired the action

### Patch Changes

- [#1166](https://github.com/blockstack/stacks-wallet-web/pull/1166) [`5e124022`](https://github.com/blockstack/stacks-wallet-web/commit/5e124022a673e39a2c3191e8a2a23713337867e7) Thanks [@hstove](https://github.com/hstove)! - Removes the `COMMIT_SHA` global variable for production builds, to help with reproducible builds in any environment.

* [#1171](https://github.com/blockstack/stacks-wallet-web/pull/1171) [`0814c1c6`](https://github.com/blockstack/stacks-wallet-web/commit/0814c1c6bbca6c12ac8b95f8d8b9a45a4857a157) Thanks [@aulneau](https://github.com/aulneau)! - This update cleans up the webpack config and updates many of our dependencies, and fixes some build related CI tasks

## 2.6.0

### Minor Changes

- [#1149](https://github.com/blockstack/stacks-wallet-web/pull/1149) [`8984f137`](https://github.com/blockstack/stacks-wallet-web/commit/8984f137f4fb7932ce569376685dbce6db50eeeb) Thanks [@aulneau](https://github.com/aulneau)! - This update removed all use of redux in our application in favor of Recoil.

## 2.5.0

### Minor Changes

- [#1110](https://github.com/blockstack/stacks-wallet-web/pull/1110) [`9cb73658`](https://github.com/blockstack/stacks-wallet-web/commit/9cb736581044a6b64eab3158e1eb604be622dfb2) Thanks [@agraebe](https://github.com/agraebe)! - Adds support for sponsored transactions. When a developer includes the option `sponsored: true` in a transaction request, the transaction will not be broadcasted. Instead, the developer will need to get the raw transaction and sign it as a sponsor, and then broadcast it.

### Patch Changes

- [#1161](https://github.com/blockstack/stacks-wallet-web/pull/1161) [`e28302b1`](https://github.com/blockstack/stacks-wallet-web/commit/e28302b1fb61cedc9279e4fdb25e14868dcce913) Thanks [@aulneau](https://github.com/aulneau)! - Updates our dependencies on @stacks/connect and @stacks/connect-react to the latest version of each.

* [`3599f0d0`](https://github.com/blockstack/stacks-wallet-web/commit/3599f0d08db173467d30dcf87a3e50f136b59d52) Thanks [@aulneau](https://github.com/aulneau)! - Updates the dockerfile and github actions to improve out publishing workflow.

## 2.4.7

### Patch Changes

- [#1155](https://github.com/blockstack/stacks-wallet-web/pull/1155) [`fc2cc397`](https://github.com/blockstack/stacks-wallet-web/commit/fc2cc397eab04ff7428baea1f9d525d522cc00e7) Thanks [@aulneau](https://github.com/aulneau)! - Updates the github actions to break out the different jobs for each browser extension.

## 2.4.6

### Patch Changes

- [#1139](https://github.com/blockstack/stacks-wallet-web/pull/1139) [`f00d1c14`](https://github.com/blockstack/stacks-wallet-web/commit/f00d1c144073dfc6bf806a5e27fd3427d9682ce8) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes onboarding elements from being pushed to the bottom of the screen and popup by removing the automatic margin-top spacing.

* [`86039691`](https://github.com/blockstack/stacks-wallet-web/commit/86039691ad4930bc22cf7fb30f1883d7e8fb1808) Thanks [@aulneau](https://github.com/aulneau)! - Made some fixes to the webpack config to better support building the extension from the DockerFile.

## 2.4.5

### Patch Changes

- [#1134](https://github.com/blockstack/stacks-wallet-web/pull/1134) [`a2d00798`](https://github.com/blockstack/stacks-wallet-web/commit/a2d0079838c566344d4066cef3eb3f5ef6c2c262) Thanks [@aulneau](https://github.com/aulneau)! - **This fixes two issues:**

  There was a race condition such that sometimes when a transaction would be generated from the requestToken, the
  postCondition hook would run before the token was decoded, and as such always returned an empty postConditions array.

  There was a bug where if the account had a pending function call transaction, the nonce store would never be correct
  while the tx was still pending.

## 2.4.4

### Patch Changes

- [#1129](https://github.com/blockstack/stacks-wallet-web/pull/1129) [`1f5e24ab`](https://github.com/blockstack/stacks-wallet-web/commit/1f5e24ab18bad8d4c5d04845c38c39dff7d9eec3) Thanks [@markmhx](https://github.com/markmhx)! - This is a patch version bump to get aligned with a manual version bump that was submitted to extension builds.

* [#1137](https://github.com/blockstack/stacks-wallet-web/pull/1137) [`2f0202a1`](https://github.com/blockstack/stacks-wallet-web/commit/2f0202a1ff26c49cc181a713eddf31e103b30eeb) Thanks [@aulneau](https://github.com/aulneau)! - Adds the ability to submit an attachment alongside a transaction. It displays the attachment in a separate row if present. It prints it as ascii if the attachment is composed of only readable characters, otherwise it displays it as a hex string.

  <img width="554" alt="Screenshot 2021-05-05 at 9 40 16 PM" src="https://user-images.githubusercontent.com/5727806/117242873-f936c200-adea-11eb-83f3-8054b8029c58.png">

## 2.4.2

### Patch Changes

- [#1127](https://github.com/blockstack/stacks-wallet-web/pull/1127) [`4a629e04`](https://github.com/blockstack/stacks-wallet-web/commit/4a629e04317a2b1a568c11a9512af74049dc3bb2) Thanks [@hstove](https://github.com/hstove)! - Fixes the version of the Github Action used to upload the chrome extension

## 2.4.1

### Patch Changes

- [#1117](https://github.com/blockstack/stacks-wallet-web/pull/1117) [`3f3f8762`](https://github.com/blockstack/stacks-wallet-web/commit/3f3f8762e54feac79680730e99bec61518499f48) Thanks [@CharlieC3](https://github.com/CharlieC3)! - Updates our Github Actions to automatically publish production versions of the extension to the Chrome and Firefox stoes.

## 2.4.0

### Minor Changes

- [#1123](https://github.com/blockstack/stacks-wallet-web/pull/1123) [`9985a3cb`](https://github.com/blockstack/stacks-wallet-web/commit/9985a3cbfcb8ac8332cde20592e0991b661eec93) Thanks [@hstove](https://github.com/hstove)! - This removes the dependence on `redirect_uri` when generating an `appPrivateKey`. Instead, the wallet will use the URL of the tab that originated this request.

  It also includes two chores:

  - Remove the `terser-webpack-plugin` package, which is unused and was flagged in `yarn audit`
  - Bumps the version of node.js used in Github Actions from 12.16 to 12.22

## 2.3.1

### Patch Changes

- [#1107](https://github.com/blockstack/stacks-wallet-web/pull/1107) [`054cef76`](https://github.com/blockstack/stacks-wallet-web/commit/054cef763bc72cddfb3edcb8098afb86428d725a) Thanks [@aulneau](https://github.com/aulneau)! - This update removes all analytics calls we were using while the extension was in alpha.

* [#1092](https://github.com/blockstack/stacks-wallet-web/pull/1092) [`81ed8f4e`](https://github.com/blockstack/stacks-wallet-web/commit/81ed8f4e1d539842227bcb0b39b8664267b07ebc) Thanks [@hstove](https://github.com/hstove)! - Added extra verification to a transaction signing request. If an app tries to have you sign a transaction, but you haven't logged into that app with any of the accounts currently in your wallet, the transaction will be blocked. Fixes [#1076](https://github.com/blockstack/stacks-wallet-web/issues/1076) and [#1078](https://github.com/blockstack/stacks-wallet-web/issues/1078).

- [#1099](https://github.com/blockstack/stacks-wallet-web/pull/1099) [`3a387b8e`](https://github.com/blockstack/stacks-wallet-web/commit/3a387b8e0343276e88ba21da9aa79b71d7e3b7e3) Thanks [@hstove](https://github.com/hstove)! - Adds Argon2 password hashing. This greatly improves the security of user's encrypted secret keys, because Argon2 vastly increases the time it takes to test a password.

## 2.3.0

### Minor Changes

- [#1084](https://github.com/blockstack/stacks-wallet-web/pull/1084) [`ae5c723e`](https://github.com/blockstack/stacks-wallet-web/commit/ae5c723ee2eb7fe50b1fac16ee9e353753ce4ed7) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes https://github.com/blockstack/stacks-wallet-web/issues/1067. It seems that there were some issues with the way that we were keeping `StacksTransactions` in recoil store. Recoil serializes everything that is in an atom/selector, and that serialization was breaking the transaction class.

  **Changes & Improvements**

  - validation has been improved on the send screen
  - send screen design has been improved slightly moving towards the figma designs
  - tickers are now displayed in the same way as the explorer
  - error handling now displays a toast if the transaction fails for some reason
  - assets now use the same kind of gradient as on the explorer
  - amount placeholder updates based on asset selected

  ![stx-transfer](https://user-images.githubusercontent.com/11803153/111552123-b1cb7800-874f-11eb-9000-3d4cd499fd7c.gif)

  ![stella-transfer](https://user-images.githubusercontent.com/11803153/111552120-b09a4b00-874f-11eb-8599-b4e2c828e795.gif)

* [#1095](https://github.com/blockstack/stacks-wallet-web/pull/1095) [`f2092eb8`](https://github.com/blockstack/stacks-wallet-web/commit/f2092eb8a8f644d8bb353c5da58bde0848e385cb) Thanks [@aulneau](https://github.com/aulneau)! - This update resolves these issues:

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

### Patch Changes

- [#1096](https://github.com/blockstack/stacks-wallet-web/pull/1096) [`55635960`](https://github.com/blockstack/stacks-wallet-web/commit/55635960c108a7e184dbd77a38dc8f58c3451f20) Thanks [@aulneau](https://github.com/aulneau)! - This update adds headers to all outbound requests to the `stacks-node-api` server with the product name and version.

* [#1082](https://github.com/blockstack/stacks-wallet-web/pull/1082) [`84553743`](https://github.com/blockstack/stacks-wallet-web/commit/8455374374ee5d88eaa1c28bf0032249cb3d832c) Thanks [@hstove](https://github.com/hstove)! - Updates our dependencies so that all versions are pinned. Also adds some checks to CI to make sure dependencies are pinned, and that `yarn audit` does not flag anything.

## 2.2.0

### Minor Changes

- [#1065](https://github.com/blockstack/stacks-wallet-web/pull/1065) [`ed019a48`](https://github.com/blockstack/stacks-wallet-web/commit/ed019a48cd15db336b95951f935403a8a119e494) Thanks [@aulneau](https://github.com/aulneau)! - Seed input fixes:

  - A user can now paste in any combination of string and numbers and hopefully get a correct phrase out.
  - The input for the seed phrase is now the perfect height to not scroll when someone enters in a 12 or 24 word phrase
  - Hitting return/enter will submit the form
  - Pasting in a magic recovery code will get validated. Previously we were just checking to see if it was 1 word.

  Password entry fixes:

  - Now debounced and does not blur the input when validation occurs, fixes #942
  - improved the error message to be less dynamic with a sane, static, suggestion, resolves #1031

* [#1068](https://github.com/blockstack/stacks-wallet-web/pull/1068) [`618d6fd7`](https://github.com/blockstack/stacks-wallet-web/commit/618d6fd7f6c40f3cd71d1ffb9ece5cf33cf22bcd) Thanks [@aulneau](https://github.com/aulneau)! - This PR updates elements that link to the explorer throughout the application, and starts the work on displaying transaction items in a more robust way (working towards our designs in figma).

  **Improvements**

  - Added a copy action to the receive button
  - The latest transaction item component has been updated to reflect the designs/states in figma
  - items now link to explorer, fixes #1018
  - fixes the drawers component such that the contents will scroll, and the header stays fixed
  - created an `AccountAvatar` component to display a generated gradient (based on the account, will persist between
    sessions)
  - general code health improvements
  - added [capsize](https://github.com/seek-oss/capsize) for better typography sizing

- [#1068](https://github.com/blockstack/stacks-wallet-web/pull/1068) [`126e2342`](https://github.com/blockstack/stacks-wallet-web/commit/126e2342d1468e92101974d8397c079efe2ff3a5) Thanks [@aulneau](https://github.com/aulneau)! - This bumps the version for our @stacks/ui-\* libs to their latest versions.

### Patch Changes

- [#1054](https://github.com/blockstack/stacks-wallet-web/pull/1054) [`099b75c4`](https://github.com/blockstack/stacks-wallet-web/commit/099b75c4d6dfb1db1bf207ee11aac912006feecb) Thanks [@hstove](https://github.com/hstove)! - Added an integration test for creating an account, locking the wallet, and unlocking

## 2.1.0

### Minor Changes

- [#1053](https://github.com/blockstack/stacks-wallet-web/pull/1053) [`155ea173`](https://github.com/blockstack/stacks-wallet-web/commit/155ea17359a4b4729b737f9c76e4d0a21bd166c9) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where clicking 'create an account' did not properly update the wallet state.

### Patch Changes

- [#1062](https://github.com/blockstack/stacks-wallet-web/pull/1062) [`94d9c12f`](https://github.com/blockstack/stacks-wallet-web/commit/94d9c12fb2bbed0f3d4a7005ed1cb2d6877d5506) Thanks [@aulneau](https://github.com/aulneau)! - This change updates the tooling we use for versioning the exension, moving away from `standard-version` to changesets!

* [#1064](https://github.com/blockstack/stacks-wallet-web/pull/1064) [`5cd3f565`](https://github.com/blockstack/stacks-wallet-web/commit/5cd3f5657a97f057703afc28f5c79eb824dfdecf) Thanks [@hstove](https://github.com/hstove)! - Fixes webpack's versioning logic to only use "canonical" version on exactly the 'main' branch. Previously it only checked if the branch included "main", so this logic would execute for a branch named like `XX-main`.

  This also updates the `@changesets/action` version to point to a specific commit, for security reasons.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 2.0.7 (2021-03-11)

### Bug Fixes

- remove demo app stick header ([3e7d19a](https://github.com/blockstack/ux/commit/3e7d19a6070f8a79555f668cf70c3be64bd0e43b))

### 2.0.6 (2021-03-11)

### Bug Fixes

- location of zip file after build-ext.sh ([0c003ba](https://github.com/blockstack/ux/commit/0c003baaf539dd9d0c53871c2e45c16a0c93de14))

### 2.0.5 (2021-03-11)

### Bug Fixes

- push new version and tags in version job ([98b9d46](https://github.com/blockstack/ux/commit/98b9d46b7413f48e82de3e465557b97c8b3f24bd))

## 2.0.3 (2021-03-08)

### Bug Fixes

- object-src replace ([5f54666](https://github.com/blockstack/ux/commit/5f54666f36a9b24362a09c5f03ebeeed28c12b33))

## 2.0.2 (2021-03-08)

### Bug Fixes

- deps ([86de1c1](https://github.com/blockstack/ux/commit/86de1c1a931ceaa141d4baf0c88612c180216f35))

## 2.0.1 (2021-03-08)

### Bug Fixes

- checkout main when publishing npm on main ([40446a0](https://github.com/blockstack/ux/commit/40446a0264ccdbcc4ddc556118517680e39b246f))

# [2.0.0](https://github.com/blockstack/ux/compare/@stacks/app@1.20.16...@stacks/app@2.0.0) (2021-03-05)

### Bug Fixes

- add ability to view secret key ([d7dca7d](https://github.com/blockstack/ux/commit/d7dca7d580f4dc294dab7b3b70ee40ae29a85b12))
- add in warning ([2906270](https://github.com/blockstack/ux/commit/2906270f5fb9ed952b5c9c58f5306d06c618a7ef))
- authentication error ([6abf504](https://github.com/blockstack/ux/commit/6abf504de6995e357c9c8fac7a291fe42e5edb1a))
- bad state after resetting recoil state ([1e89762](https://github.com/blockstack/ux/commit/1e8976275e9e961d8ffb327c114bbd267b44a5bb))
- broken extension locked state, fixes [#760](https://github.com/blockstack/ux/issues/760) ([c2bca4e](https://github.com/blockstack/ux/commit/c2bca4e0da406baaf9447a33bc82f89315de8be5))
- broken state after restoring extension ([7baf146](https://github.com/blockstack/ux/commit/7baf14648332dead4b4096881c4325ecff22b20c))
- bug when creating new account ([7bdeec6](https://github.com/blockstack/ux/commit/7bdeec6984f860fcf71ff18aa8a60c770f01ccbe))
- capitalize secret key, fixes [#768](https://github.com/blockstack/ux/issues/768) ([0706230](https://github.com/blockstack/ux/commit/0706230589202c4e4d7b452271f9340548004e7c))
- choose account page tweaks, fixes [#735](https://github.com/blockstack/ux/issues/735) ([6ae6889](https://github.com/blockstack/ux/commit/6ae688929363c6d0d8de4e75cd5d0db7cc0dbc06))
- close icon in drawers ([c4f1def](https://github.com/blockstack/ux/commit/c4f1defebe21ce32f8f6ff1d4b2de5c538db7959))
- conditional bug ([5f2ad4a](https://github.com/blockstack/ux/commit/5f2ad4aca1fb0f20ef9ae7a3c69d899654f5e1e6))
- correct network/chainID matching in tx signing, nonce error ([6190d5f](https://github.com/blockstack/ux/commit/6190d5fcfb62067d494718532215a1e043db8594))
- cursor on settings popover, fixes [#739](https://github.com/blockstack/ux/issues/739) ([8d58259](https://github.com/blockstack/ux/commit/8d58259d920267051ddac5809fdddfd05f215754))
- default font-size in extension ([320fea6](https://github.com/blockstack/ux/commit/320fea633eb67fb9c63afa501953c528496fbf64))
- font sizes on tx popup ([00bf475](https://github.com/blockstack/ux/commit/00bf475d13c8175755347b6ecf48dfc0cae8b586))
- header alignment ([7121f8a](https://github.com/blockstack/ux/commit/7121f8a3039017f1def47455bfed937c66f0f285))
- hide actions during onboarding, fixes [#738](https://github.com/blockstack/ux/issues/738) ([d1cede0](https://github.com/blockstack/ux/commit/d1cede0f2cc38a5d371455ea28d824d41adb682c))
- improve general sizing and layout, refactor some layout elements ([91f580c](https://github.com/blockstack/ux/commit/91f580c5b02fc88edd66d8b5f9e4f810fd86e39a))
- improvements from code review feedback ([2a1d243](https://github.com/blockstack/ux/commit/2a1d2433afffac19ae9728297995919fc991430c))
- improvements to reduce network load ([101b278](https://github.com/blockstack/ux/commit/101b278bbaa3419198edd91e225ab6017ca83b3a))
- index.html -> popup.html ([5e0b42f](https://github.com/blockstack/ux/commit/5e0b42fd01187855744dc63463f406b6aa6f4e84))
- input formatting on send page. fixes [#729](https://github.com/blockstack/ux/issues/729) ([c6ad05e](https://github.com/blockstack/ux/commit/c6ad05ec4b4591f641f908e473ec6a4418d42675))
- installation integration test ([8a2982b](https://github.com/blockstack/ux/commit/8a2982b41f769ea1faaa7b4266067f3ca4497ecf))
- integration tests ([c903de7](https://github.com/blockstack/ux/commit/c903de7d05b806d66fd23b5816d05be7f8ef9f3d))
- lint ([2197ea5](https://github.com/blockstack/ux/commit/2197ea58a7116b4ac4e67d26628c5780ae60182b))
- lint error ([75e60a4](https://github.com/blockstack/ux/commit/75e60a4f0f6ee4b6a87af0d905497ca227d95fe7))
- linting error ([35ca002](https://github.com/blockstack/ux/commit/35ca002b0b235962ee9823812862675eea2736f3))
- missing test selector for integration tests ([6691350](https://github.com/blockstack/ux/commit/6691350efc6dbba3fc8f49ab5fde1ff37e8c04ae))
- mock fee fetching in transaction-utils test ([135c3f4](https://github.com/blockstack/ux/commit/135c3f4f7047919223a13dcb3138eb67a4b47a8e))
- nasty bugs around password, redux state in ext, fixes [#770](https://github.com/blockstack/ux/issues/770) ([6fc81dd](https://github.com/blockstack/ux/commit/6fc81ddb978673c02288dd88e21324ce5c70c6c9))
- nonce issue ([225e1f3](https://github.com/blockstack/ux/commit/225e1f371aa8afa79faef2052d191608ab37f8c4))
- nonce issues causing pending tx's ([1e916f9](https://github.com/blockstack/ux/commit/1e916f9aa175e144ecce82ac4c031d32afd71447))
- nonce not set when zero ([b7a0724](https://github.com/blockstack/ux/commit/b7a0724f7326292d343c06c4088dc7003962faad))
- prevent overflow on save key in popup, fixes [#926](https://github.com/blockstack/ux/issues/926) ([e6be09b](https://github.com/blockstack/ux/commit/e6be09b489db4616510d170e951d4fb8ac9c3e9c))
- properly set post conditions from payload ([a53216e](https://github.com/blockstack/ux/commit/a53216ee2baf5f7a940af05e4ff0b9d057f934ce))
- quick fix to reduce node load ([63f00a1](https://github.com/blockstack/ux/commit/63f00a173de79b273601abadc4c00e97bf438809))
- remove incorrect typing for event ([eda8e64](https://github.com/blockstack/ux/commit/eda8e6404372a8ffdd15787fafa35ba7e0a454a8))
- revert to localStorage for ext, fix CI oddities ([e43b74d](https://github.com/blockstack/ux/commit/e43b74d9c22af8860f82f959b6d3d1334b49aa6f))
- secret key cut off, 24 words default, fixes [#771](https://github.com/blockstack/ux/issues/771) ([0f27637](https://github.com/blockstack/ux/commit/0f2763784508ef6f751d3289cc26f37601c99690))
- send max top ([0c8418e](https://github.com/blockstack/ux/commit/0c8418e5391fd2b9301c6b01f618141dd7c0ba10))
- serialize post conditions in connect payload ([faebbec](https://github.com/blockstack/ux/commit/faebbecb4994de6a439b78ad693017c279c3bc82))
- set PostCondition principal for string serialized PCs ([36b1aeb](https://github.com/blockstack/ux/commit/36b1aeb6f1412dd60fc043346410f9704117c9bf))
- show latest transaction on home page immediately, fixes [#766](https://github.com/blockstack/ux/issues/766) ([0ce2c74](https://github.com/blockstack/ux/commit/0ce2c747519f29f7bfb468bed4daa3e8188c5ee2))
- sizes in different contexts, clean up account select page ([b131429](https://github.com/blockstack/ux/commit/b13142943bfea3139fe001c823919444cd35c39f))
- small csp fix ([1306198](https://github.com/blockstack/ux/commit/13061987ce7f7c3b37aa54d7c4f1c349e1d9bfce))
- spacing, flow of sign up ([d514fd4](https://github.com/blockstack/ux/commit/d514fd4f104746f275789166f2d101b71db25206))
- stacks blockchain api language, fixes [#740](https://github.com/blockstack/ux/issues/740) ([2a3a6f9](https://github.com/blockstack/ux/commit/2a3a6f9ad887e9ad0dfb29d09b5b376b994f76ff))
- tests with new auth rules ([6934049](https://github.com/blockstack/ux/commit/693404953738b8a56ed0b56c07b5a9cd6aa15282))
- tons of tx-related improvements. fixes [#728](https://github.com/blockstack/ux/issues/728) and [#729](https://github.com/blockstack/ux/issues/729) ([d8b9e50](https://github.com/blockstack/ux/commit/d8b9e5096ea13b09fdbd1d2f5ba4245bdf15e9e4))
- track rehydrated from vault to reduce jitter on load ([8d76df9](https://github.com/blockstack/ux/commit/8d76df98a84518bdf9a95aae910336c1d4e9da01))
- ts error unused import ([c1180a3](https://github.com/blockstack/ux/commit/c1180a3a2f667d0e04bf8241ef750e392b9f855f))
- update blockchain API URLs, fixes [#802](https://github.com/blockstack/ux/issues/802) ([2aa204f](https://github.com/blockstack/ux/commit/2aa204fa90f4483f4d2e04efda50912ed72b37c8))
- validate STX address on send page, fixes [#945](https://github.com/blockstack/ux/issues/945) ([c14ab85](https://github.com/blockstack/ux/commit/c14ab85d44beca11ad35b4a4ea1331f05a7d4f59))
- webpack 5, fast refresh :~) ([63d7d38](https://github.com/blockstack/ux/commit/63d7d383855ab46545bccea4302858960e806a5c))
- wonky url causing issues in auth ([fba1619](https://github.com/blockstack/ux/commit/fba16199102272b52aea17031befeed9dbab15da))

### Features

- disable username registrations ([1f21428](https://github.com/blockstack/ux/commit/1f214285e111a1bdacbcdbe3f13188beb8004fcc))
- improved UX around wallet onboarding ([8ab3dd3](https://github.com/blockstack/ux/commit/8ab3dd397b16a6c46f225286826966b5ef5db250))
- mainnet network ([c9802a9](https://github.com/blockstack/ux/commit/c9802a93392b98b84f35c46d20bda91acf48cff5))
- move key management to 'vault' in background script ([b83cc7e](https://github.com/blockstack/ux/commit/b83cc7e181e4d45474e7c0d393d045052f4fdd94))
- password validation, fixes [#733](https://github.com/blockstack/ux/issues/733), fixes [#720](https://github.com/blockstack/ux/issues/720) ([d8f6832](https://github.com/blockstack/ux/commit/d8f6832e85199d05ad906236bd8c12614427e227))
- persist networks ChainID, use it everywhere ([66a21c6](https://github.com/blockstack/ux/commit/66a21c674bb76c57e93d4d35652407da9833504d))
- qol improvements for tx signing ([f86d568](https://github.com/blockstack/ux/commit/f86d568825aa7bcb5512885546862d892324c546))
- refactor wallet logic, remove keychain ([0f3ac1f](https://github.com/blockstack/ux/commit/0f3ac1fa86b81d7eef1da1db89f8ab3c30540d6c))
- restore from wallet config ([008b1a2](https://github.com/blockstack/ux/commit/008b1a2c13f9cafcd1dc73f659bb53a328baeec9))
- stacks wallet branding, icon, asset cleanup, fixes [#732](https://github.com/blockstack/ux/issues/732) ([b9cb445](https://github.com/blockstack/ux/commit/b9cb445c92554ffc8ed9b05622cf087739454498))
- stacks wallet for web ([6957c04](https://github.com/blockstack/ux/commit/6957c04bdcfb816fcf757815b9b2720e7a9209eb))
- switch to signed-in account with connect tx calls ([d6a896f](https://github.com/blockstack/ux/commit/d6a896f39ab150fb8a9d3d3d6aba219334547c9b))
- use extension-native apis for app messaging ([663281a](https://github.com/blockstack/ux/commit/663281ad6e7a29e572ae6a6f24cf2bc6925a6a3b))

## 1.20.16 (2021-01-09)

**Note:** Version bump only for package @stacks/app

## 1.20.15 (2021-01-08)

### Bug Fixes

- broken tx signing with extension ([0235140](https://github.com/blockstack/ux/commit/023514021c64e06a80bc31125831d5c35ece3118))

## 1.20.14 (2021-01-06)

### Bug Fixes

- ignore exit code from FF addon publish ([ae05d36](https://github.com/blockstack/ux/commit/ae05d3608ac48cf3944d6d62ead2be65bc11bfde))

## 1.20.13 (2021-01-06)

### Bug Fixes

- use job conditionals instead of workflow conditional ([772b374](https://github.com/blockstack/ux/commit/772b3740def1b31fccf004630ef2d29d167210a4))

## 1.20.12 (2021-01-06)

### Bug Fixes

- ignore tags refs for version workflow ([d2a18fc](https://github.com/blockstack/ux/commit/d2a18fc45a4198a112e881552fbb6c502e557d90))

## 1.20.11 (2021-01-06)

### Bug Fixes

- better syntax for excluding tagged commits' ([4729d01](https://github.com/blockstack/ux/commit/4729d01a5afea316c55dade9143f83748b25071b))

## 1.20.10 (2021-01-06)

### Bug Fixes

- dont run publish on master commits without tag ([0b7cb3a](https://github.com/blockstack/ux/commit/0b7cb3ac50af92bd9ad993b70d48cd930fd31c29))

## 1.20.9 (2021-01-06)

**Note:** Version bump only for package @stacks/app

## 1.20.8 (2020-12-29)

### Bug Fixes

- build rpc pkg before deploying contracts ([c56d3f7](https://github.com/blockstack/ux/commit/c56d3f776494cd471aba77d35b7c5eba20ec245f))

## 1.20.7 (2020-12-29)

### Bug Fixes

- support ts paths in deploy-contracts script ([4bc3ce3](https://github.com/blockstack/ux/commit/4bc3ce3030e392f850cdeaea0e55c6bbaba7c15e))

## 1.20.6 (2020-12-29)

### Bug Fixes

- build packages before deploy-contracts script ([66f0857](https://github.com/blockstack/ux/commit/66f0857cde41d197c29682eedefd46bc16910096))

## 1.20.5 (2020-12-29)

### Bug Fixes

- auto-deploy testnet contracts with github actions ([b1b5c97](https://github.com/blockstack/ux/commit/b1b5c977bc90a9c47e08264d7e0aef665099696e))

## 1.20.4 (2020-12-14)

### Bug Fixes

- prod deploy apps job action ([b8ccc59](https://github.com/blockstack/ux/commit/b8ccc59d1c024705b80991ecb604030f8590e89d))

## 1.20.3 (2020-12-14)

### Bug Fixes

- change lerna publish to skip existing versions ([ac16572](https://github.com/blockstack/ux/commit/ac16572dba7e8d3e770bb4ba61d77094bcad02f9))

## 1.20.1 (2020-12-04)

### Bug Fixes

- export auth from connect ([d201aab](https://github.com/blockstack/ux/commit/d201aab14f2ced0b5f666be571035b7cbf76c602))

# 1.20.0 (2020-11-25)

### Features

- update extension build instructions ([4d55afa](https://github.com/blockstack/ux/commit/4d55afa51dbc3b4cedb81de679b16b91b2df007c))

## 1.19.4 (2020-11-18)

### Bug Fixes

- duplicate 'powered by' on sign in, fixes [#629](https://github.com/blockstack/ux/issues/629) ([6648517](https://github.com/blockstack/ux/commit/6648517e01cdd34a91225dfe08483055b418439c))

## 1.19.3 (2020-11-17)

### Bug Fixes

- update actions to fix set-path err ([0b4fd95](https://github.com/blockstack/ux/commit/0b4fd955f920d5c549690945a18673ea5f0462ae))

## 1.19.2 (2020-11-13)

**Note:** Version bump only for package @stacks/app

## 1.19.1 (2020-11-09)

### Bug Fixes

- build connect ui in build-ext.sh ([c0bd586](https://github.com/blockstack/ux/commit/c0bd586da2baace269144d8797555177882de76a))

# 1.19.0 (2020-11-07)

### Features

- more tests for url validation ([cad6e6a](https://github.com/blockstack/ux/commit/cad6e6a489bfd4de67ff8c20e480b3db99e97e4e))

## 1.18.4 (2020-11-06)

### Bug Fixes

- blockstack, react dep versions ([7f23d36](https://github.com/blockstack/ux/commit/7f23d36b0b6e4531027cd4b2c3cf5d76c7a274d2))

## 1.18.3 (2020-11-05)

### Bug Fixes

- valid-url package for url validation ([2d0664b](https://github.com/blockstack/ux/commit/2d0664b302dbf7464a9c9c5730e85675375b5a0e))

## 1.18.2 (2020-11-05)

### Bug Fixes

- add dep to app ([eade246](https://github.com/blockstack/ux/commit/eade246edadfb2963c543f3647ba348f77c170ec))

## 1.18.1 (2020-11-05)

### Bug Fixes

- add additional url validation ([1b67fbd](https://github.com/blockstack/ux/commit/1b67fbd91d0eb3cbfabfed297b9e18dfd7ab497b))

# 1.18.0 (2020-11-04)

### Features

- further simplify app instructions ([598827d](https://github.com/blockstack/ux/commit/598827d919fb62f9cc5308ebee5eac6acec4e982))

## 1.17.1 (2020-11-03)

### Bug Fixes

- proper glob for lerna packages ([5367055](https://github.com/blockstack/ux/commit/5367055e9c6622dd0a93f97275ab652a9af56bf9))

# 1.17.0 (2020-11-02)

### Bug Fixes

- better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/ux/commit/31518632bf91c6217734c21c1163ae076f22368a))
- stencil publishing tweaks ([db45290](https://github.com/blockstack/ux/commit/db45290e6effbae8e91c9f0d2ab3c9d205cca0f0))
- **app:** prefix hex with 0x in tx result ([2277bc0](https://github.com/blockstack/ux/commit/2277bc0d2b6d52ef32c7dcdcf6d8db277a4a10de))
- add Content Security Policy ([27200a3](https://github.com/blockstack/ux/commit/27200a37aad19061aa1acb273dbada2549a152f2))
- add frame CSP to extension manifest ([4df09ce](https://github.com/blockstack/ux/commit/4df09ce88dc860c202a112edd560388a45b0ba0b))
- back to only frame CSP ([e613210](https://github.com/blockstack/ux/commit/e613210488111adc481915192cebf1912885a087))
- better lookup for profile location, fixes [#377](https://github.com/blockstack/ux/issues/377) ([f292cc1](https://github.com/blockstack/ux/commit/f292cc13aee3b9b531a64bcb4fa8ed76013c406b))
- better readme for firefox install ([cbecc86](https://github.com/blockstack/ux/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
- connect version was behind published ([2d7633e](https://github.com/blockstack/ux/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
- create secret key link not working, [#436](https://github.com/blockstack/ux/issues/436) ([c5870f5](https://github.com/blockstack/ux/commit/c5870f5422c49c754943eba70d7cc5285fc0ea01))
- cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))
- default allow csp ([48e4532](https://github.com/blockstack/ux/commit/48e45321dd60490a6865177a14954e66075d4a0d))
- dont have selected address when canceling reuse, fixes [#454](https://github.com/blockstack/ux/issues/454) ([27f8f61](https://github.com/blockstack/ux/commit/27f8f616549ef9acc1e121f1fda9a40f8a142898))
- dont show extension button on mobile, fixes [#575](https://github.com/blockstack/ux/issues/575) ([1580805](https://github.com/blockstack/ux/commit/15808053177e5701079fef8f371beedffc8828f1))
- fix all eslint and prettier tasks ([217ca35](https://github.com/blockstack/ux/commit/217ca350500dafd45797f15251bee78c787c361a))
- home page alignment, [#440](https://github.com/blockstack/ux/issues/440) ([06dde15](https://github.com/blockstack/ux/commit/06dde15a651f901222650c015c75f8c1343068b6))
- inject version into manifest.json, ignore .zip in git ([6c046aa](https://github.com/blockstack/ux/commit/6c046aaa5e4ea08fff8026f2bb401c8a08dda793))
- keychain package was behind published version ([acbd4b0](https://github.com/blockstack/ux/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
- keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
- lighter CSP ([fcaed93](https://github.com/blockstack/ux/commit/fcaed93e833b84869f530c0dd5a464b9a97e4f34))
- lint ([fd708ff](https://github.com/blockstack/ux/commit/fd708ff79fc5bb620edf66a76938d9231bb84dea))
- manually fix new eslint bugs ([7650b7a](https://github.com/blockstack/ux/commit/7650b7a753465a1767a70df45ec1a9fbdd9db1d1))
- non-JSX SVG attrs throwing errors ([1b3f37f](https://github.com/blockstack/ux/commit/1b3f37f1097d3e7fd4ce73c3bf1124079e2caafc))
- prettier/eslint resolutions and versions ([0fe69bb](https://github.com/blockstack/ux/commit/0fe69bb53a102905e57b49125f7c7901e5c09d15))
- prevent auto-zoom of sign in field, fixes [#510](https://github.com/blockstack/ux/issues/510) ([eea3219](https://github.com/blockstack/ux/commit/eea3219c2de0925b7dd34a5f9fe2e5f6adb0ddc4))
- reduce scope of CSP ([d4d52ff](https://github.com/blockstack/ux/commit/d4d52ffbb3b9913f8e9324e70ec2010a6b40adea))
- use non-eval source maps, script-src self ([995a8f4](https://github.com/blockstack/ux/commit/995a8f42034ae9cea455438c01153bf4a469b81d))
- **app:** create StacksNetwork from payload ([2229bcd](https://github.com/blockstack/ux/commit/2229bcdca0be7036c8b7805c620a06929a9a965a))
- **app:** use strict comparison ([0f74422](https://github.com/blockstack/ux/commit/0f74422ce20fd12e8cdb420e3ccda492878a5e78))
- remove import of d.ts in keychain ([5d5f2eb](https://github.com/blockstack/ux/commit/5d5f2ebf0ccacfb4ee059e69781d935eb9869d34))
- remove repeating console log, closes [#628](https://github.com/blockstack/ux/issues/628) ([5aee7e1](https://github.com/blockstack/ux/commit/5aee7e153bdf0f854d779f0c4d76e52bc03b1cde))
- remove unused perms from manifest ([52abc1f](https://github.com/blockstack/ux/commit/52abc1fc91396dd04d322894a18ed257f2a13864))
- removes need for `unsafe-eval` CSR ([3f62dc5](https://github.com/blockstack/ux/commit/3f62dc5edb7b185715300a47648420cd1b6be293))
- rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
- run new lint:fix ([c84c893](https://github.com/blockstack/ux/commit/c84c8933ce6d9f748ae531f40d37c364fde157da))
- sanitize input ([7f289a6](https://github.com/blockstack/ux/commit/7f289a68cf84a0e69db3988cd580db4984103b12))
- show correct secret key on home screen, fixes [#517](https://github.com/blockstack/ux/issues/517) ([e14afcf](https://github.com/blockstack/ux/commit/e14afcf036ef25d45a541005aa9bb88cd218f4ab))
- show loading when reusing account, fixes [#464](https://github.com/blockstack/ux/issues/464) ([19fbf4e](https://github.com/blockstack/ux/commit/19fbf4efdc5755d26587ca01f225557082d61701))
- spacing between reused account icons, fixes [#509](https://github.com/blockstack/ux/issues/509) ([f47c8f2](https://github.com/blockstack/ux/commit/f47c8f2ef5a5025255dd67b57e8c2c839aa84807))
- tweaks to get extension working ([e068dce](https://github.com/blockstack/ux/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))
- ui version behind published ([8198ca0](https://github.com/blockstack/ux/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))
- update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))
- use async dispatch, fixes [#441](https://github.com/blockstack/ux/issues/441) ([b097348](https://github.com/blockstack/ux/commit/b0973483dac295747cd511af87e42d3b5e156185))
- use const instead of let ([b93c712](https://github.com/blockstack/ux/commit/b93c712f0fa0fa21f105697dc4b022c284048445))
- use spread operator ([f432d74](https://github.com/blockstack/ux/commit/f432d74fb4b0c2143e2e7f1eae7cb56676a508c6))
- **app:** routing bug when trying to create new key, fixes [#381](https://github.com/blockstack/ux/issues/381) ([66f78aa](https://github.com/blockstack/ux/commit/66f78aaf64c3dd38555173ba68ca49ef9445bb53))
- **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))
- **app:** use network from payload ([a21ea67](https://github.com/blockstack/ux/commit/a21ea67a1d9cfd49ffe5a5a34b5e7691b5eadf77))
- 16px below app icon ([4097510](https://github.com/blockstack/ux/commit/4097510df66c28343782af3cb558348689bb9b36))
- add account loading/transition, fixes [#163](https://github.com/blockstack/ux/issues/163) ([fbd063c](https://github.com/blockstack/ux/commit/fbd063c740698d0269d3f6cd862a112a9fb082b7))
- Add hover action to '<Account/>' list ([c405989](https://github.com/blockstack/ux/commit/c405989b071adc070463a2047e9e7ae6751e974b))
- add spacing below title, fixes [#139](https://github.com/blockstack/ux/issues/139) and [#234](https://github.com/blockstack/ux/issues/234) ([336a235](https://github.com/blockstack/ux/commit/336a23562f4f5d769d6c0e846afac79c9e8b29ae))
- adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/ux/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
- Alignment of the onboarding create screen, Closes [#136](https://github.com/blockstack/ux/issues/136) ([7e16aa5](https://github.com/blockstack/ux/commit/7e16aa52f207146ef01bd5698bedfdb3eaf978db))
- All uses of seed phrase ([c9e32a2](https://github.com/blockstack/ux/commit/c9e32a2d7ba302c4669dcbfe416fa4be86dcd8e3))
- app name undefined on create screen ([d8930dd](https://github.com/blockstack/ux/commit/d8930ddaf5a7b157bf17fed134da0c861adc8125))
- change button sizes to lg ([9465556](https://github.com/blockstack/ux/commit/9465556a49dc73ba1e947c06ce196b486d8f34e5))
- choose account after sign in with key, fixes [#156](https://github.com/blockstack/ux/issues/156) ([432ab82](https://github.com/blockstack/ux/commit/432ab8236e9b135c836986e92292faf6dcd01469))
- choose account hover styles ([e924b04](https://github.com/blockstack/ux/commit/e924b04e9ad38b46353667b50d3eca87b30965eb))
- clear onboarding path on sign out [#341](https://github.com/blockstack/ux/issues/341) ([f0820c9](https://github.com/blockstack/ux/commit/f0820c999143f8a00d89bcc04ecef0fa1699b5f1))
- document.title bug [#335](https://github.com/blockstack/ux/issues/335), caused by invalid redux hydration ([882fdd6](https://github.com/blockstack/ux/commit/882fdd6bfcb34e1ff1caed114065dc7b7b228e4d))
- document.title undefined, fixes [#335](https://github.com/blockstack/ux/issues/335) ([378b903](https://github.com/blockstack/ux/commit/378b903af1d0c66eed499d4ddba951b3a62bb658))
- dont require built ui to build connect ([c354be7](https://github.com/blockstack/ux/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))
- dont show secret key when logged out, [#340](https://github.com/blockstack/ux/issues/340) ([355d518](https://github.com/blockstack/ux/commit/355d518c545527337db8efad3038bf65544e5a33))
- dont show warning if app already used, closes [#188](https://github.com/blockstack/ux/issues/188) ([93e110a](https://github.com/blockstack/ux/commit/93e110a0f357b756e66546d13061176370583d54))
- Ensure key input trims whitespace, Closes blockstack/connect[#66](https://github.com/blockstack/ux/issues/66) ([5dc347f](https://github.com/blockstack/ux/commit/5dc347f79024b452ef1440e58701e05b77beb3e3))
- Ensure page events are tracked ([e64396f](https://github.com/blockstack/ux/commit/e64396fc2688d0cb62f14a8aa515b826907f9da8))
- Error message, Closes [#169](https://github.com/blockstack/ux/issues/169) ([02e7c46](https://github.com/blockstack/ux/commit/02e7c46b5d5522c165c0b045e375b75df2ca8ca2))
- ErrorLabels not formatted properly, Closes [#159](https://github.com/blockstack/ux/issues/159) ([981dab6](https://github.com/blockstack/ux/commit/981dab62c445e537cc5ee0df7ec1522b5eeb2a11))
- hard-coded "Messenger" in secret key page ([bfc0848](https://github.com/blockstack/ux/commit/bfc084809ff0e03ac588592d9c041e37fdfee21a))
- hide icon in ScreenHeader if missing ([75d0682](https://github.com/blockstack/ux/commit/75d06824fa47aa660772b185723d5882934e3633))
- Input/Textarea fields autocapitalizing on iOS, Closes [#180](https://github.com/blockstack/ux/issues/180) ([45ec252](https://github.com/blockstack/ux/commit/45ec25224633ea8cfaa43cd57377e23138b4fd64))
- long usernames text-align: left, fixes [#174](https://github.com/blockstack/ux/issues/174) ([0939f99](https://github.com/blockstack/ux/commit/0939f99efedb4ed9555df7d2ec742fbdadd8a3b9))
- magic recovery code flow getting stuck ([500fdeb](https://github.com/blockstack/ux/commit/500fdebfad77cb7690f6ba17dd2822c96c439aa7))
- missing app icon on username error, [#338](https://github.com/blockstack/ux/issues/338) ([7296f63](https://github.com/blockstack/ux/commit/7296f63c91d53bbc06fdc995d672c0c978c76adf))
- Prevent zoom on focus by increasing fontsize, Closes [#183](https://github.com/blockstack/ux/issues/183) ([4044c1b](https://github.com/blockstack/ux/commit/4044c1ba9a72ef03d402fa9fb27ae14c346c62bc))
- profile info not set in authResponse ([9e48475](https://github.com/blockstack/ux/commit/9e4847544e89dc1c8abcebeda6d34dc2bf8a4c7f))
- proper title tracking, [#201](https://github.com/blockstack/ux/issues/201) ([b715c8b](https://github.com/blockstack/ux/commit/b715c8b3eac8fdef953252e74912fdfdc36a68e3))
- Remove resize and spellchecking from all inputs/textareas, Closes [#153](https://github.com/blockstack/ux/issues/153) ([a0eff88](https://github.com/blockstack/ux/commit/a0eff8825ebe12dd0a66e713aeed823137eb9f04))
- remove undefined ([a50bcb4](https://github.com/blockstack/ux/commit/a50bcb492db9d5561e04b992d04c4cd931714b23))
- Remove username placeholder ([c6d6258](https://github.com/blockstack/ux/commit/c6d62587e01848d6a3fe66813157fd1038c42ec5))
- screens with inputs will now submit on return, fixes: [#147](https://github.com/blockstack/ux/issues/147), [#160](https://github.com/blockstack/ux/issues/160) ([31cbbe4](https://github.com/blockstack/ux/commit/31cbbe4df8e5a50744e2eaad0f9e18ee4f16fde0))
- send to sign-in if sendToSignIn, even if path = sign-up ([b397ff3](https://github.com/blockstack/ux/commit/b397ff39d6a78cb7ae4a7364b5ba4fcf1ee51163))
- sign in flows dont change screen properly ([3c162cd](https://github.com/blockstack/ux/commit/3c162cd8d9de84ece62b663d53003806e154fd1f))
- spacing on collapse component ([0541cba](https://github.com/blockstack/ux/commit/0541cba80df697541f4590cd7768dd7617c5c4c2))
- textarea height and title ([60df34a](https://github.com/blockstack/ux/commit/60df34a44fdcbe694f3db3809a8f89567e59e038))
- Tracking ([#111](https://github.com/blockstack/ux/issues/111)) ([4babe6b](https://github.com/blockstack/ux/commit/4babe6bd4235367ec09b43270b960d07dda41b23))
- ts error with react-router import ([8ecef0f](https://github.com/blockstack/ux/commit/8ecef0fbd537666c66f1f41bf85371b8ca80d166))
- typo ([5c40890](https://github.com/blockstack/ux/commit/5c40890f41678150fe3dee92aa67101326e552a3))
- update type for button mode prop ([3f8ad2f](https://github.com/blockstack/ux/commit/3f8ad2f15a6f2784b3440acf3265f991726fe8eb))
- username capitalization, fixes [#419](https://github.com/blockstack/ux/issues/419) ([97cb976](https://github.com/blockstack/ux/commit/97cb9764ddacccba820ff42cdf1734b230dbeb27))
- validate that seed is not empty on sign in, fixes [#170](https://github.com/blockstack/ux/issues/170) ([e0ea149](https://github.com/blockstack/ux/commit/e0ea14909bad5b7f428a835953eb01230fa709f1))
- Visual glitches with account warning dialog ([ca2224b](https://github.com/blockstack/ux/commit/ca2224b9a034f01181dc905baca77a623bc74d22))

### Features

- add ability to view secret key ([440c3e5](https://github.com/blockstack/ux/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))
- add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))
- add CI, proper connections between packages ([5934829](https://github.com/blockstack/ux/commit/5934829a40338ac269b80783912c8dad17af1962))
- add debug mode for transaction signing ([3c66887](https://github.com/blockstack/ux/commit/3c6688714b070a38c2eefe0d93a6218163917c53))
- Add identity validation and availability to the auth flow ([3f51783](https://github.com/blockstack/ux/commit/3f51783d33373cb815121a55772d751fe2c09504))
- add keychain logic to restore identities ([e2a18d6](https://github.com/blockstack/ux/commit/e2a18d6036327efe403892eeec721ad9951c8983))
- add link back to Secret Key page, Closes [#168](https://github.com/blockstack/ux/issues/168) ([5ed74c7](https://github.com/blockstack/ux/commit/5ed74c7cd417994667b325cf4ca96a3fd23c7ed4))
- Add loading spinner when selecting account, Closes [#96](https://github.com/blockstack/ux/issues/96) ([386235d](https://github.com/blockstack/ux/commit/386235d6ec7dd7dc62286e0bd16fe3a44448c7cf))
- add proper page tracking to first page ([89b9f5d](https://github.com/blockstack/ux/commit/89b9f5d5bd52550e1d8b53a06302ed708060df2a))
- Add validation to seed entry field ([#63](https://github.com/blockstack/ux/issues/63)) ([6a34531](https://github.com/blockstack/ux/commit/6a345311037f61d19992284065696631c42f3f84))
- add variants to username error state ([19b603b](https://github.com/blockstack/ux/commit/19b603ba4ba40b42f2d0a9d99cf274af1c3eaf20))
- add vercel headers ([ae3c72a](https://github.com/blockstack/ux/commit/ae3c72afff49c09145d896412356cd129668f29d))
- Add write key segment ([8ff9be7](https://github.com/blockstack/ux/commit/8ff9be77b1494f44a69e890c5d4b2c724ad7e00b))
- adds appURL to onboarding store ([5085bb0](https://github.com/blockstack/ux/commit/5085bb0072c8640110b12ebf8e8d98bdd1928dcb))
- adds onCancel method for when popup closed ([c5800ae](https://github.com/blockstack/ux/commit/c5800aeb341c65e108b93b5e7a17a6d937292fc1))
- adds screen changed event ([b1600b6](https://github.com/blockstack/ux/commit/b1600b6e41a70d39f92a9818eb203d6941e81b6b))
- change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
- codebox and highlighter ([b9056f8](https://github.com/blockstack/ux/commit/b9056f8102eff8d32898201717a3cd3699234561))
- dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))
- expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))
- implement basic homepage ([10ac702](https://github.com/blockstack/ux/commit/10ac70200e769ae91544073e75347e9d1de33e81))
- implementation of router ([bd03411](https://github.com/blockstack/ux/commit/bd034112a098868d07e04dc6aba97d15145707d1))
- improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/ux/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))
- improve extension instructions ([e4f9f89](https://github.com/blockstack/ux/commit/e4f9f899a3e42796e34e70943efc52f68a77eba0))
- Layout closer to designs, created <ExplainerCard /> ([#68](https://github.com/blockstack/ux/issues/68)) ([52f4fe7](https://github.com/blockstack/ux/commit/52f4fe75f93676e35d6986246262acf1eb6a6c2f))
- more detailed events to username ([5cc323b](https://github.com/blockstack/ux/commit/5cc323b4ba7b122e7f5a60dfee422b3ca7f21942))
- more events, mostly around choosing an account ([a1f7401](https://github.com/blockstack/ux/commit/a1f7401b226fe2ae196d8dadc8c4d3711fada998))
- move changing screen into analytics hook ([0be47b5](https://github.com/blockstack/ux/commit/0be47b54619f9bb0bd859b14ce6e253017cd1e03)), closes [#130](https://github.com/blockstack/ux/issues/130)
- move doTrack into hook, [#130](https://github.com/blockstack/ux/issues/130) ([6b1d390](https://github.com/blockstack/ux/commit/6b1d390e5f4ac36fd1aeb5d28f53daa9b8ae0bce))
- move username screen to the end, closes [#110](https://github.com/blockstack/ux/issues/110) ([942379b](https://github.com/blockstack/ux/commit/942379b3c7de757d20bc43b85e5ed426cc086691))
- Page title changes between screens, Closes [#149](https://github.com/blockstack/ux/issues/149) ([e1373d8](https://github.com/blockstack/ux/commit/e1373d8c657e861d71d19311d6426f1c37c2a7d1))
- prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/ux/issues/224) ([12a6772](https://github.com/blockstack/ux/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
- refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
- remove auto username generation ([b160f2b](https://github.com/blockstack/ux/commit/b160f2b05613118cc920d2344defa06b45ce214e))
- remove connect screen at end of onboarding ([42c8958](https://github.com/blockstack/ux/commit/42c895838786c6843113409148c0e6b263e96e0e))
- remove secret key branding, [#334](https://github.com/blockstack/ux/issues/334) ([e57c8bc](https://github.com/blockstack/ux/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))
- rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))
- send user back into unfinished onboarding flow ([5ccda3c](https://github.com/blockstack/ux/commit/5ccda3c278e0caac7b4669a193b8e62209fda543))
- show error page when username registration fails ([fd457c6](https://github.com/blockstack/ux/commit/fd457c60f7081ee44c7fa7ae2cb3ab06070293c2))
- slight speedup on final auth transition ([6fb56a8](https://github.com/blockstack/ux/commit/6fb56a89181cdb99d4b20d27066647dd93f46fcb))
- support relative app icons in appDetails, closes [#348](https://github.com/blockstack/ux/issues/348) ([40f27dc](https://github.com/blockstack/ux/commit/40f27dcb64eecfa7d5f85ff8fba18999a21ea97f))
- use .id.blockstack subdomain, fixes [#123](https://github.com/blockstack/ux/issues/123) ([59d3087](https://github.com/blockstack/ux/commit/59d3087654bb52396d242467cab897621dce3f6c))
- use stats package for metrics ([710f1fc](https://github.com/blockstack/ux/commit/710f1fca0a3fc8ad4aaed75ec828ddb815b1483b))
- use window.location for ios redirect ([9d83fc9](https://github.com/blockstack/ux/commit/9d83fc916e029d437f6a2e8af9b19b734f4aa3ac))
- **app:** hide default domain placeholder during onboarding ([8a12763](https://github.com/blockstack/ux/commit/8a12763d65112626766630ff915e3ae802fe82ef)), closes [#221](https://github.com/blockstack/ux/issues/221) [#220](https://github.com/blockstack/ux/issues/220)
- **onboarding:** update branding, copy ([7b4f6ac](https://github.com/blockstack/ux/commit/7b4f6ac43f5764626bd59608ec0d1eed8d664d69))

## [1.16.1](https://github.com/blockstack/ux/compare/@stacks/app@1.16.0...@stacks/app@1.16.1) (2020-11-02)

**Note:** Version bump only for package @stacks/app

# 1.16.0 (2020-11-02)

### Bug Fixes

- **app:** prefix hex with 0x in tx result ([2277bc0](https://github.com/blockstack/ux/commit/2277bc0d2b6d52ef32c7dcdcf6d8db277a4a10de))
- add Content Security Policy ([27200a3](https://github.com/blockstack/ux/commit/27200a37aad19061aa1acb273dbada2549a152f2))
- add frame CSP to extension manifest ([4df09ce](https://github.com/blockstack/ux/commit/4df09ce88dc860c202a112edd560388a45b0ba0b))
- back to only frame CSP ([e613210](https://github.com/blockstack/ux/commit/e613210488111adc481915192cebf1912885a087))
- better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/ux/commit/31518632bf91c6217734c21c1163ae076f22368a))
- better lookup for profile location, fixes [#377](https://github.com/blockstack/ux/issues/377) ([f292cc1](https://github.com/blockstack/ux/commit/f292cc13aee3b9b531a64bcb4fa8ed76013c406b))
- better readme for firefox install ([cbecc86](https://github.com/blockstack/ux/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
- connect version was behind published ([2d7633e](https://github.com/blockstack/ux/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
- create secret key link not working, [#436](https://github.com/blockstack/ux/issues/436) ([c5870f5](https://github.com/blockstack/ux/commit/c5870f5422c49c754943eba70d7cc5285fc0ea01))
- cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))
- default allow csp ([48e4532](https://github.com/blockstack/ux/commit/48e45321dd60490a6865177a14954e66075d4a0d))
- dont have selected address when canceling reuse, fixes [#454](https://github.com/blockstack/ux/issues/454) ([27f8f61](https://github.com/blockstack/ux/commit/27f8f616549ef9acc1e121f1fda9a40f8a142898))
- dont show extension button on mobile, fixes [#575](https://github.com/blockstack/ux/issues/575) ([1580805](https://github.com/blockstack/ux/commit/15808053177e5701079fef8f371beedffc8828f1))
- fix all eslint and prettier tasks ([217ca35](https://github.com/blockstack/ux/commit/217ca350500dafd45797f15251bee78c787c361a))
- home page alignment, [#440](https://github.com/blockstack/ux/issues/440) ([06dde15](https://github.com/blockstack/ux/commit/06dde15a651f901222650c015c75f8c1343068b6))
- inject version into manifest.json, ignore .zip in git ([6c046aa](https://github.com/blockstack/ux/commit/6c046aaa5e4ea08fff8026f2bb401c8a08dda793))
- keychain package was behind published version ([acbd4b0](https://github.com/blockstack/ux/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
- keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
- lighter CSP ([fcaed93](https://github.com/blockstack/ux/commit/fcaed93e833b84869f530c0dd5a464b9a97e4f34))
- lint ([fd708ff](https://github.com/blockstack/ux/commit/fd708ff79fc5bb620edf66a76938d9231bb84dea))
- manually fix new eslint bugs ([7650b7a](https://github.com/blockstack/ux/commit/7650b7a753465a1767a70df45ec1a9fbdd9db1d1))
- non-JSX SVG attrs throwing errors ([1b3f37f](https://github.com/blockstack/ux/commit/1b3f37f1097d3e7fd4ce73c3bf1124079e2caafc))
- prettier/eslint resolutions and versions ([0fe69bb](https://github.com/blockstack/ux/commit/0fe69bb53a102905e57b49125f7c7901e5c09d15))
- prevent auto-zoom of sign in field, fixes [#510](https://github.com/blockstack/ux/issues/510) ([eea3219](https://github.com/blockstack/ux/commit/eea3219c2de0925b7dd34a5f9fe2e5f6adb0ddc4))
- reduce scope of CSP ([d4d52ff](https://github.com/blockstack/ux/commit/d4d52ffbb3b9913f8e9324e70ec2010a6b40adea))
- remove import of d.ts in keychain ([5d5f2eb](https://github.com/blockstack/ux/commit/5d5f2ebf0ccacfb4ee059e69781d935eb9869d34))
- use non-eval source maps, script-src self ([995a8f4](https://github.com/blockstack/ux/commit/995a8f42034ae9cea455438c01153bf4a469b81d))
- **app:** create StacksNetwork from payload ([2229bcd](https://github.com/blockstack/ux/commit/2229bcdca0be7036c8b7805c620a06929a9a965a))
- **app:** use network from payload ([a21ea67](https://github.com/blockstack/ux/commit/a21ea67a1d9cfd49ffe5a5a34b5e7691b5eadf77))
- **app:** use strict comparison ([0f74422](https://github.com/blockstack/ux/commit/0f74422ce20fd12e8cdb420e3ccda492878a5e78))
- remove repeating console log, closes [#628](https://github.com/blockstack/ux/issues/628) ([5aee7e1](https://github.com/blockstack/ux/commit/5aee7e153bdf0f854d779f0c4d76e52bc03b1cde))
- remove unused perms from manifest ([52abc1f](https://github.com/blockstack/ux/commit/52abc1fc91396dd04d322894a18ed257f2a13864))
- removes need for `unsafe-eval` CSR ([3f62dc5](https://github.com/blockstack/ux/commit/3f62dc5edb7b185715300a47648420cd1b6be293))
- rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
- run new lint:fix ([c84c893](https://github.com/blockstack/ux/commit/c84c8933ce6d9f748ae531f40d37c364fde157da))
- sanitize input ([7f289a6](https://github.com/blockstack/ux/commit/7f289a68cf84a0e69db3988cd580db4984103b12))
- show correct secret key on home screen, fixes [#517](https://github.com/blockstack/ux/issues/517) ([e14afcf](https://github.com/blockstack/ux/commit/e14afcf036ef25d45a541005aa9bb88cd218f4ab))
- show loading when reusing account, fixes [#464](https://github.com/blockstack/ux/issues/464) ([19fbf4e](https://github.com/blockstack/ux/commit/19fbf4efdc5755d26587ca01f225557082d61701))
- spacing between reused account icons, fixes [#509](https://github.com/blockstack/ux/issues/509) ([f47c8f2](https://github.com/blockstack/ux/commit/f47c8f2ef5a5025255dd67b57e8c2c839aa84807))
- tweaks to get extension working ([e068dce](https://github.com/blockstack/ux/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))
- ui version behind published ([8198ca0](https://github.com/blockstack/ux/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))
- update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))
- use const instead of let ([b93c712](https://github.com/blockstack/ux/commit/b93c712f0fa0fa21f105697dc4b022c284048445))
- use spread operator ([f432d74](https://github.com/blockstack/ux/commit/f432d74fb4b0c2143e2e7f1eae7cb56676a508c6))
- **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))
- use async dispatch, fixes [#441](https://github.com/blockstack/ux/issues/441) ([b097348](https://github.com/blockstack/ux/commit/b0973483dac295747cd511af87e42d3b5e156185))
- username capitalization, fixes [#419](https://github.com/blockstack/ux/issues/419) ([97cb976](https://github.com/blockstack/ux/commit/97cb9764ddacccba820ff42cdf1734b230dbeb27))
- **app:** routing bug when trying to create new key, fixes [#381](https://github.com/blockstack/ux/issues/381) ([66f78aa](https://github.com/blockstack/ux/commit/66f78aaf64c3dd38555173ba68ca49ef9445bb53))
- 16px below app icon ([4097510](https://github.com/blockstack/ux/commit/4097510df66c28343782af3cb558348689bb9b36))
- add account loading/transition, fixes [#163](https://github.com/blockstack/ux/issues/163) ([fbd063c](https://github.com/blockstack/ux/commit/fbd063c740698d0269d3f6cd862a112a9fb082b7))
- Add hover action to '<Account/>' list ([c405989](https://github.com/blockstack/ux/commit/c405989b071adc070463a2047e9e7ae6751e974b))
- add spacing below title, fixes [#139](https://github.com/blockstack/ux/issues/139) and [#234](https://github.com/blockstack/ux/issues/234) ([336a235](https://github.com/blockstack/ux/commit/336a23562f4f5d769d6c0e846afac79c9e8b29ae))
- adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/ux/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
- Alignment of the onboarding create screen, Closes [#136](https://github.com/blockstack/ux/issues/136) ([7e16aa5](https://github.com/blockstack/ux/commit/7e16aa52f207146ef01bd5698bedfdb3eaf978db))
- All uses of seed phrase ([c9e32a2](https://github.com/blockstack/ux/commit/c9e32a2d7ba302c4669dcbfe416fa4be86dcd8e3))
- app name undefined on create screen ([d8930dd](https://github.com/blockstack/ux/commit/d8930ddaf5a7b157bf17fed134da0c861adc8125))
- change button sizes to lg ([9465556](https://github.com/blockstack/ux/commit/9465556a49dc73ba1e947c06ce196b486d8f34e5))
- choose account after sign in with key, fixes [#156](https://github.com/blockstack/ux/issues/156) ([432ab82](https://github.com/blockstack/ux/commit/432ab8236e9b135c836986e92292faf6dcd01469))
- choose account hover styles ([e924b04](https://github.com/blockstack/ux/commit/e924b04e9ad38b46353667b50d3eca87b30965eb))
- clear onboarding path on sign out [#341](https://github.com/blockstack/ux/issues/341) ([f0820c9](https://github.com/blockstack/ux/commit/f0820c999143f8a00d89bcc04ecef0fa1699b5f1))
- document.title bug [#335](https://github.com/blockstack/ux/issues/335), caused by invalid redux hydration ([882fdd6](https://github.com/blockstack/ux/commit/882fdd6bfcb34e1ff1caed114065dc7b7b228e4d))
- document.title undefined, fixes [#335](https://github.com/blockstack/ux/issues/335) ([378b903](https://github.com/blockstack/ux/commit/378b903af1d0c66eed499d4ddba951b3a62bb658))
- dont require built ui to build connect ([c354be7](https://github.com/blockstack/ux/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))
- dont show secret key when logged out, [#340](https://github.com/blockstack/ux/issues/340) ([355d518](https://github.com/blockstack/ux/commit/355d518c545527337db8efad3038bf65544e5a33))
- dont show warning if app already used, closes [#188](https://github.com/blockstack/ux/issues/188) ([93e110a](https://github.com/blockstack/ux/commit/93e110a0f357b756e66546d13061176370583d54))
- Ensure key input trims whitespace, Closes blockstack/connect[#66](https://github.com/blockstack/ux/issues/66) ([5dc347f](https://github.com/blockstack/ux/commit/5dc347f79024b452ef1440e58701e05b77beb3e3))
- Ensure page events are tracked ([e64396f](https://github.com/blockstack/ux/commit/e64396fc2688d0cb62f14a8aa515b826907f9da8))
- Error message, Closes [#169](https://github.com/blockstack/ux/issues/169) ([02e7c46](https://github.com/blockstack/ux/commit/02e7c46b5d5522c165c0b045e375b75df2ca8ca2))
- ErrorLabels not formatted properly, Closes [#159](https://github.com/blockstack/ux/issues/159) ([981dab6](https://github.com/blockstack/ux/commit/981dab62c445e537cc5ee0df7ec1522b5eeb2a11))
- hard-coded "Messenger" in secret key page ([bfc0848](https://github.com/blockstack/ux/commit/bfc084809ff0e03ac588592d9c041e37fdfee21a))
- hide icon in ScreenHeader if missing ([75d0682](https://github.com/blockstack/ux/commit/75d06824fa47aa660772b185723d5882934e3633))
- Input/Textarea fields autocapitalizing on iOS, Closes [#180](https://github.com/blockstack/ux/issues/180) ([45ec252](https://github.com/blockstack/ux/commit/45ec25224633ea8cfaa43cd57377e23138b4fd64))
- long usernames text-align: left, fixes [#174](https://github.com/blockstack/ux/issues/174) ([0939f99](https://github.com/blockstack/ux/commit/0939f99efedb4ed9555df7d2ec742fbdadd8a3b9))
- magic recovery code flow getting stuck ([500fdeb](https://github.com/blockstack/ux/commit/500fdebfad77cb7690f6ba17dd2822c96c439aa7))
- missing app icon on username error, [#338](https://github.com/blockstack/ux/issues/338) ([7296f63](https://github.com/blockstack/ux/commit/7296f63c91d53bbc06fdc995d672c0c978c76adf))
- Prevent zoom on focus by increasing fontsize, Closes [#183](https://github.com/blockstack/ux/issues/183) ([4044c1b](https://github.com/blockstack/ux/commit/4044c1ba9a72ef03d402fa9fb27ae14c346c62bc))
- profile info not set in authResponse ([9e48475](https://github.com/blockstack/ux/commit/9e4847544e89dc1c8abcebeda6d34dc2bf8a4c7f))
- proper title tracking, [#201](https://github.com/blockstack/ux/issues/201) ([b715c8b](https://github.com/blockstack/ux/commit/b715c8b3eac8fdef953252e74912fdfdc36a68e3))
- Remove resize and spellchecking from all inputs/textareas, Closes [#153](https://github.com/blockstack/ux/issues/153) ([a0eff88](https://github.com/blockstack/ux/commit/a0eff8825ebe12dd0a66e713aeed823137eb9f04))
- remove undefined ([a50bcb4](https://github.com/blockstack/ux/commit/a50bcb492db9d5561e04b992d04c4cd931714b23))
- Remove username placeholder ([c6d6258](https://github.com/blockstack/ux/commit/c6d62587e01848d6a3fe66813157fd1038c42ec5))
- screens with inputs will now submit on return, fixes: [#147](https://github.com/blockstack/ux/issues/147), [#160](https://github.com/blockstack/ux/issues/160) ([31cbbe4](https://github.com/blockstack/ux/commit/31cbbe4df8e5a50744e2eaad0f9e18ee4f16fde0))
- send to sign-in if sendToSignIn, even if path = sign-up ([b397ff3](https://github.com/blockstack/ux/commit/b397ff39d6a78cb7ae4a7364b5ba4fcf1ee51163))
- sign in flows dont change screen properly ([3c162cd](https://github.com/blockstack/ux/commit/3c162cd8d9de84ece62b663d53003806e154fd1f))
- spacing on collapse component ([0541cba](https://github.com/blockstack/ux/commit/0541cba80df697541f4590cd7768dd7617c5c4c2))
- textarea height and title ([60df34a](https://github.com/blockstack/ux/commit/60df34a44fdcbe694f3db3809a8f89567e59e038))
- Tracking ([#111](https://github.com/blockstack/ux/issues/111)) ([4babe6b](https://github.com/blockstack/ux/commit/4babe6bd4235367ec09b43270b960d07dda41b23))
- ts error with react-router import ([8ecef0f](https://github.com/blockstack/ux/commit/8ecef0fbd537666c66f1f41bf85371b8ca80d166))
- typo ([5c40890](https://github.com/blockstack/ux/commit/5c40890f41678150fe3dee92aa67101326e552a3))
- update type for button mode prop ([3f8ad2f](https://github.com/blockstack/ux/commit/3f8ad2f15a6f2784b3440acf3265f991726fe8eb))
- validate that seed is not empty on sign in, fixes [#170](https://github.com/blockstack/ux/issues/170) ([e0ea149](https://github.com/blockstack/ux/commit/e0ea14909bad5b7f428a835953eb01230fa709f1))
- Visual glitches with account warning dialog ([ca2224b](https://github.com/blockstack/ux/commit/ca2224b9a034f01181dc905baca77a623bc74d22))

### Features

- add ability to view secret key ([440c3e5](https://github.com/blockstack/ux/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))
- add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))
- add CI, proper connections between packages ([5934829](https://github.com/blockstack/ux/commit/5934829a40338ac269b80783912c8dad17af1962))
- add debug mode for transaction signing ([3c66887](https://github.com/blockstack/ux/commit/3c6688714b070a38c2eefe0d93a6218163917c53))
- Add identity validation and availability to the auth flow ([3f51783](https://github.com/blockstack/ux/commit/3f51783d33373cb815121a55772d751fe2c09504))
- add keychain logic to restore identities ([e2a18d6](https://github.com/blockstack/ux/commit/e2a18d6036327efe403892eeec721ad9951c8983))
- add link back to Secret Key page, Closes [#168](https://github.com/blockstack/ux/issues/168) ([5ed74c7](https://github.com/blockstack/ux/commit/5ed74c7cd417994667b325cf4ca96a3fd23c7ed4))
- Add loading spinner when selecting account, Closes [#96](https://github.com/blockstack/ux/issues/96) ([386235d](https://github.com/blockstack/ux/commit/386235d6ec7dd7dc62286e0bd16fe3a44448c7cf))
- add proper page tracking to first page ([89b9f5d](https://github.com/blockstack/ux/commit/89b9f5d5bd52550e1d8b53a06302ed708060df2a))
- Add validation to seed entry field ([#63](https://github.com/blockstack/ux/issues/63)) ([6a34531](https://github.com/blockstack/ux/commit/6a345311037f61d19992284065696631c42f3f84))
- add variants to username error state ([19b603b](https://github.com/blockstack/ux/commit/19b603ba4ba40b42f2d0a9d99cf274af1c3eaf20))
- add vercel headers ([ae3c72a](https://github.com/blockstack/ux/commit/ae3c72afff49c09145d896412356cd129668f29d))
- Add write key segment ([8ff9be7](https://github.com/blockstack/ux/commit/8ff9be77b1494f44a69e890c5d4b2c724ad7e00b))
- adds appURL to onboarding store ([5085bb0](https://github.com/blockstack/ux/commit/5085bb0072c8640110b12ebf8e8d98bdd1928dcb))
- adds onCancel method for when popup closed ([c5800ae](https://github.com/blockstack/ux/commit/c5800aeb341c65e108b93b5e7a17a6d937292fc1))
- adds screen changed event ([b1600b6](https://github.com/blockstack/ux/commit/b1600b6e41a70d39f92a9818eb203d6941e81b6b))
- change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
- codebox and highlighter ([b9056f8](https://github.com/blockstack/ux/commit/b9056f8102eff8d32898201717a3cd3699234561))
- dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))
- expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))
- implement basic homepage ([10ac702](https://github.com/blockstack/ux/commit/10ac70200e769ae91544073e75347e9d1de33e81))
- implementation of router ([bd03411](https://github.com/blockstack/ux/commit/bd034112a098868d07e04dc6aba97d15145707d1))
- improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/ux/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))
- improve extension instructions ([e4f9f89](https://github.com/blockstack/ux/commit/e4f9f899a3e42796e34e70943efc52f68a77eba0))
- Layout closer to designs, created <ExplainerCard /> ([#68](https://github.com/blockstack/ux/issues/68)) ([52f4fe7](https://github.com/blockstack/ux/commit/52f4fe75f93676e35d6986246262acf1eb6a6c2f))
- more detailed events to username ([5cc323b](https://github.com/blockstack/ux/commit/5cc323b4ba7b122e7f5a60dfee422b3ca7f21942))
- more events, mostly around choosing an account ([a1f7401](https://github.com/blockstack/ux/commit/a1f7401b226fe2ae196d8dadc8c4d3711fada998))
- move changing screen into analytics hook ([0be47b5](https://github.com/blockstack/ux/commit/0be47b54619f9bb0bd859b14ce6e253017cd1e03)), closes [#130](https://github.com/blockstack/ux/issues/130)
- move doTrack into hook, [#130](https://github.com/blockstack/ux/issues/130) ([6b1d390](https://github.com/blockstack/ux/commit/6b1d390e5f4ac36fd1aeb5d28f53daa9b8ae0bce))
- move username screen to the end, closes [#110](https://github.com/blockstack/ux/issues/110) ([942379b](https://github.com/blockstack/ux/commit/942379b3c7de757d20bc43b85e5ed426cc086691))
- Page title changes between screens, Closes [#149](https://github.com/blockstack/ux/issues/149) ([e1373d8](https://github.com/blockstack/ux/commit/e1373d8c657e861d71d19311d6426f1c37c2a7d1))
- prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/ux/issues/224) ([12a6772](https://github.com/blockstack/ux/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
- refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
- remove auto username generation ([b160f2b](https://github.com/blockstack/ux/commit/b160f2b05613118cc920d2344defa06b45ce214e))
- remove connect screen at end of onboarding ([42c8958](https://github.com/blockstack/ux/commit/42c895838786c6843113409148c0e6b263e96e0e))
- remove secret key branding, [#334](https://github.com/blockstack/ux/issues/334) ([e57c8bc](https://github.com/blockstack/ux/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))
- rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))
- send user back into unfinished onboarding flow ([5ccda3c](https://github.com/blockstack/ux/commit/5ccda3c278e0caac7b4669a193b8e62209fda543))
- show error page when username registration fails ([fd457c6](https://github.com/blockstack/ux/commit/fd457c60f7081ee44c7fa7ae2cb3ab06070293c2))
- slight speedup on final auth transition ([6fb56a8](https://github.com/blockstack/ux/commit/6fb56a89181cdb99d4b20d27066647dd93f46fcb))
- support relative app icons in appDetails, closes [#348](https://github.com/blockstack/ux/issues/348) ([40f27dc](https://github.com/blockstack/ux/commit/40f27dcb64eecfa7d5f85ff8fba18999a21ea97f))
- use .id.blockstack subdomain, fixes [#123](https://github.com/blockstack/ux/issues/123) ([59d3087](https://github.com/blockstack/ux/commit/59d3087654bb52396d242467cab897621dce3f6c))
- use stats package for metrics ([710f1fc](https://github.com/blockstack/ux/commit/710f1fca0a3fc8ad4aaed75ec828ddb815b1483b))
- use window.location for ios redirect ([9d83fc9](https://github.com/blockstack/ux/commit/9d83fc916e029d437f6a2e8af9b19b734f4aa3ac))
- **app:** hide default domain placeholder during onboarding ([8a12763](https://github.com/blockstack/ux/commit/8a12763d65112626766630ff915e3ae802fe82ef)), closes [#221](https://github.com/blockstack/ux/issues/221) [#220](https://github.com/blockstack/ux/issues/220)
- **onboarding:** update branding, copy ([7b4f6ac](https://github.com/blockstack/ux/commit/7b4f6ac43f5764626bd59608ec0d1eed8d664d69))

## 1.15.7 (2020-10-05)

### Bug Fixes

- **connect:** use authOrigin from authOptions ([e6602a8](https://github.com/blockstack/ux/commit/e6602a8a559158d3ecf92268495176619d1f340e))

## 1.15.6 (2020-10-05)

### Bug Fixes

- remaining broken sidecar urls, fixes [#615](https://github.com/blockstack/ux/issues/615) ([4c26fce](https://github.com/blockstack/ux/commit/4c26fcea34c1603e4ea63d1be7b576b9ccb45a42))

## 1.15.5 (2020-09-29)

### Bug Fixes

- update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))

## 1.15.4 (2020-09-25)

### Bug Fixes

- add yarn.lock ([24d88d5](https://github.com/blockstack/ux/commit/24d88d5a29d2a4d3d8acee5ce70cd5ecb3c997c4))

## 1.15.3 (2020-09-16)

### Bug Fixes

- keychain lib still broken ([1a7fd0c](https://github.com/blockstack/ux/commit/1a7fd0ced01a6ec8bdd31bf84140728e4b1d7e30))

## 1.15.2 (2020-09-10)

### Bug Fixes

- **keychain:** use correct filepath when writing profiles ([fa8098a](https://github.com/blockstack/ux/commit/fa8098ae13973dd5e53303a4b04967a956d8842b))

## 1.15.1 (2020-08-21)

**Note:** Version bump only for package @blockstack/app

# [1.15.0](https://github.com/blockstack/ux/compare/@blockstack/app@1.14.0...@blockstack/app@1.15.0) (2020-08-21)

### Bug Fixes

- keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
- rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
- **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))

### Features

- change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
- dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))

# [1.14.0](https://github.com/blockstack/ux/compare/@blockstack/app@1.13.5...@blockstack/app@1.14.0) (2020-08-11)

### Bug Fixes

- dont have selected address when canceling reuse, fixes [#454](https://github.com/blockstack/ux/issues/454) ([27f8f61](https://github.com/blockstack/ux/commit/27f8f616549ef9acc1e121f1fda9a40f8a142898))
- prevent auto-zoom of sign in field, fixes [#510](https://github.com/blockstack/ux/issues/510) ([eea3219](https://github.com/blockstack/ux/commit/eea3219c2de0925b7dd34a5f9fe2e5f6adb0ddc4))
- show correct secret key on home screen, fixes [#517](https://github.com/blockstack/ux/issues/517) ([e14afcf](https://github.com/blockstack/ux/commit/e14afcf036ef25d45a541005aa9bb88cd218f4ab))
- show loading when reusing account, fixes [#464](https://github.com/blockstack/ux/issues/464) ([19fbf4e](https://github.com/blockstack/ux/commit/19fbf4efdc5755d26587ca01f225557082d61701))

### Features

- add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))

## 1.13.5 (2020-07-30)

### Bug Fixes

- reset text-align within connect modal, fixes [#458](https://github.com/blockstack/ux/issues/458) ([aecc700](https://github.com/blockstack/ux/commit/aecc70016809c3750d5cde730db4aeaffd52bb98))

## 1.13.4 (2020-07-28)

**Note:** Version bump only for package @blockstack/app

## 1.13.3 (2020-07-28)

### Bug Fixes

- cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))

## 1.13.2 (2020-07-27)

### Bug Fixes

- **connect:** pass all data to token ([3f46f60](https://github.com/blockstack/ux/commit/3f46f600cccfeadca381574b2b493709b4bba590))

## 1.13.1 (2020-07-24)

### Bug Fixes

- send to sign in when using showBlockstackConnect, fixes [#507](https://github.com/blockstack/ux/issues/507) ([d7698e8](https://github.com/blockstack/ux/commit/d7698e839e44177e56617701d9df0bca5a60924a))

# 1.13.0 (2020-07-24)

### Features

- better bundle size with esmodules ([2c7046f](https://github.com/blockstack/ux/commit/2c7046f70d2ea10ffd973a4ea816a760ffc26952))

## 1.12.1 (2020-07-24)

### Bug Fixes

- force app icon 100% size in connect modal, fixes [#455](https://github.com/blockstack/ux/issues/455) ([4f69f75](https://github.com/blockstack/ux/commit/4f69f75cf7a153c6511cd200e3d1604e5a049226))

# 1.12.0 (2020-07-23)

### Features

- expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))

## 1.11.6 (2020-07-22)

### Bug Fixes

- docs not building ([d6acb21](https://github.com/blockstack/ux/commit/d6acb21d6e9d6ca171dbbac13a2cc38e7f68b4b9))

## 1.11.5 (2020-07-22)

### Bug Fixes

- workflow syntax for test-app deployment ([976fe54](https://github.com/blockstack/ux/commit/976fe54ee4e0e28833bad515ceccc5fd7f98df3a))

## 1.11.4 (2020-07-22)

**Note:** Version bump only for package @blockstack/app

## 1.11.3 (2020-07-14)

### Bug Fixes

- textStyles not being typed ([2428f69](https://github.com/blockstack/blockstack-app/commit/2428f69ddc39f20c566f2686a65959b59f52e9aa))

## 1.11.2 (2020-07-09)

**Note:** Version bump only for package @blockstack/app

## 1.11.1 (2020-07-09)

**Note:** Version bump only for package @blockstack/app

# 1.11.0 (2020-07-07)

### Features

- add codesandbox ci ([9e903d7](https://github.com/blockstack/blockstack-app/commit/9e903d7141c21503339159255cd06fb6701b1e3b))

## 1.10.5 (2020-06-30)

**Note:** Version bump only for package @blockstack/app

## [1.10.4](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.3...@blockstack/app@1.10.4) (2020-06-30)

**Note:** Version bump only for package @blockstack/app

## [1.10.3](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.2...@blockstack/app@1.10.3) (2020-06-30)

**Note:** Version bump only for package @blockstack/app

## [1.10.2](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.1...@blockstack/app@1.10.2) (2020-06-29)

**Note:** Version bump only for package @blockstack/app

## [1.10.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.0...@blockstack/app@1.10.1) (2020-06-24)

### Bug Fixes

- ui version behind published ([8198ca0](https://github.com/blockstack/blockstack-app/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))

# [1.10.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.3...@blockstack/app@1.10.0) (2020-06-24)

### Bug Fixes

- better readme for firefox install ([cbecc86](https://github.com/blockstack/blockstack-app/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
- connect version was behind published ([2d7633e](https://github.com/blockstack/blockstack-app/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
- create secret key link not working, [#436](https://github.com/blockstack/blockstack-app/issues/436) ([c5870f5](https://github.com/blockstack/blockstack-app/commit/c5870f5422c49c754943eba70d7cc5285fc0ea01))
- home page alignment, [#440](https://github.com/blockstack/blockstack-app/issues/440) ([06dde15](https://github.com/blockstack/blockstack-app/commit/06dde15a651f901222650c015c75f8c1343068b6))
- keychain package was behind published version ([acbd4b0](https://github.com/blockstack/blockstack-app/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
- remove unused perms from manifest ([52abc1f](https://github.com/blockstack/blockstack-app/commit/52abc1fc91396dd04d322894a18ed257f2a13864))
- tweaks to get extension working ([e068dce](https://github.com/blockstack/blockstack-app/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))
- use async dispatch, fixes [#441](https://github.com/blockstack/blockstack-app/issues/441) ([b097348](https://github.com/blockstack/blockstack-app/commit/b0973483dac295747cd511af87e42d3b5e156185))

### Features

- add variants to username error state ([19b603b](https://github.com/blockstack/blockstack-app/commit/19b603ba4ba40b42f2d0a9d99cf274af1c3eaf20))

## [1.9.3](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.2...@blockstack/app@1.9.3) (2020-06-10)

**Note:** Version bump only for package @blockstack/app

## [1.9.2](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.1...@blockstack/app@1.9.2) (2020-06-07)

### Bug Fixes

- better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/blockstack-app/commit/31518632bf91c6217734c21c1163ae076f22368a))

## [1.9.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.0...@blockstack/app@1.9.1) (2020-05-21)

**Note:** Version bump only for package @blockstack/app

# [1.9.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.8.0...@blockstack/app@1.9.0) (2020-05-15)

### Bug Fixes

- **app:** routing bug when trying to create new key, fixes [#381](https://github.com/blockstack/blockstack-app/issues/381) ([66f78aa](https://github.com/blockstack/blockstack-app/commit/66f78aaf64c3dd38555173ba68ca49ef9445bb53))

### Features

- use window.location for ios redirect ([9d83fc9](https://github.com/blockstack/blockstack-app/commit/9d83fc916e029d437f6a2e8af9b19b734f4aa3ac))

# [1.8.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.7.0...@blockstack/app@1.8.0) (2020-05-06)

### Features

- codebox and highlighter ([b9056f8](https://github.com/blockstack/blockstack-app/commit/b9056f8102eff8d32898201717a3cd3699234561))

# [1.7.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.6.1...@blockstack/app@1.7.0) (2020-04-30)

### Bug Fixes

- clear onboarding path on sign out [#341](https://github.com/blockstack/blockstack-app/issues/341) ([f0820c9](https://github.com/blockstack/blockstack-app/commit/f0820c999143f8a00d89bcc04ecef0fa1699b5f1))
- document.title bug [#335](https://github.com/blockstack/blockstack-app/issues/335), caused by invalid redux hydration ([882fdd6](https://github.com/blockstack/blockstack-app/commit/882fdd6bfcb34e1ff1caed114065dc7b7b228e4d))
- document.title undefined, fixes [#335](https://github.com/blockstack/blockstack-app/issues/335) ([378b903](https://github.com/blockstack/blockstack-app/commit/378b903af1d0c66eed499d4ddba951b3a62bb658))
- dont show secret key when logged out, [#340](https://github.com/blockstack/blockstack-app/issues/340) ([355d518](https://github.com/blockstack/blockstack-app/commit/355d518c545527337db8efad3038bf65544e5a33))
- missing app icon on username error, [#338](https://github.com/blockstack/blockstack-app/issues/338) ([7296f63](https://github.com/blockstack/blockstack-app/commit/7296f63c91d53bbc06fdc995d672c0c978c76adf))
- ts error with react-router import ([8ecef0f](https://github.com/blockstack/blockstack-app/commit/8ecef0fbd537666c66f1f41bf85371b8ca80d166))

### Features

- remove secret key branding, [#334](https://github.com/blockstack/blockstack-app/issues/334) ([e57c8bc](https://github.com/blockstack/blockstack-app/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))

## [1.6.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.6.0...@blockstack/app@1.6.1) (2020-04-17)

### Bug Fixes

- profile info not set in authResponse ([9e48475](https://github.com/blockstack/blockstack-app/commit/9e4847544e89dc1c8abcebeda6d34dc2bf8a4c7f))

# [1.6.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.5.1...@blockstack/app@1.6.0) (2020-03-12)

### Features

- send user back into unfinished onboarding flow ([5ccda3c](https://github.com/blockstack/blockstack-app/commit/5ccda3c278e0caac7b4669a193b8e62209fda543))

## [1.5.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.5.0...@blockstack/app@1.5.1) (2020-03-12)

### Bug Fixes

- hide icon in ScreenHeader if missing ([75d0682](https://github.com/blockstack/blockstack-app/commit/75d06824fa47aa660772b185723d5882934e3633))

# [1.5.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.4.1...@blockstack/app@1.5.0) (2020-03-12)

### Features

- improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/blockstack-app/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))

## [1.4.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.4.0...@blockstack/app@1.4.1) (2020-03-12)

### Bug Fixes

- send to sign-in if sendToSignIn, even if path = sign-up ([b397ff3](https://github.com/blockstack/blockstack-app/commit/b397ff39d6a78cb7ae4a7364b5ba4fcf1ee51163))

# [1.4.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.3.0...@blockstack/app@1.4.0) (2020-03-10)

### Features

- add ability to view secret key ([440c3e5](https://github.com/blockstack/blockstack-app/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))

# [1.3.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.2.0...@blockstack/app@1.3.0) (2020-03-10)

### Features

- use stats package for metrics ([710f1fc](https://github.com/blockstack/blockstack-app/commit/710f1fca0a3fc8ad4aaed75ec828ddb815b1483b))

# [1.2.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.1.2...@blockstack/app@1.2.0) (2020-03-10)

### Bug Fixes

- dont require built ui to build connect ([c354be7](https://github.com/blockstack/blockstack-app/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))

### Features

- implementation of router ([bd03411](https://github.com/blockstack/blockstack-app/commit/bd034112a098868d07e04dc6aba97d15145707d1))

## [1.1.2](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.1.1...@blockstack/app@1.1.2) (2020-03-10)

**Note:** Version bump only for package @blockstack/app

## [1.1.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.1.0...@blockstack/app@1.1.1) (2020-03-10)

**Note:** Version bump only for package @blockstack/app

# 1.1.0 (2020-03-10)

### Bug Fixes

- 16px below app icon ([4097510](https://github.com/blockstack/blockstack-app/commit/4097510df66c28343782af3cb558348689bb9b36))
- add account loading/transition, fixes [#163](https://github.com/blockstack/blockstack-app/issues/163) ([fbd063c](https://github.com/blockstack/blockstack-app/commit/fbd063c740698d0269d3f6cd862a112a9fb082b7))
- Add hover action to '<Account/>' list ([c405989](https://github.com/blockstack/blockstack-app/commit/c405989b071adc070463a2047e9e7ae6751e974b))
- add spacing below title, fixes [#139](https://github.com/blockstack/blockstack-app/issues/139) and [#234](https://github.com/blockstack/blockstack-app/issues/234) ([336a235](https://github.com/blockstack/blockstack-app/commit/336a23562f4f5d769d6c0e846afac79c9e8b29ae))
- adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/blockstack-app/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
- Alignment of the onboarding create screen, Closes [#136](https://github.com/blockstack/blockstack-app/issues/136) ([7e16aa5](https://github.com/blockstack/blockstack-app/commit/7e16aa52f207146ef01bd5698bedfdb3eaf978db))
- All uses of seed phrase ([c9e32a2](https://github.com/blockstack/blockstack-app/commit/c9e32a2d7ba302c4669dcbfe416fa4be86dcd8e3))
- app name undefined on create screen ([d8930dd](https://github.com/blockstack/blockstack-app/commit/d8930ddaf5a7b157bf17fed134da0c861adc8125))
- change button sizes to lg ([9465556](https://github.com/blockstack/blockstack-app/commit/9465556a49dc73ba1e947c06ce196b486d8f34e5))
- choose account after sign in with key, fixes [#156](https://github.com/blockstack/blockstack-app/issues/156) ([432ab82](https://github.com/blockstack/blockstack-app/commit/432ab8236e9b135c836986e92292faf6dcd01469))
- choose account hover styles ([e924b04](https://github.com/blockstack/blockstack-app/commit/e924b04e9ad38b46353667b50d3eca87b30965eb))
- dont show warning if app already used, closes [#188](https://github.com/blockstack/blockstack-app/issues/188) ([93e110a](https://github.com/blockstack/blockstack-app/commit/93e110a0f357b756e66546d13061176370583d54))
- Ensure key input trims whitespace, Closes blockstack/connect[#66](https://github.com/blockstack/blockstack-app/issues/66) ([5dc347f](https://github.com/blockstack/blockstack-app/commit/5dc347f79024b452ef1440e58701e05b77beb3e3))
- Ensure page events are tracked ([e64396f](https://github.com/blockstack/blockstack-app/commit/e64396fc2688d0cb62f14a8aa515b826907f9da8))
- Error message, Closes [#169](https://github.com/blockstack/blockstack-app/issues/169) ([02e7c46](https://github.com/blockstack/blockstack-app/commit/02e7c46b5d5522c165c0b045e375b75df2ca8ca2))
- ErrorLabels not formatted properly, Closes [#159](https://github.com/blockstack/blockstack-app/issues/159) ([981dab6](https://github.com/blockstack/blockstack-app/commit/981dab62c445e537cc5ee0df7ec1522b5eeb2a11))
- hard-coded "Messenger" in secret key page ([bfc0848](https://github.com/blockstack/blockstack-app/commit/bfc084809ff0e03ac588592d9c041e37fdfee21a))
- Input/Textarea fields autocapitalizing on iOS, Closes [#180](https://github.com/blockstack/blockstack-app/issues/180) ([45ec252](https://github.com/blockstack/blockstack-app/commit/45ec25224633ea8cfaa43cd57377e23138b4fd64))
- long usernames text-align: left, fixes [#174](https://github.com/blockstack/blockstack-app/issues/174) ([0939f99](https://github.com/blockstack/blockstack-app/commit/0939f99efedb4ed9555df7d2ec742fbdadd8a3b9))
- magic recovery code flow getting stuck ([500fdeb](https://github.com/blockstack/blockstack-app/commit/500fdebfad77cb7690f6ba17dd2822c96c439aa7))
- Prevent zoom on focus by increasing fontsize, Closes [#183](https://github.com/blockstack/blockstack-app/issues/183) ([4044c1b](https://github.com/blockstack/blockstack-app/commit/4044c1ba9a72ef03d402fa9fb27ae14c346c62bc))
- proper title tracking, [#201](https://github.com/blockstack/blockstack-app/issues/201) ([b715c8b](https://github.com/blockstack/blockstack-app/commit/b715c8b3eac8fdef953252e74912fdfdc36a68e3))
- Remove resize and spellchecking from all inputs/textareas, Closes [#153](https://github.com/blockstack/blockstack-app/issues/153) ([a0eff88](https://github.com/blockstack/blockstack-app/commit/a0eff8825ebe12dd0a66e713aeed823137eb9f04))
- remove undefined ([a50bcb4](https://github.com/blockstack/blockstack-app/commit/a50bcb492db9d5561e04b992d04c4cd931714b23))
- Remove username placeholder ([c6d6258](https://github.com/blockstack/blockstack-app/commit/c6d62587e01848d6a3fe66813157fd1038c42ec5))
- screens with inputs will now submit on return, fixes: [#147](https://github.com/blockstack/blockstack-app/issues/147), [#160](https://github.com/blockstack/blockstack-app/issues/160) ([31cbbe4](https://github.com/blockstack/blockstack-app/commit/31cbbe4df8e5a50744e2eaad0f9e18ee4f16fde0))
- sign in flows dont change screen properly ([3c162cd](https://github.com/blockstack/blockstack-app/commit/3c162cd8d9de84ece62b663d53003806e154fd1f))
- spacing on collapse component ([0541cba](https://github.com/blockstack/blockstack-app/commit/0541cba80df697541f4590cd7768dd7617c5c4c2))
- textarea height and title ([60df34a](https://github.com/blockstack/blockstack-app/commit/60df34a44fdcbe694f3db3809a8f89567e59e038))
- Tracking ([#111](https://github.com/blockstack/blockstack-app/issues/111)) ([4babe6b](https://github.com/blockstack/blockstack-app/commit/4babe6bd4235367ec09b43270b960d07dda41b23))
- typo ([5c40890](https://github.com/blockstack/blockstack-app/commit/5c40890f41678150fe3dee92aa67101326e552a3))
- update type for button mode prop ([3f8ad2f](https://github.com/blockstack/blockstack-app/commit/3f8ad2f15a6f2784b3440acf3265f991726fe8eb))
- validate that seed is not empty on sign in, fixes [#170](https://github.com/blockstack/blockstack-app/issues/170) ([e0ea149](https://github.com/blockstack/blockstack-app/commit/e0ea14909bad5b7f428a835953eb01230fa709f1))
- Visual glitches with account warning dialog ([ca2224b](https://github.com/blockstack/blockstack-app/commit/ca2224b9a034f01181dc905baca77a623bc74d22))

### Features

- add CI, proper connections between packages ([5934829](https://github.com/blockstack/blockstack-app/commit/5934829a40338ac269b80783912c8dad17af1962))
- Add identity validation and availability to the auth flow ([3f51783](https://github.com/blockstack/blockstack-app/commit/3f51783d33373cb815121a55772d751fe2c09504))
- add keychain logic to restore identities ([e2a18d6](https://github.com/blockstack/blockstack-app/commit/e2a18d6036327efe403892eeec721ad9951c8983))
- add link back to Secret Key page, Closes [#168](https://github.com/blockstack/blockstack-app/issues/168) ([5ed74c7](https://github.com/blockstack/blockstack-app/commit/5ed74c7cd417994667b325cf4ca96a3fd23c7ed4))
- Add loading spinner when selecting account, Closes [#96](https://github.com/blockstack/blockstack-app/issues/96) ([386235d](https://github.com/blockstack/blockstack-app/commit/386235d6ec7dd7dc62286e0bd16fe3a44448c7cf))
- add proper page tracking to first page ([89b9f5d](https://github.com/blockstack/blockstack-app/commit/89b9f5d5bd52550e1d8b53a06302ed708060df2a))
- Add validation to seed entry field ([#63](https://github.com/blockstack/blockstack-app/issues/63)) ([6a34531](https://github.com/blockstack/blockstack-app/commit/6a345311037f61d19992284065696631c42f3f84))
- Add write key segment ([8ff9be7](https://github.com/blockstack/blockstack-app/commit/8ff9be77b1494f44a69e890c5d4b2c724ad7e00b))
- adds appURL to onboarding store ([5085bb0](https://github.com/blockstack/blockstack-app/commit/5085bb0072c8640110b12ebf8e8d98bdd1928dcb))
- adds screen changed event ([b1600b6](https://github.com/blockstack/blockstack-app/commit/b1600b6e41a70d39f92a9818eb203d6941e81b6b))
- implement basic homepage ([10ac702](https://github.com/blockstack/blockstack-app/commit/10ac70200e769ae91544073e75347e9d1de33e81))
- Layout closer to designs, created <ExplainerCard /> ([#68](https://github.com/blockstack/blockstack-app/issues/68)) ([52f4fe7](https://github.com/blockstack/blockstack-app/commit/52f4fe75f93676e35d6986246262acf1eb6a6c2f))
- more detailed events to username ([5cc323b](https://github.com/blockstack/blockstack-app/commit/5cc323b4ba7b122e7f5a60dfee422b3ca7f21942))
- more events, mostly around choosing an account ([a1f7401](https://github.com/blockstack/blockstack-app/commit/a1f7401b226fe2ae196d8dadc8c4d3711fada998))
- move changing screen into analytics hook ([0be47b5](https://github.com/blockstack/blockstack-app/commit/0be47b54619f9bb0bd859b14ce6e253017cd1e03)), closes [#130](https://github.com/blockstack/blockstack-app/issues/130)
- move doTrack into hook, [#130](https://github.com/blockstack/blockstack-app/issues/130) ([6b1d390](https://github.com/blockstack/blockstack-app/commit/6b1d390e5f4ac36fd1aeb5d28f53daa9b8ae0bce))
- prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/blockstack-app/issues/224) ([12a6772](https://github.com/blockstack/blockstack-app/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
- **app:** hide default domain placeholder during onboarding ([8a12763](https://github.com/blockstack/blockstack-app/commit/8a12763d65112626766630ff915e3ae802fe82ef)), closes [#221](https://github.com/blockstack/blockstack-app/issues/221) [#220](https://github.com/blockstack/blockstack-app/issues/220)
- move username screen to the end, closes [#110](https://github.com/blockstack/blockstack-app/issues/110) ([942379b](https://github.com/blockstack/blockstack-app/commit/942379b3c7de757d20bc43b85e5ed426cc086691))
- Page title changes between screens, Closes [#149](https://github.com/blockstack/blockstack-app/issues/149) ([e1373d8](https://github.com/blockstack/blockstack-app/commit/e1373d8c657e861d71d19311d6426f1c37c2a7d1))
- remove auto username generation ([b160f2b](https://github.com/blockstack/blockstack-app/commit/b160f2b05613118cc920d2344defa06b45ce214e))
- remove connect screen at end of onboarding ([42c8958](https://github.com/blockstack/blockstack-app/commit/42c895838786c6843113409148c0e6b263e96e0e))
- show error page when username registration fails ([fd457c6](https://github.com/blockstack/blockstack-app/commit/fd457c60f7081ee44c7fa7ae2cb3ab06070293c2))
- slight speedup on final auth transition ([6fb56a8](https://github.com/blockstack/blockstack-app/commit/6fb56a89181cdb99d4b20d27066647dd93f46fcb))
- use .id.blockstack subdomain, fixes [#123](https://github.com/blockstack/blockstack-app/issues/123) ([59d3087](https://github.com/blockstack/blockstack-app/commit/59d3087654bb52396d242467cab897621dce3f6c))
- **onboarding:** update branding, copy ([7b4f6ac](https://github.com/blockstack/blockstack-app/commit/7b4f6ac43f5764626bd59608ec0d1eed8d664d69))
