module.exports = function (cssWithMappingToString) {
    const list = []
    list.toString = function toString() {
        return this.map(item => {
            let content = ""
            content += cssWithMappingToString(item)
            return content
        }).join('\r\n')
    }
    return list
}