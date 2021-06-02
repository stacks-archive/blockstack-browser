---
'@stacks/wallet-web': minor
---

### SIP 010 support

The main goal behind this PR was to support tokens that conform to the [SIP 010 Fungible token standard](https://github.com/stacksgov/sips/pull/5). Changes to the 
extension to enable this touched many areas, but mostly had to do with how we construct the state for each token and 
how we are displaying it. I've designed things in a way that we can still display older tokens or other FTs that do not conform 
by using the code we had from before as a fallback when there aren't decimals/symbol/name methods available.

*High level overview of changes:*

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
