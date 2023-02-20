// function test(a = b, b) {
//   console.log(a, b);
// }

// test(undefined, 2);

function sum(a, b = 1, c = 2) {
  return a + b + c;
}

console.log(sum(10, undefined, undefined))
console.log(sum(11))
console.log(sum(1, undefined, 5))