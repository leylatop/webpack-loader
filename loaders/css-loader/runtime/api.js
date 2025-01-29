module.exports = function (cssWithMappingToString) {
  const list = []
  // 为 list 定义一个 i 方法，用于将传入的模块数组添加到 list 中
  list.i = function i(modules) {
    for (var k = 0; k < modules.length; k++) {
      // 将每个模块转换为数组，以确保它们是可迭代的
      var item = [].concat(modules[k]);
      // 将转换后的模块添加到 list 中
      list.push(item);
    }
  };
  list.toString = function toString() {
    return this.map(item => {
      let content = ""
      content += cssWithMappingToString(item)
      return content
    }).join('\r\n')
  }
  return list
}