# Chord Desktop App

+ [Installation](#installation)
	+ [Toggling Chrome DevTools](#toggling-chrome-devtools)
	+ [Toggling Redux DevTools](#toggling-redux-devtools)
+ [Development](#development)
+ [Packaging](#packaging)

## Installation

```bash
npm install
```

## Development

Run this two commands __simultaneously__ in different console tabs.

```bash
npm run server
npm run app
```

*Note: Ensure a node version >= 4 and an npm version >= 2.*

#### Toggling Chrome DevTools

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

#### Toggling Redux DevTools

- All platforms: <kbd>Ctrl+H</kbd>

*See [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more information.*

## Packaging

To package apps for your platform only:

```bash
npm run package
```

To package apps for all platforms:

```bash
npm run package-all
```
