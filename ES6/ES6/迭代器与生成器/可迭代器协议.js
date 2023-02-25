/**
 * 这就是一个可迭代对象 
 */
var obj = {
  a: 1,
  b: 2,
  [Symbol.iterator](){
    let i = 0
    let keys = Object.keys(this)
    return {
      next: ()=>{
        let result = {
          value: {
            propName: keys[i],
            propValue: this[keys[i]]
          },
          done: i>=keys.length
        }
        i++
        return result
      }
    }
  }
}
for (const item of obj) {
  console.log(item)
}

/**
 * 判断一个对象是否是可迭代对象
 */
// var arr = [1,3,4]
// const iterator = arr[Symbol.iterator]() //得到一个可迭代对象
// let result = iterator.next()
// // 迭代
// while(!result.done){
//   console.log(result.value)
//   result = iterator.next()
// }
