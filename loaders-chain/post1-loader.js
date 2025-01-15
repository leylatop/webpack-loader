function loader(sourceContent) {
  console.log('post1-loader')
  return sourceContent+'// post1-loader';
}

loader.pitch = function() {
  console.log('post1-loader-pitch')
}

module.exports = loader;