function loader(sourceContent) {
  console.log('pre1-loader')
  return sourceContent+'// pre1-loader';
}

loader.pitch = function() {
  console.log('pre1-loader-pitch')
}

module.exports = loader;