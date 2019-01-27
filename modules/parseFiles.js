const path = require('path')
const { readFileSync } = require('fs')
module.exports = files =>  files.filter(remessa => path.extname(remessa) === '.rem').map(file=> readFileSync(file, 'latin1'))