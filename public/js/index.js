const { ipcRenderer } = require('electron')
const { readFileSync, existsSync } = require('fs')


const processString = input => {
    if (input && input.length > 238) {
        return sendPayload('payload:text', input)
    }
}

const createTable = json => {
    let tableRow = ''
    for (const field in json) {
        if (!json[field]) continue
        tableRow += `<tr><td>${field}</td><td>${json[field]}</td</tr>`
    }
    return tableRow
}

const jsonToHtml = data => {
    let json = JSON.parse(data)
    let html = ''
    if(Array.isArray(json)){
        html = json.map(remessaJson => createTable(remessaJson))
    }else{
        html = createTable(json)
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

ipcRenderer.on('text:result', (e, data) => {
    if (data) document.getElementById('resultString').innerHTML = jsonToHtml(data)
})

ipcRenderer.on('file:result', (e, data) => {
    if (data) document.getElementById('resultFile').innerHTML = jsonToHtml(data)
})

ipcRenderer.on('error', (e, data) => {
    alert(`Erro: ${data}`)
})

const changePage = id => {
    let main = document.getElementsByClassName('pane')
    for(let i = 0; i <main.length;i++){
        main[i].style.display = 'none'
    }
    if(id == 'readFile'){
        main['readFile'].style.display = 'block'
        let btt = document.getElementById('readStringLink')
        
    }else{
        main['readString'].style.display = 'block'
        let btt = document.getElementById('readStringLink')
    }
}

