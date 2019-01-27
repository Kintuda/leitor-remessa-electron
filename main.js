const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const { readFileSync } = require('fs')
const { parseFiles, readRemessa } = require('./modules/index.js')

const htmlPath = path.join(__dirname, 'public', 'html', 'index.html')
console.log(htmlPath)


let mainWindow
function main(){
    const config = {
        width: 800,
        heigth: 600,
        backgroundColor: '#D6D8DC',
    }
    mainWindow = new BrowserWindow(config)
    mainWindow.loadFile(htmlPath)
}

app.on('ready', main)
function readValue(e, item){
    
}

function readFile(e, item){
    try {
        let files = dialog.showOpenDialog({properties: ['multiSelections']})
        let fileToProcess = parseFiles(files)
        let data = readRemessa(fileToProcess)
        console.log(data);
        mainWindow.webContents.send('payload:result', data)
    } catch (error) {
        console.log(error);        
    }
}

ipcMain.on('payload:content',readValue)
ipcMain.on('payload:upload',readFile)