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