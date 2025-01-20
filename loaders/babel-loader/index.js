const babel = require('@babel/core');

function loader(sourceContent, inputSourceMap, inputAst) {
  // 正在处理的文件的绝对路径 
  const filename = this.resourcePath;
  // 获取webpack.config.js中的options
  const useOptions = this.getOptions();
  const options = {
    filename,
    inputSourceMap, // 指定输入代码的sourcemap
    sourceMaps: true, // 是否生成source map
    sourceFileName: filename, // 指定编译 后的文件所属的文件名
    ast: true, // 是否生成ast
    ...useOptions
  }

  // 获取babel的配置，从.babelrc中或babel.config.js中获取
  const config = babel.loadPartialConfig(options);
  if(config) {
    const { code, map, ast } = babel.transform(sourceContent, config.options);
    this.callback(null, code, map, ast);
    return code;
  }
  this.callback(null, sourceContent, inputSourceMap, inputAst);
  return sourceContent;
}

module.exports = loader;