const valueParser = require('postcss-value-parser')

function parseNode(atRule) {
  const parsedValue = valueParser(atRule.params)
  return {
    atRule,
    url: parsedValue.nodes[0].value
  }
}
const plugin = ({ imports, api, loaderContext, urlHandler }) => {
  return {
    postcssPlugin: 'postcss-import-parser',
    prepare() {
      // 存储解析@import的规则
      const parsedAtRules = [];
      return {
        AtRule: {
          import(atRule) {
            const parsedAtRule = parseNode(atRule)
            parsedAtRules.push(parsedAtRule)
          }
        },
        async OnceExit() {
          if(parsedAtRules.length === 0) return

          // 使用 webpack 的解析器来解析 URL
          const resolver = loaderContext.getResolve()

          for(let i=0; i<parsedAtRules.length; i++) {
            const { atRule, url } = parsedAtRules[i]

            // 删除原来的@import
            atRule.remove()

            // 使用 webpack 的解析器来解析 URL
            const resolvedUrl = await resolver(loaderContext.context, "./" + url)
            const importName = `cssLoaderAtRuleImport_${i}`
            api.push({importName, url})
            imports.push({
              type: 'rule_import',
              importName,
              url: urlHandler(resolvedUrl)
            })
          }
        }
      }
    }
  }
}

plugin.postcss = true
module.exports = plugin