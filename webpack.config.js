const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolveLoader: {
    // modules: [
    //   path.resolve(__dirname, 'loaders'),
    //   'node_modules'
    // ],
    // alias: {
    //   'babel-loader': path.resolve(__dirname, 'loaders/babel-loader.js')
    // }
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [
      //     {
      //       loader: path.resolve(__dirname, 'loaders/babel-loader.js'),
      //       // loader: 'babel-loader',
      //       options: {
      //         presets: ['@babel/preset-env']
      //       }
      //     }
      //   ]
      // }
      {
        test: /\.css$/,
        use: [
          {
            // loader: 'style-loader',
            loader: path.resolve('loaders/style-loader'),
          },
          {
            // loader: 'css-loader',
            loader: path.resolve('loaders/css-loader'),
            options: {
              esModule: false,
              url: true, // 将value值中的url(./demo.png) 转换为webpack更改后的路径
              import: true, // 将@import(./basic.css) 转换为webpack更改后的路径
              /**
               * 使用@import 引入的文件，比如basic.css，再往后执行1个loader，即logger-loader1
               * 如果设置为2，则basic.css再往后执行2个loader，即logger-loader1和logger-loader2
               * 只会影响到@import引入的文件，不会影响到主文件，如果没有特别设置主文件会执行后面所有的loader
               */
              importLoaders: 1,
              modules: {
                mode: 'local',
                exportOnlyLocals: false // 是否只导出局部变量，默认false，导出全局变量，当设置为true时，会与style-loader冲突
              }
            }
          },
          {
            loader: path.resolve('loaders/logger-loader1'),
          },
          {
            loader: path.resolve('loaders/logger-loader2'),
          }
        ],
        include: path.resolve('src')
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource', // webpack 5 的资源模块，会将图片的文件名改为哈希值，并且将图片打包到dist目录下
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}