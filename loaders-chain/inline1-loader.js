function loader(sourceContent) {
  console.log('inline1-loader')
  return sourceContent+'// inline1-loader';
}

loader.pitch = function() {
  console.log('inline1-loader-pitch')
}

module.exports = loader;