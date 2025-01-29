const { getImportCode, stringifyRequest, getModuleCode, getExportCode, getPreRequester, combineRequests } = require('./utils')
const postcss = require('postcss')
const postcssUrlParser = require('./plugins/postcss-url-parser')
const postcssImportParser = require('./plugins/postcss-import-parser')

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

  // import插件需要放到imports中的部分
  const importPluginImports = []
  const importPluginApi = []
  if(options.import) {
    plugins.push(postcssImportParser({
      imports: importPluginImports,
      api: importPluginApi,
      loaderContext: this,
      // 根据webpack.config.js中的importLoaders配置，决定@import引入的文件再往后执行几个loader
      urlHandler: url => stringifyRequest(this, combineRequests(getPreRequester(this, options), url))
    }))
  }
  

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
      imports.push(...urlPluginImports, ...importPluginImports)
      const importCode = getImportCode(imports)
      const moduleCode = getModuleCode({ css: result.css }, importPluginApi, urlPluginReplacements)
      const exportCode = getExportCode(options)
      callback(null, importCode + moduleCode + exportCode)
    })
}

module.exports = loader;
