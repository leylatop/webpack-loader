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
            }
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