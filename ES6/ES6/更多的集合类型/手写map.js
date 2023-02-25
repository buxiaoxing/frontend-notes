class MyMap {
  constructor(iterator = []) {
    if (typeof iterator[Symbol.iterator] !== "function") {
      throw new TypeError(`你提供的${iterator}不是一个可迭代对象`)
    }
    this._data = []
    for (const item of iterator) {
      // item 也得是一个可迭代对象
      if (typeof item[Symbol.iterator] !== "function") {
        throw new TypeError(`你提供的${item}不是一个可迭代的对象`);
      }
      const iterator = item[Symbol.iterator]()
      const key = iterator.next().value
      const value = iterator.next().value
      this.set(key, value)
    }
  }
  set(key, value) {
    // 如果存在 key ，则替换值
    // 如果不存在 key ， 则新增一项
    // 比较方式与Set相同
    const obj = this._getObjt(key)
    if(obj){
      obj.value = value
    }else{
      this._data.push({
        key,
        value
      })
    }
  }

  get(key) {
    // 获得key对应的value
    const item = this._getObjt(key)
    if(item) return item.value
    return undefined
  }
  get size() {
    return this._data.length
  }
  has(key) {
    // 判断某个键是否存在
  }

  delete(key) {
    // 删除指定键
    for (let i = 0; i < this._data.length; i++) {
      const element = this._data[i];
      if(this._isEqual(element.key, key)){
        this._data.splice(i, 1)
        return true
      }
    }
    return false
  }
  clear() {
    // 清空map
    this._data.length = 0
  }
  forEach(callback) {
    // 参数1：每一项的值
    // 参数2：每一项的键
    // 参数3： map本身
    for (const i of this._data) {
      callback(i.value, i.key, this)
    }
  }

  has(key){
    return this._getObjt(key) !== undefined
  }

  *[Symbol.iterator](){
    for (const item of this._data) {
      yield [item.key, item.value]
    }
  }

  _getObjt(key){
    for (const item of this._data) {
      if(this._isEqual(key, item)) {
        return item
      }
    }
  }


  _isEqual(data1, data2){
    if(data1 === 0 && data2 === 0){
      return true
    }
    return Object.is(data1, data2)
  }

}

const map  = new MyMap([[1,2], [3,4]])
console.log(map)
for (const item of map) {
  console.log(item)
}