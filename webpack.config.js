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
          // {
          //   loader: path.resolve('loaders/style-loader.js'),
          //   options: {
          //     esModule: false
          //   }
          // },
          {
            // loader: 'css-loader',
            loader: path.resolve('loaders/css-loader'),
            options: {
              esModule: false
            }
          }
        ],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}