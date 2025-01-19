const { runLoaders } = require('loader-runner');
const path = require('path');
const fs = require('fs');

const entryFile = path.resolve(__dirname, 'src/index.js');
// 内联loader
const request = `inline1-loader!inline2-loader!${entryFile}`;
const rules = [
  {
    test: /\.js$/,
    use: ['normal1-loader', 'normal2-loader']
  },
  {
    test: /\.js$/,
    enforce: 'pre',
    use: ['pre1-loader', 'pre2-loader']
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post1-loader', 'post2-loader']
  }
]

const requestSplit = request.replace(/^-?!+/, '').split('!')
// 截掉最后一个，剩下的就是内联loader
const resource = requestSplit.pop()
// 剩下的就是内联loader
const inlineLoaders = requestSplit
const postLoaders = []
const preLoaders = []
const normalLoaders = []

for (const loader of rules) {
  const { test, enforce, use } = loader
  if(test.test(resource)) {
    if(enforce === 'post') {
      postLoaders.push(...use)
    } else if(enforce === 'pre') {
    preLoaders.push(...use)
    } else {
      normalLoaders.push(...use)
    }
  }
}

// 根据请求的格式，决定loader的执行顺序
let loaders = [];
// noPrePostAutoLoaders	不要前后置和普通 loader,只要内联 loader(也就是禁用所有已配置的loader)
if(request.startsWith('!!')) {
  loaders = [...inlineLoaders]
} 
// noPreAutoLoaders	不要前置和普通 loader
else if (request.startsWith('-!')) { 
  loaders = [...postLoaders, ...inlineLoaders]
} 
// noAutoLoaders	不要普通 loader
else if (request.startsWith('!')) {
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders]
} 
else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders]
}

// 获取loader
function resolveLoader(loader) {
  return path.resolve(__dirname, 'loaders-chain', (loader.loader ? loader.loader : loader) + '.js')
}

runLoaders({
  resource, 
  loaders: loaders.map(resolveLoader),
  context: {
    getCurrentLoader: () => {
      return this.loaders[this.loaderIndex]
    },
    getOptions: () => {
      const loader = this.getCurrentLoader();
			return loader.options;
    }
  },
  readResource: fs.readFile.bind(fs),
}, (err, result) => {
  // console.log(err, result)
})