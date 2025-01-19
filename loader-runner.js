const fs = require('fs')

// 根据loader 创造loader对象
function createLoaderObject(loaderPath) {
  // 根据loaderPath，获取loader的主函数函数
  const normal = require(loaderPath)
  const pitch = loader.pitch
  const raw = loader.raw || true

  return {
    path: loaderPath,
    normal, // loader的普通函数
    pitch, // loader 的pitch函数
    normalExecuted: false, // loader的普通函数是否已经执行
    pitchExecuted: false, // loader的pitch函数是否已经执行
    data: {}, // 每个loader都有自己的data对象，可以保存自定义数据，可以赋值取值；比如在pitch中赋值，在normal中取值
    raw // 决定是字符串还是buffer，在webpack中，一切皆模块，这些文件可能是文本js，也可能是二进制的图片/字体
  }
}

function iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback) {
  const currentLoader = loaderContext.loaders[loaderContext.loaderIndex]

  if(currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback)
  }
  const fn = currentLoader.pitch
  // 标识已经执行过这个loader了
  currentLoader.pitchExecuted = true

  // 如果当前loader不存在的话，接着执行下一个loader的pitch
  if(!fn) {
    return iteratePitchingLoaders(processOptions, loaderContext, pitchingCallback)
  }

  runSyncOrAsync(fn, loaderContext, [
    loaderContext.remainingRequest,
    loaderContext.previousRequest,
    loaderContext.data
  ], (err, ...args) => {

  })
}

function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  callback(null, result)
  // 此变量标记当前函数执行是同步还是异步，默认是同步
  let isSync = true
  loaderContext.callback = (err, ...args) => {
    runCallback(err, ...args)
  }
  /**
   * 在loader或loader.pitch 中调用此方法会把loader执行从同步变成异步
   * 1. 将 isSync 设置为false
   * 2. 将 loaderContext.callback 返回
   * 3. 在loader或 loader.pitch 异步执行完毕后再手动执行 loaderContext.callback 方法
   */
  loaderContext.async = () => {
    isSync = false
    return loaderContext.callback
  }
  // loader中的this指向loaderContext
  // 同步时，可以将loader或loader.pitch的返回值传给下一个loader
  const result = fn.apply(loaderContext, args)
  if(isSync) {
    runCallback(null, result)
  }
}

function runLoaders(options, finalCallback) {
  const {
    resource, // 源文件
    loaders = [], // loaders的绝对路径
    context = {},
    readResource = fs.readFile.bind(fs)
  } = options
  // 整个run过程中的上下文
  let loaderContext = context
  // 根据loader的创建loader
  let loaderObjects = loaders.map(createLoaderObject)

  // 把传入的值赋给上下文
  loaderContext.resourcePath = resource
  loaderContext.readResource = readResource
  loaderContext.loaders = loaderObjects
  loaderContext.loaderIndex = 0 // 指针，执行到哪个loader了
  loaderContext.callback = null // 调用此方法表示结束当前loader，把结果传给下一个loader
  loaderContext.async = null // 把loader执行，从同步变成异步，loader默认是同步的

  /**
   * 为啥要使用 defineProperty 定义属性，而不是直接为loaderContext赋值？
   * 因为使用 defineProperty 定义的属性，获取值时是【动态变化】的，每次取值需要根据loaderContext.loaderIndex动态计算获取最新值
   */
  // 定义一个内联loader
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext
        .loaders.map(loader => loader.path)
        .contact(resource)
        .join('!')
    }
  })

  // 剩下的request（不包括当前loader）
  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext
        .loaders.slice(loaderContext.loaderIndex + 1) // 不包括当前的
        .map(loader => loader.path)
        .contact(resource)
        .join('!')
    }
  })

  // 当前+剩下的request（包括当前loader）
  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext
        .loaders.slice(loaderContext.loaderIndex)
        .map(loader => loader.path)
        .contact(resource)
        .join('!')
    }
  })

  // 前面的request
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext
        .loaders.slice(0, loaderContext.loaderIndex)
        .map(loader => loader.path)
        .contact(resource)
        .join('!')
    }
  })

  // 当前执行到的loader的data
  Object.defineProperty(loaderContext, 'data', {
    get() {
      return loaderContext
        .loaders[loaderContext.loaderIndex].data
    }
  })
  // 处理的选项
  let processOptions = {
    resourceBuffer: null, // 读取到的源文件的Buffer内容，要加工的内容，原始模块的原始内容
    readResource
  }

  // 开始迭代pitch
  iteratePitchingLoaders(
    processOptions,
    loaderContext,
    (err, result) => {
      finalCallback(err, {
        result,
        resourceBuffer: processOptions.resourceBuffer
      })
    }
  );
}

export {
  runLoaders
}