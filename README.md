# webpack-loader

## webpack.config.js中加载自定义loader的三种方法：
1. 在modules.rules 中配置自定义loader的绝对地址
```
{
  test: /\.js$/,
  use: [
    {
      loader: path.resolve(__dirname, 'loaders/babel-loader.js')
    }
  ]
}
```

2. 在resolveLoader.modules中配置自定义loader的查找顺序，类似于resolve.modules。不同的是resolveLoader 用于查找插件，resolve用于查找模块。
```
resolveLoader: {
  modules: [
    path.resolve(__dirname, 'loaders'),
    'node_modules'
  ]
}
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader' // 会从resolveLoader.modules中查找
        }
      ]
    }
  ]
}
```

3. 在resolveLoader.alias中设置自定义loader的别名，类似于resolve.alias。不同的是resolveLoader.alias用于设置插件的别名，resolve.alias用于设置模块的别名。
```
resolveLoader: {
  alias: {
    'babel-loader': path.resolve(__dirname, 'loaders/babel-loader.js')
  }
}

module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader' // 会使用resolveLoader.alias中定义的babel-loader
        }
      ]
    }
  ]
}
```

## babel-loader 的实现
1. 使用 `babel.getPartialConfig` 获取babel的配置
2. 使用 `babel.transform` 进行代码转换
3. 使用 `this.callback` 进行回调,将返回结果传递给下一个loader
4. 核心调用的是 `@babel/core` 的 `transform` 方法，将预设的配置和options 传递给 `@babel/core` 的 `transform` 方法
   1. `@babel/core` 包含 `@babel/parse`、`@babel/traverse`、`@babel/generator` 等方法，用于解析、转换和生成代码
   2. `@babel/preset-env` 是babel的预设，打包了一系列的插件，用于转换各种语法，常见的有 `@babel/plugin-transform-react-jsx`、`@babel/plugin-transform-arrow-functions` 等。
