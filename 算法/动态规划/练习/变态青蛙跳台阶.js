// 一次可以跳一级台阶，二级台阶，n级台阶
// 问这只青蛙跳上 n 级台阶有多少种方法

// f(n) = f(n-1)+f(n-2)+f(n-3)+f(n-4) + ... + f(2) + f(1) + f(0)
function jump(n){
  if(n<=0) return -1
  if(n==1) return 1
  if(n==2) return 2
  let result = 0
  for(let i=1; i<n; i++){
    result += jump(n-i)
  }
  result += 1
  return result
}

function jump2(n){
  if(n<=0) return -1
  if(n==1) return 1
  if(n==2) return 2
  let arr = [1,2]
  for(let i=3; i<=n; i++){
    let sum = arr.reduce((a,b)=> a+b) + 1
    arr.push(sum)
  }
  return arr[n-1]
}

console.log(jump2(50))

