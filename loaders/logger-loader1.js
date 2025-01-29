const loader = function(source) { 
  console.log('-------------logger-loader1', this.resourcePath)
  return source
}

module.exports = loader