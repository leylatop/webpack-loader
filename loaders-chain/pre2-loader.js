function loader(sourceContent) {
  console.log('pre2-loader')
  return sourceContent+'// pre2-loader';
}

loader.pitch = function() {
  console.log('pre2-loader-pitch')
}

module.exports = loader;