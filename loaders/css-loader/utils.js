const postcssModulesScope = require("../../postcss-modules-scope");

function getImportCode(imports, options) {
  let code = ''
  // 遍历imports，生成import代码
  for (const item of imports) {
    const { importName, url } = item
    code += `var ${importName} = require(${url});\n`
  }
  return code
}

/**
 * 定义一个函数，用于生成模块代码
 * @param {*} result 
 * @returns 
 */
function getModuleCode(result, api, replacements) {
  let code = JSON.stringify(result.css)
  let beforeCode = `var cssLoaderExport = cssLoaderApiImport(cssLoaderApiNoSourceMapImport); \n`
  for (let item of api) {
    beforeCode += `cssLoaderExport.i(${item.importName});\n`
  }
  for (let item of replacements) {
    // importName 是url方法中的路径
    // replacementName 是替换后的路径
    const { importName, replacementName } = item
    beforeCode += `var ${replacementName} = cssLoaderGetUrlImport(${importName}); \n`

    code = code.replace(
      new RegExp(replacementName, 'g'),
      () => `" + ${replacementName} + "`
    )
  }
  return `${beforeCode}cssLoaderExport.push([module.id, ${code} ]); \n`
}

/**
 * 定义一个函数，用于生成导出代码
 * @param {*} options 
 */
function getExportCode(exports, options) {
  let code = ''
  let localsCode = ''
  function addExportToLocalsCode(name, value) {
    if (localsCode) {
      localsCode += `,\n`
    }
    localsCode += `\t${JSON.stringify(name)}: ${JSON.stringify(value)}`
  }
  for (const { name, value } of exports) {
    addExportToLocalsCode(name, value);
  }
  if (options.modules.exportOnlyLocals) {
    code += `${options.esModule ? "export default" : "module.exports ="} {\n${localsCode}\n};\n`;
    return code;
  }
  code += `cssLoaderExport.locals = {${`\n${localsCode}\n`}};\n`
  let finalExport = 'cssLoaderExport'
  if (options.esModule) {
    code += `export default ${finalExport} \n;`
  } else {
    code += `module.exports = ${finalExport} \n;`
  }
  return code
}



/**
 * 用于把请求字符串，转换成相对于正在转换的模块的相对路径
 * @param {*} loaderContext 
 * @param {*} request 
 * @returns 
 */
function stringifyRequest(loaderContext, request) {
  // webpack5中的方法，用于计算相对路径
  // loaderContext.context 是正在转换的模块的绝对路径
  // request 是要转换的路径
  // 要返回一个字符串，所以需要JSON.stringify
  return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request))
}


function getPreRequester(loaderContext, options) {
  const { loaders, loaderIndex } = loaderContext
  const { importLoaders } = options

  // 除了当前loader，再往前执行importLoaders个loader
  const loadersRequest = loaders.slice(loaderIndex, loaderIndex + 1 + importLoaders).map(x => x.request).join('!')
  return "-!" + loadersRequest + "!"
}

function combineRequests(preRequest, url) {
  return preRequest + url
}


function shouldUseModulesPlugins(options) {
  if (typeof options.modules === "boolean" && options.modules === false) {
    return false;
  }
  return true
}

function shouldUseIcssPlugin(options) {
  return Boolean(options.modules)
}

function getModulesPlugins(loaderContext) {
  const plugins = [
    postcssModulesScope({
      loaderContext
    })
  ]
  return plugins
}


exports.getImportCode = getImportCode
exports.getModuleCode = getModuleCode
exports.getExportCode = getExportCode
exports.stringifyRequest = stringifyRequest
exports.combineRequests = combineRequests
exports.getPreRequester = getPreRequester
exports.shouldUseModulesPlugins = shouldUseModulesPlugins
exports.getModulesPlugins = getModulesPlugins
exports.shouldUseIcssPlugin = shouldUseIcssPlugin