// 确认一个基准数，把比基准数大的放在右边，小的放在左边，递归下去实现排序
function quickSort(arr, start, end) {
  if (start < end) {
    let stard = arr[start]
    let low = start
    let high = end
    while (low < high) {
      while (low < high && arr[high] >= stard) {
        high--
      }
      arr[low] = arr[high]
      while (low < high && arr[low] <= stard) {
        low++
      }
      arr[high] = arr[low]
    }
    arr[low] = stard

    quickSort(arr, start, low)
    quickSort(arr, low + 1, end)
  }

}

const arr = [15, 4, 3, 2, 1]
quickSort(arr, 0, arr.length-1)
console.log(arr)