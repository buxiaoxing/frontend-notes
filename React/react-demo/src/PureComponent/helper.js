/**
 * 对象浅比较，只比较第一层
 * @param {Object} obj1 
 * @param {Object} obj2 
 * @returns 
 */
export function isEqual(obj1, obj2) {
  for (const prop in obj1) {
    if (!Object.is(obj1[prop], obj2[prop])) {
      return false
    }

  }
  return true
}