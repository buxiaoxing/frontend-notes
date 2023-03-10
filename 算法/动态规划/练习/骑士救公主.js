// 输入多少行格子
// 输入每行格子的HP值


function savePrincess(arr){
  const row = arr.length
  const col = arr[0].length
  const dp = new Array(row+1).fill().map(()=>new Array(col+1).fill(Infinity))
  dp[1][0] = 1
  for(let i=1; i<=row; i++){
    for(let j=1; j<=col; j++){
        dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) - arr[i-1][j-1]
    }
    dp[1][0] = 1
  }
  return dp[row][col]
}
let arr = [
  [-1, -2, 3],
  [-1, 0, 0],
  [-3, -3, -2],
  [-5, 10, -20]
]
console.log(savePrincess(arr))