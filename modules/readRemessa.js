const OS = require('os')
const splitSegmentos = remessa => remessa.replace(/[^\x00-\x7F]/g, '').split(OS.EOL)
const templates = require('../templates/240')

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
        'TAIL': segmentos[1],
        'P': segmentos[2],
        'Q': segmentos[3],
        'R': segmentos[4] ? segmentos[4] : null,
        'S': segmentos[5] ? segmentos[5] : null
    }
}

const separateSegments240 = segmentos => {
    return {
        'HEADER': segmentos[0],
        'TAIL': segmentos[1],
        'P': segmentos[2],
        'Q': segmentos[3],
        'R': segmentos[4] ? segmentos[4] : null,
        'S': segmentos[5] ? segmentos[5] : null
    }
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
const readMultipleFiles = files =>
    files.map(remessa => {
        readRemessa(remessa)
    })

const readRemessa = remessa => {
    let segmentos = splitSegmentos(remessa)
    let template
    let bank
    let layout
    let cnab
    console.log(segmentos);
    if (segmentos[0].length === (240 || 241)) {
        template = separateSegments240(segmentos)
        bank = segmentos[0].substring(0, 3)
        console.log(bank);
        cnab = 240
        layout = defineLayout(cnab, bank)
    } else {
        bank = segmentos[0].substring(76, 79)
        cnab = 400
        template = separateSegments400(segmentos)
        layout = defineLayout(cnab, bank)
    }
    let result = createResult(template, layout, cnab)
    return result
}

module.exports = file => {
    if(Array.isArray(file)){
        return readMultipleFiles(file)
    }
    return readRemessa(file)
}
