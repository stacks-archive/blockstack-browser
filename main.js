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
  var size = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 450,
    frame: true,
    titleBarStyle: 'hidden'
  });

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
