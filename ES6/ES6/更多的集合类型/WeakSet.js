let obj = {
  name: "zs",
  age: 12
}
const set = new WeakSet()
set.add(obj)
obj = null
console.log(set)