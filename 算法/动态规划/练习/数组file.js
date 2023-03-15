const result = new Array(3).fill(new Array(3).fill(0)) // fill使用的是同一个引用
result[1][1] = 1

console.log(result)