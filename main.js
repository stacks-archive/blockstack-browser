import { app, BrowserWindow, Menu, crashReporter, screen, shell } from 'electron';

const menuTemplates = require('./menuTemplates');
let menu;
let template;
let mainWindow = null;

crashReporter.start();

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  } else {
    app.quit();
  }
});

app.on('ready', () => {
  var size = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 450,
    frame: false,
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
    template = menuTemplates.darwinMenuTemplate;
  } else {
    template = menuTemplates.nonDarwinMenuTemplate;
  }

  menu = Menu.buildFromTemplate(template);
  mainWindow.setMenu(menu);
});
