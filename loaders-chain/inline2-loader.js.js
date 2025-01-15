function loader(sourceContent) {
  console.log('inline2-loader')
  return sourceContent+'// inline2-loader';
}

loader.pitch = function() {
  console.log('inline2-loader-pitch')
}

module.exports = loader;