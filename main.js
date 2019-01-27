const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const { readFileSync } = require('fs')
const { parseFiles, readRemessa, utils } = require('./modules/index.js')
require('electron-reload')(__dirname)
const htmlPath = path.join(__dirname, 'public', 'html', 'index.html')

let mainWindow
function main(){
    const config = {
        width: 800,
        heigth: 600,
        backgroundColor: 'black'
        // backgroundColor: '#2D3A4B'
    }
    mainWindow = new BrowserWindow(config)
    mainWindow.loadFile(htmlPath)
}

app.on('ready', main)
function readValue(e, item){
    let data
    data = item
    if(utils.isBase64(item)){
        data = Buffer.from(item,'base64').toString()
    }
    let result = readRemessa(data)
    mainWindow.webContents.send('payload:result', JSON.stringify(result, 2, null))
}

function sendError(error){
    mainWindow.webContents.send('error', error)
}

function readFile(e, item){
    try {
        let files = dialog.showOpenDialog({properties: ['multiSelections']})
        if(files){
            let fileToProcess = parseFiles(files)
            let data = readRemessa(fileToProcess)
            mainWindow.webContents.send('payload:result', data)
        }
    } catch (error) {
        sendError(error)

    }
}
ipcMain.on('payload:text',readValue)
ipcMain.on('payload:content',readValue)
ipcMain.on('payload:upload',readFile)