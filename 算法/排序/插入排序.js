// 每次遍历，保证前面的队列是有序的
function insertSort(arr){
  const len = arr.length
  for(let i=1; i<len; i++){
    for(let j=i-1; j>=0; j--){
      if(arr[j]>arr[j+1]){
        let tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
      }
    }
  }
}

/**
 * 选择排序每次都需要遍历前面所有的队列，但因为前面序列本身就是有序的，所以当前数大于前面一个数时，则不需要向前遍历，故可以小小优化一下
 * @param {*} arr 
 */
function insertSort2(arr){
  const len = arr.length
  for(let i=1; i<len; i++){
    if(arr[i]<arr[i-1]){
      let tmp = arr[i]
      let j
      for(j=i-1; j>=0&&arr[j]>tmp; j--){ // 当前数大于前一个数时，则不需要遍历。tmp>arr[j] 时不需要再往前遍历了
        arr[j+1] = arr[j]
      }
      arr[j+1] = tmp
    }
  }
}

let arr = [3,2,4,2,1,5]
insertSort(arr)
console.log(arr)