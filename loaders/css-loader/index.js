const { getImportCode, stringifyRequest, getModuleCode, getExportCode } = require('./utils')
const postcss = require('postcss')
const postcssUrlParser = require('./plugins/postcss-url-parser')
function loader(sourceContent) {
  // 获取 loader 的配置选项
  const options = this.getOptions();
  // 调用this.async()，把同步loader转换为异步loader
  const callback = this.async();

  const plugins = []
  // urlParser中需要放到imports中的部分
  const urlPluginImports = []
  // urlParser中需要在getModuleCode中替换的url
  const urlPluginReplacements = []
  plugins.push(postcssUrlParser({
    imports: urlPluginImports,
    replacements: urlPluginReplacements,
    urlHandler: url=>stringifyRequest(this,url)
  }))
  

  postcss(plugins)
    .process(sourceContent, { from: this.resourcePath, to: this.resourcePath })
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
      imports.push(...urlPluginImports)
      const importCode = getImportCode(imports)
      const moduleCode = getModuleCode({ css: result.css }, urlPluginReplacements)
      const exportCode = getExportCode(options)
      callback(null, importCode + moduleCode + exportCode)
    })
}

module.exports = loader;
