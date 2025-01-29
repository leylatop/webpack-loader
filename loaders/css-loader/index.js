const { getImportCode, stringifyRequest, getModuleCode, getExportCode } = require('./utils')
const postcss = require('postcss')
function loader(sourceContent) {
  // 获取 loader 的配置选项
  const options = this.getOptions();
  // 调用this.async()，把同步loader转换为异步loader
  const callback = this.async();

  const plugins = []

  postcss(plugins)
    .process(sourceContent)
    .then((result) => {
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
      const moduleCode = getModuleCode({ css: result.css })
      const exportCode = getExportCode(options)
      callback(null, importCode + moduleCode + exportCode)
    })
}

module.exports = loader;
