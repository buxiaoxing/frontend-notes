function foo(n, arr){
  let m = arr.length
  let dp = new Array(n+1).fill().map(()=>new Array(m+1))
  dp[0].fill(0)
  for(let i=0 ;i<=n; i++){
    dp[i][0] = 0
  }
  for(let i=1; i<=n; i++){
    for(let j=1; j<=m; j++){
      dp[i][j] = i>=j?Math.max(dp[i-j][j]+arr[j-1], dp[i][j-1]):dp[i][j-1]
    }
  }
  return dp[n][m]
}

let arr = [10 ,20 ,30 ,40 ,60, 60, 70, 80, 90, 150]
console.log(foo(15,arr))