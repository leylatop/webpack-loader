function loader(sourceContent) {
  console.log('normal2-loader')
  return sourceContent+'// normal2-loader';
}

loader.pitch = function() {
  console.log('normal2-loader-pitch')
}

module.exports = loader;