class MySet{
  constructor(iterator = []){
    if(typeof iterator[Symbol.iterator] !== "function"){
      throw new TypeError(`你提供的${iterator}不是一个可迭代对象`)
    }
    this._datas = []
    for (const i of iterator) {
      this.add(i)
    }
  }

  add(data){
    if(!this.has(data)){
      this._datas.push(data)
    }
  }
  has(data){
    for (const i of this._datas) {
      if(this._isEqual(data, i)) return true
    }
    return false
  }
  get size(){
    return this._datas.length
  }

  delete(data){
    for (let i = 0; i < this._datas.length; i++) {
      const element = this._datas[i];
      if(this._isEqual(data, element)){
        this._datas.splice(i, 1)
        return true
      }
    }
    return false
  }

  clear(){
    this._datas.length = 0
  }

  forEach(callback){
    for (const i of this._datas) {
      callback(i, i, this)
    }
  }

  _isEqual(data1, data2){
    if(data1 === 0 && data2 === 0){
      return true
    }
    return Object.is(data1, data2)
  }

  *[Symbol.iterator](){
    for (const i of this._datas) {
      yield i
    }
  }
}

const arr = [1,2,3,3]
const set = new MySet(arr)
console.log(set)
set.clear()
console.log(set)
set.add(1)
set.add(1)
console.log(set)