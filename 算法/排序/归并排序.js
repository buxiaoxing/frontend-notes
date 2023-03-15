// 将一个数组递归均分为两个数组，再将两个数组按序归并为一个数组

function mergeSort(arr, start, end){
  let middle = Math.floor((start+end)/2)
  if(start < end){
    mergeSort(arr, start, middle)
    mergeSort(arr, middle+1, end)
    merge(arr, start, middle, end)
  }
}

function merge(arr, start, middle, end){
  const tmp = []
  let i=start
  let j=middle+1
  while(i<=middle && j<=end){
    if(arr[i]<arr[j]){
      tmp.push(arr[i++])
    }else{
      tmp.push(arr[j++])
    }
  }
  while(i<=middle){
    tmp.push(arr[i++])
  }
  while(j<=end){
    tmp.push(arr[j++])
  }
  for(let k=0; k<tmp.length; k++){
    arr[start+k] = tmp[k]
  }
}

let arr = [5,4,3,2,1]
mergeSort(arr, 0 ,arr.length-1)
console.log(arr)