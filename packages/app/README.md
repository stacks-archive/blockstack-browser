<div align="center">

# Web Extension Starter

</div>

This project containes a minimal setup for developing a performant and well structured web extension. The extension contains a demonstration counter that is displayed on the popup and options pages as well as any open tab. 

## Good to know before using:
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [redux](https://redux.js.org/)
* [styled-components](https://www.styled-components.com/)



## Requirements:
* [NodeJS](https://nodejs.org/en/) - Javascript runtime
* [VSCode](https://code.visualstudio.com/) - Recomended editor
* [Chrome](https://www.google.com/chrome/) or [Firefox](https://www.mozilla.org/en-US/firefox/) - Web browser

## How to run:
### In terminal or command prompt

```
install dependencies
 - npm install
Transpile the code
 - npm run dev (only transpiles the code)
 - npm run watch (transpiles and watches for code changes)


yarn commands will work too if yarn is installed.
```

### In Chrome web browser
1. Go to: [**chrome://extensions**](chrome://extensions)
2. Toggle: "**developer mode**" on.
3. Click on: "**Load unpacked**"
4. Select the newly created folder "**dist**" from the project folder.
5. Thats it.

### In Firefox web browser
1. Go to: [**about:debugging**](about:debugging)
2. Select: "**Enable add-on debugging**"
3. Click on: "**Load Temporary Add-on…**"
4. Open the newly created folder "**dist**" from the project folder, and choose the "**manifest.json**" file.
5. Thats it.

### Developing the "Options" page with React hot reloading

Currently, this project does not support React hot module reloading in the extension itself. You can still run `watch` to automatically reload the project, but you'll have to refresh to see your changes.

One option is to run the app with `webpack-dev-server`. This allows you to use the "Options" page like a normal web page, with proper hot reloading. Be aware that this will not share state with the extension, including the popup. To test interactions with the popup, you still need to run the extension itself.

1. Run `yarn dev-server`
2. Open http://localhost:8080/options.html
3. Develop as you'd like

## License
MIT