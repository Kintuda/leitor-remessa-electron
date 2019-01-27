const { ipcRenderer } = require('electron')
const { readFileSync, existsSync } = require('fs')


const processString = input => {
    if (input && input.length > 238) {
        return sendPayload('payload:text', input)
    }
}

const jsonToHtml = data => {
    let json = JSON.parse(data)
    let html = ''
    for (const field in json) {
        if(!json[field]) continue
        html += `<tr><td>${field}</td><td>${json[field]}</td</tr>`
    }
    let template = `
    <div class="table-responsive">
    <table class="table table-bordered table-hover table-condensed">
    <tr>
        <th>Campo</th>
        <th>Valor</th>
    </tr>
        ${html ? html : ''}
    </table>
    </div>
    `
    // console.log(template);
    return template
}

const verifyContent = path => {
    if (!existsSync(path)) return false
    return readFileSync(path)
}

const sendPayload = (adress, payload) => {
    return ipcRenderer.send(adress, payload)
}

const openFile = e => {
    const adress = 'payload:upload'
    return sendPayload(adress, e)
}

ipcRenderer.on('payload:result', (e, data) => {
    if(data)document.querySelector('#result').innerHTML = jsonToHtml(data)
    
})

ipcRenderer.on('error', (e, data) => {
    alert(`Erro: ${data}`)
})