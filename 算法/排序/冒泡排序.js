
// 冒泡排序
// 每一轮找出剩余队里中最大的数，放在剩余队的最后
// 就像冒泡一样，最大的冒到了最后一位
function bubbleSort(arr){
  for(let i=0; i<arr.length-1; i++){
    for(let j=0; j<arr.length-1-i; j++){
      if(arr[j]>arr[j+1]){
        let tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
      }
    }
  }
  return arr
}

let arr = [3,2,1]
bubbleSort(arr)
console.log(arr)