const { ipcRenderer } = require('electron')
const  { readFileSync, existsSync }= require('fs') 


const verifyContent = path => {
    if(!existsSync(path)) return false
    return readFileSync(path)
}

const sendPayload = (adress, payload) =>{
    return ipcRenderer.send(adress, payload)
}

const isBase64 = string => {
    const regex = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$')
    return regex.test(string)
}

const openFile = e =>{
    const adress = 'payload:upload'
    return sendPayload(adress, e)
}

ipcRenderer.on('payload:result',(e,data)=> {
    document.querySelector('#resultado').value = JSON.stringify(data, 2 ,null)
})

const onInputRemessa = e =>{
    const adress = 'payload:send'
    if(e.length > 1){
        console.log(e);
    }
}