ParseError = (err) => {
    const result = {};
    _.forEach(err, (val, key) => {
        result[key] = val.message
    })
    return result
}
module.exports = ParseError;