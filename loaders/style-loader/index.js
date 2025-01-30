// 定义一个函数，用于将请求字符串转换为相对于 loaderContext.context 的路径
function stringifyRequest(loaderContext, request) {
  return JSON.stringify(loaderContext.utils.contextify(loaderContext.context, request));
}

function loader(sourceContent) {
  console.log(sourceContent);
}

// 定义 style-loader 的 pitch 方法，用于处理剩余请求
// 什么情况下需要配置pitch方法？
// 当需要处理剩余请求时，且需要使用剩余请求的返回值时，需要配置pitch方法
loader.pitch = function (remainingRequest) {
  const contentCode = `

    // 通过require 获取css-loader的返回值，!!且不再执行webpack.config.js中配置的css-loader
    const content = require("!!"+${stringifyRequest(this, `${remainingRequest}`)});

    const style = document.createElement('style');

    style.innerHTML = (content.default || content).toString();

    document.head.appendChild(style);

    module.exports = content
  `

  return contentCode
}

module.exports = loader;

