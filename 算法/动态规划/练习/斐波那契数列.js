// 0 1 1 2 3 5 8 .... 效率高，几百都能算
function febo(n) {
  if (n <= 0) return -1
  if (n == 1) return 0
  if (n == 2) return 1
  let a = 0
  let b = 1
  let c
  for (let i = 3; i <= n; i++) {
    c = a + b
    a = b
    b = c
  }
  return c
}


// f(n) = f(n-1) + f(n-2) 效率低 50 都算不出来了
function febo2(n){
  if(n<=0) return -1
  if(n==1) return 0
  if(n==2) return 1
  return febo2(n-1) + febo2(n-2)
}
console.log(febo(100))