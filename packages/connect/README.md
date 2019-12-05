# `@blockstack/connect`

A library for building excellent user experiences with Blockstack.

## API Methods

### `authenticate`

Call this method to redirect the user to authentication. It will first check for whether the user has the Blockstack extension installed. If not, it'll send them to the hosted version. The authentication flow opens a popup in the center of the screen.

- `redirectTo`: The path in your app where users go after sign in.
- `manifestPath`: The path in your app where your manifest.json file can be found
- `finished`: An optional callback that can be invoked after authentication. This prevents having to do a whole page refresh in a new tab. One argument is passed to this callback, which is an object with `authResponse` included. If included, then the `redirectTo` path is ignored.
- `vaultUrl`: The URL you'd like to use for authentication. Only necessary when developing the authentication app.