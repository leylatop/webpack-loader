function loader(sourceContent) {
  console.log('normal1-loader')
  return sourceContent+'// normal1-loader';
}

loader.pitch = function() {
  console.log('normal1-loader-pitch')
}

module.exports = loader;