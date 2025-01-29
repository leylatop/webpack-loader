const valueParser = require('postcss-value-parser');
const needParseDeclaration = /(?:url)\(/i;
const isUrlFunc = /url/i;

function parseDeclaration(declaration) {
  if(!needParseDeclaration.test(declaration.value)) return []

  // 使用valueParser解析 "url('./demo.png')"
  const parsedValue = valueParser(declaration.value)

  // 创建一个空数组，用于存储解析出来的url
  const urls = []
  parsedValue.walk((node) => {
    if(node.type !== 'function') return
    if(isUrlFunc.test(node.value)) {
      const {nodes} = node
      const url = valueParser.stringify(nodes)

      urls.push({
        declaration,
        node: nodes[0],
        url,
        parsedValue
      })
    }
  })
  return urls
}
const plugin = ({ imports, replacements, urlHandler }) => {
  return {
    postcssPlugin: 'postcss-url-parser',
    prepare() {
      // 定义一个空数组，用于收集url
      const parsedDeclarations = []
      return {
        // 处理每一个声明，即css中的每一个属性和值
        Declaration(declaration) {
          const parsedURLs = parseDeclaration(declaration)
          parsedDeclarations.push(...parsedURLs)
        },
        //定义一个异步方法，用于处理 PostCSS 会话结束时的逻辑
        OnceExit() {
          if(parsedDeclarations.length === 0) return

          // 将 getUrl.js 的导入信息添加到 imports 数组中
          imports.push({
            type: 'get_url_import',
            importName: 'cssLoaderGetUrlImport',
            url: urlHandler(require.resolve('../runtime/getUrl.js'))
          })

          for(let i = 0; i < parsedDeclarations.length; i++) {
            const item = parsedDeclarations[i]
            const {declaration, node, url, parsedValue} = item

            const importName = `cssLoaderUrlImport_${i}`
            // 引入图片原地址
            imports.push({
              type: 'url',
              importName,
              url,
            })

            const replacementName = `cssLoaderUrlReplacement_${i}`
            replacements.push({
              replacementName, // 替换后的名称
              importName // 引入的名称
            })

            // 把节点的值，即url方法中的路径，替换为replacementName
            node.value = replacementName

            declaration.value = parsedValue.toString()
          }
        }
      }
    }
    
  }
}

plugin.postcss = true;
module.exports = plugin;