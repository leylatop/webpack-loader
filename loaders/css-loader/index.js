const { getImportCode, stringifyRequest, getModuleCode, getExportCode } = require('./utils')

function loader(sourceContent) {
  // 调用this.async()，把同步loader转换为异步loader
  const callback = this.async();

  // 获取 loader 的配置选项
  const options = this.getOptions();
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
  const moduleCode = getModuleCode({ css: sourceContent })
  const exportCode = getExportCode(options)
  callback(null, importCode + moduleCode + exportCode)

}

module.exports = loader;
