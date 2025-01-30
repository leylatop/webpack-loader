var icssUtils = require("icss-utils");

const plugin = function(options = {}) {
  return {
    postcssPlugin: 'postcss-icss-parser',
    // 在postcss处理完css后，执行OnceExit
    async OnceExit(root) {
      // 提取css中的icss
      const { icssExports } = icssUtils.extractICSS(root)

      for (const name of Object.keys(icssExports)) {
        const value = icssExports[name]
        // 将提取的icss添加到options.exports中，此行为会将:export 代码从css中移除
        options.exports.push({ name, value })
      }
    }
  }
}

plugin.postcss = true

module.exports = plugin