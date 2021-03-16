---
'@stacks/wallet-web': minor
---

This PR updates elements that link to the explorer throughout the application, and starts the work on displaying transaction items in a more robust way (working towards our designs in figma).

**Improvements**

- Added a copy action to the receive button
- The latest transaction item component has been updated to reflect the designs/states in figma
- items now link to explorer, fixes #1018
- fixes the drawers component such that the contents will scroll, and the header stays fixed
- created an `AccountAvatar` component to display a generated gradient (based on the account, will persist between
  sessions)
- general code health improvements
- added [capsize](https://github.com/seek-oss/capsize) for better typography sizing
