# Blockstack Browser QA Process

This document is intended to provide some steps to follow while testing out the browser. This should be followed when reviewing pull requests, and also when reviewing 'beta' versions of the browser before it's released publicly.

## Review-specific functionality

Generally, a pull request or beta release includes fixes and new functionality. When reviewing, you'll have to take these factors into consideration. You should test out the effected areas with the most scrutiny. This part of reviewing is very dependent on what specific change is being made, and you'll have to use your discretion as to what exactly to test.

For example, if a pull request includes a fix where clicking a button didn't work, then you should go through the flow of clicking that button and making sure it works. You want to make sure that the user interface responds appropriately, but also that whatever action is caused also functions properly.

When creating a beta release or pull request, you should include specific QA steps as to how to test your work.

## Test coverage

At the very least, all automated tests should be passing that are triggered from a pull request. The reviewer should also use their judgement to look at the code in this contribution and determine if either:

- existing tests cover this sufficiently
- new tests should be added

New tests are dependent on the type of code being used. If it is a functional change to 'back-end' code, then unit tests should be written to cover the expected results of that code. If the contribution makes changes to front-end behavior, then end-to-end (E2E) tests should cover any new or changes flows.

## General functionality

Anytime you review, you should make sure you check out all major functions of the browser to make sure they still function correctly.

1. Onboarding
  a. As a new user
  b. As an existing user. Restore your account using your 12-word seed _and_ your encrypted backup phrase (that is emailed to you)
2. Authenticating into an app
  a. Use a 'multi-party' app (like Graphite) and a 'single-player' app (like Coins)
  b. As a new user
  c. As an existing user
3. Managing your profile
  a. Updating your avatar
  b. Updating your name and description
4. Managing multiple IDs
  a. Creating new IDs
  b. Using different IDs
  c. Updating your profile on a different ID
5. Creating and removing social proofs
6. Using the wallet
  a. Checking your funds (use a BTC explorer to verify the amount is correct)
  b. Sending funds
  c. Receiving funds

## TODO

- [ ] This list is not yet comprehensive.
- [ ] Include detail descriptions and screenshots for each step