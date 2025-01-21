const { getImportCode, stringifyRequest } = require('./utils')

function loader(sourceContent) {
    // 调用this.async()，把同步loader转换为异步loader
    const callback = this.async();
    const imports = [
        {
            importName: 'cssLoaderApiNoSourceMapImport',
            url: stringifyRequest(this, require.resolve('./runtime/noSourceMap'))
        },
        {
            importName: 'cssLoaderApiImport',
            url: stringifyRequest(this, require.resolve('./runtime/api'))
        }
    ]
    const importCode = getImportCode(imports)
    const moduleCode = ''
    const exportCode = ''
    callback(null, importCode + moduleCode + exportCode)

}

module.exports = loader;
