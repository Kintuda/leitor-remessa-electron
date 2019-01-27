const isBase64 = string => {
    const regex = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$')
    return regex.test(string)
}
module.exports = {
    isBase64
}