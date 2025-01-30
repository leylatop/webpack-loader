// const sum = (a, b) => {
//   return a + b;
// };

// console.log(sum(1, 2));

// const indexCss = require("./index.css");
// console.log(indexCss);

const moduleCss = require("./module.css");
console.log(moduleCss);

const div = document.createElement('div')
div.className = moduleCss.locals.background
document.body.appendChild(div)
