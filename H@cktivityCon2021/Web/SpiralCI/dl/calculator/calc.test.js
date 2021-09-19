calc = require("calc_gl2xiahl1g")

console.log("Testing add function")
if (calc.add(1, 2) !== 3) {
  process.exit(1)
}

console.log("Testing subtract function")
if (calc.sub(1, 2) !== -1) {
  process.exit(1)
}

console.log("Testing multiply function")
if (calc.mul(1, 2) !== 2) {
  process.exit(1)
}

console.log("Testing divide function")
if (calc.div(1, 2) !== 0.5) {
  process.exit(1)
}

console.log("All tests passed")
