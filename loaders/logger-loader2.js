const loader = function(source) { 
  console.log('-------------logger-loader2', this.resourcePath)
  return source
}

module.exports = loader