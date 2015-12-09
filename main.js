/* eslint strict: 0 */
'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;
const shell = electron.shell;
let menu;
let template;
let mainWindow = null;


require('electron-debug')();
crashReporter.start();


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    app.quit();
  }
});


app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 337, height: 600 });

  if (process.env.HOT) {
    mainWindow.loadURL(`file://${__dirname}/app/dev-app.html`);
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/app.html`);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  if (process.platform === 'darwin') {
    template = [];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
});
