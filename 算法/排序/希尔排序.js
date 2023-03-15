// 希尔排序是插入排序的优化，插入排序当一个很小的数在右边的时候，因为插入排序只能交换相邻的数据，则需要很多次交换操作才能让前面序列保持有序
// 希尔排序加入了交换步长，先将队列排至大致有序，极大提高了排序效率
function shellSort(arr){
  // 遍历所有步长
  const len = arr.length
  for(let d=parseInt(len/2); d>0; d=parseInt(d/2)){
    for(let i=d; i<len; i++){
      for(let j=i-d; j>=0; j-=d){
        if(arr[j]>arr[j+d]){
          let tmp = arr[j]
          arr[j] = arr[j+d]
          arr[j+d] = tmp
        }
      }
    }
  }
}

let arr = [4,3,2,1]
shellSort(arr)
console.log(arr)