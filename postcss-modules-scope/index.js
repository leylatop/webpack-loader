const selectorParser = require('postcss-selector-parser')
const crypto = require("crypto");

// 定义生成范围限定名称的函数，接收类名和加载器作为上下文
function generateScopedName(name, loaderContext) {
  const random = Math.random().toString(36).substring(2, 15)
  return `_${random}__${name}`

  // 使用 MD4 哈希算法创建一个新哈希对象
  const hash = crypto.createHash('md4')
  // 使用 loader 上下文的资源路径更新哈希
  hash.update(loaderContext.resourcePath);
  // 返回生成的范围限定名称，包含哈希值和原始名称
  return `_${hash.digest('hex')}__${name}`;
}
const plugin = function({ loaderContext }) {
  return {
    postcssPlugin: 'postcss-modules-scope',
    Once(root, { rule }) {
      // 创建一个空的导出对象
      const exports = Object.create(null);
      // 定义导出范围限定名称的函数
      function exportScopedName(name) {
        const scopedName = generateScopedName(name, loaderContext)
        // 将生成的名称添加到导出对象中
        exports[name] = scopedName

        return scopedName
      }

      // 根据节点类型处理节点，返回处理后的节点
      function localizeNode(node) {
        switch(node.type) {
          case 'selector':
            node.nodes = node.map(localizeNode);
            return node;
          case 'class':
            // 将class替换为带hash的局部变量
            return selectorParser.className({
              value: exportScopedName(node.value)
          });
        }
      }
  
      // 递归选择器的ast
      function traverseNode(node) {
        // 如果递归到的是root或者selector，则继续递归
        if(node.type === 'root' || node.type === 'selector') {
          node.each(traverseNode)
        }

        if(node.type === 'pseudo' && node.value === ':local') {
          const selector = localizeNode(node.first)
          node.replaceWith(selector)
        }

        return node
      }
      root.walkRules((rule) => {
        // 只获取选择器
        const parsedSelector = selectorParser().astSync(rule)
        // 遍历选择器，替换为局部变量
        rule.selector = traverseNode(parsedSelector.clone()).toString()
      })

      const exportedNames = Object.keys(exports)

      // 向css中添加:export规则，导出局部变量
      if(exportedNames.length > 0) {
        const exportRule = rule({
          selector: ':export'
        })
        exportedNames.forEach((exportedName) => {
          exportRule.append({
            prop: exportedName,
            value: exports[exportedName],
            raws: {
              before: '\n',
              after: '\n'
            }
          })
        })
        root.append(exportRule)
      }
    }
  }
}

plugin.postcss = true

module.exports = plugin