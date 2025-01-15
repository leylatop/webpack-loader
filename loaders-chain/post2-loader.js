function loader(sourceContent) {
  console.log('post2-loader')
  return sourceContent+'// post2-loader';
}

loader.pitch = function() {
  console.log('post2-loader-pitch')
}

module.exports = loader;