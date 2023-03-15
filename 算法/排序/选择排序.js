// 每一轮找出剩余队列的最小值，放在前面
function selectSort(arr){
  const len = arr.length
  for(let i=0; i<len-1; i++){
    let min = i
    for(let j=i+1; j<len; j++){
      if(arr[j]<arr[min]){
        min = j
      }
    }

    if(min !== i){
      let tmp = arr[min]
      arr[min] = arr[i]
      arr[i] = tmp
    }
  }
}

let arr = [5,4,3,2,1]
selectSort(arr)
console.log(arr)