calc = require("calc_gl2xiahl1g")
const prompt = require("prompt-sync")({ sigint: true })

const operation = prompt("Choose your operation (+, -, *, /):")

const num1 = Number(prompt("Enter operand 1: "))
const num2 = Number(prompt("Enter operand 2: "))

console.log(`The result of ${num1} ${operation} ${num2} is:`)

switch (operation) {
  case "+":
    console.log(calc.add(num1, num2))
    break
  case "-":
    console.log(calc.sub(num1, num2))
    break
  case "*":
    console.log(calc.mul(num1, num2))
    break
  case "/":
    console.log(calc.div(num1, num2))
    break
  default:
    console.log(`Operation not allowed`)
}
