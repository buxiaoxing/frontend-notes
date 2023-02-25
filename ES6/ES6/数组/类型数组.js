// const arr = new Int32Array(8) // 每一项填充为0
// console.log(arr)
// console.log(arr.byteLength) // 32


const arr = Int8Array.of(-129, 1, 2)
console.log(arr) // [-128, 1, 2] 超出了8位能表示的范围
/**
 * 128转为2进制 01
 */