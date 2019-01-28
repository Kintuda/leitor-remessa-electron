const OS = require('os')
const splitSegmentos = remessa => remessa.replace(/[^\x00-\x7F]/g, '').split(OS.EOL)

const defineLayout = (position, bank) => {
    switch (position) {
        case 240:
        case 241:
            return require('../templates/240')
        case 400:
        case 401:
            return require(`../templates/${bank}`)
        default:
            throw new Error('Arquivo inválido.')
    }
}

const separateSegments400 = segmentos => {
    return {
        'HEADER': segmentos[0],
        'DETALHE': segmentos[1],
        'P': segmentos[2],
        'Q': segmentos[3],
        'R': segmentos[4] ? segmentos[4] : null,
        'S': segmentos[5] ? segmentos[5] : null
    }
}

const separateSegments240 = (segmentos, bancos) => {
    let obj = {}
    switch(bancos){
        case '001':
            obj = {
                'HEADER': segmentos[0],
                'DETALHE': segmentos[1],
                'Tipo5': segmentos[2] || null,
            }
            break
        case '748':
            obj = {
                "HEADER": segmentos[0],
                'DETALHE': segmentos[1]
            }
            break
        default:
            throw new Error('Banco não implementado ainda.')
    }
    return obj
}

const createResult = (input, template, cnab) => {
    let json = {"CNAB": cnab}
    for (let field in input) {
        for (let data in template[field]) {
            let segment = input[field]
            let info = segment.substring(template[field][data][0] - 1, template[field][data][1])
            json[data] = info
        }
    }
    return json
}
const readMultipleFiles = files => files.map(remessa => readRemessa(remessa))

const readRemessa = remessa => {
    let segmentos = splitSegmentos(remessa)
    let template
    let bank
    let layout
    let cnab
    console.log(segmentos[0].length);
    if ([240,241].includes(segmentos[0].length)) {
        template = separateSegments240(segmentos)
        bank = segmentos[0].substring(0, 3)
        cnab = 240
        console.log(bank);
        layout = defineLayout(cnab, bank)
    } else if([400,401].includes(segmentos[0].length)) {
        console.log('teste');
        bank = segmentos[0].substring(76, 79)
        console.log(bank);
        cnab = 400
        template = separateSegments400(segmentos,bank)
        layout = defineLayout(cnab, bank)
    }else{
        throw new Error('Arquivo inválido.')
    }
    return createResult(template, layout, cnab)
   
}

module.exports = file => {
    if(Array.isArray(file)){
        return readMultipleFiles(file)
    }
    return readRemessa(file)
}
