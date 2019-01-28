const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const { parseFiles, readRemessa, utils } = require('./modules/index.js')

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname)
}

const htmlPath = path.join(__dirname, 'public', 'html', 'index.html')

let mainWindow
const main = () => {
    const config = {
        width: 800,
        heigth: 600,
    }
    mainWindow = new BrowserWindow(config)
    mainWindow.loadFile(htmlPath)
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', main)
const readValue = (e, item) => {
    let data
    data = item
    if (utils.isBase64(item)) {
        data = Buffer.from(item, 'base64').toString()
        console.log(data);
    }
    let result = readRemessa(data)
    mainWindow.webContents.send('text:result', JSON.stringify(result, 2, null))
}

const sendError = error => {
    mainWindow.webContents.send('error', error)
}

const readFile = (e, item) => {
    try {
        let files = dialog.showOpenDialog({ properties: ['multiSelections'] })
        if (files) {
            let fileToProcess = parseFiles(files)
            let data = readRemessa(fileToProcess)
            mainWindow.webContents.send('file:result', JSON.stringify(data, 2, null))
        }
    } catch (error) {
        sendError(error && error.message)

    }
}

ipcMain.on('payload:text', readValue)
ipcMain.on('payload:content', readValue)
ipcMain.on('payload:upload', readFile)