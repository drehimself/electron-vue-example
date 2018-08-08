'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let imageWindow
let settingsWindow

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createMainWindow () {
  const window = new BrowserWindow({ webPreferences: { webSecurity: false }})
  const image = new BrowserWindow({ width: 400, height: 400, parent: window, show: false})
  const settings = new BrowserWindow({ width: 400, height: 400, parent: window, show: false})

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    image.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/image')
    settings.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '/#/settings')
    if (!process.env.IS_TEST) window.webContents.openDevTools()
  } else {
    createProtocol('app')
    //   Load the index.html when not in development
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  image.on('close', (e) => {
    e.preventDefault()
    image.hide()
  })

  settings.on('close', (e) => {
    e.preventDefault()
    settings.hide()
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  imageWindow = image
  settingsWindow = settings

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  mainWindow = createMainWindow()
})

ipcMain.on('toggle-image', (event, arg) => {
  imageWindow.show();
  imageWindow.webContents.send('image', arg);
})

ipcMain.on('toggle-settings', () => {
  settingsWindow.isVisible() ? settingsWindow.hide() : settingsWindow.show()
})
