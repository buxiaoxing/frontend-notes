// const syb1 = Symbol();
// const syb2 = Symbol("abc");

// console.log(syb1, syb2);


// const syb1 = Symbol("这是一个符号属性")

// const user = {
//   a: 1,
//   [syb1]: 2
// }
// console.log(user)

const SymbolFor = (()=>{
  const global = {}
  return function(desc){
    if(!global[desc]){
      global[desc] = Symbol(desc)
    }
    return global[desc]
  }
})()