
/*
https://www.nowcoder.com/practice/f9c6f980eeec43ef85be20755ddbeaf4?tpId=37&tqId=21239&rp=1&ru=/exam/oj/ta&qru=/exam/oj/ta&sourceUrl=%2Fexam%2Foj%2Fta%3Fpage%3D1%26tpId%3D37%26type%3D37&difficulty=undefined&judgeStatus=undefined&tags=&title=
王强决定把年终奖用于购物，他把想买的物品分为两类：主件与附件，附件是从属于某个主件的，下表就是一些主件与附件的例子：
主件	附件
电脑	打印机，扫描仪
书柜	图书
书桌	台灯，文具
工作椅	无
如果要买归类为附件的物品，必须先买该附件所属的主件，且每件物品只能购买一次。
每个主件可以有 0 个、 1 个或 2 个附件。附件不再有从属于自己的附件。
王强查到了每件物品的价格（都是 10 元的整数倍），而他只有 N 元的预算。除此之外，他给每件物品规定了一个重要度，用整数 1 ~ 5 表示。他希望在花费不超过 N 元的前提下，使自己的满意度达到最大。
满意度是指所购买的每件物品的价格与重要度的乘积的总和，假设设第 i 件物品的价格为 v[i]，重要度为 w[i]，该件商品的满意度为 v[i] * w[i]
 */
// 该问题是 01 背包问题，使用动态规划求解。
// dp[i][j] = max(物品不放入背包，主件，主件+附件1，主件+附件2，主件+附件1+附件2)
function getMaxValue() {
  const base = 10
  const money = 1000 / base
  let arr = [[800, 2, 0], [400, 5, 1], [300, 5, 1], [400, 3, 0], [500, 2, 0]]
  let targetArr = []
  let annex = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][2] == 0) {
      targetArr.push({
        price: arr[i][0] / base,
        value: arr[i][1] * arr[i][0],
        index: i+1
      })
    } else {
      if (arr[i][2] in annex) {
        annex[arr[i][2]].push(arr[i])
      } else {
        annex[arr[i][2]] = [arr[i]]
      }
    }
  }

  let w=[[]]
  let v=[[]]
  for (const item of targetArr) {
    let w_temp = []
    let v_temp = []
    w_temp.push(item.price)
    v_temp.push(item.value)
    if(item.index in annex){ // 如果有附件
      w_temp.push(w_temp[0] + annex[item.index][0][0]/base) // 主件+附件1
      v_temp.push(v_temp[0] + annex[item.index][0][1] * annex[item.index][0][0])
      if(annex[item.index].length > 1){ // 存在两个附件
        w_temp.push(w_temp[0] + annex[item.index][1][0]/base) // 主件 + 附件2
        v_temp.push(v_temp[0] + annex[item.index][1][1] * annex[item.index][1][0])
        // 主件+附件1+附件2
        w_temp.push(w_temp[1] + annex[item.index][1][0]/base)
        v_temp.push(v_temp[1] + annex[item.index][1][1] * annex[item.index][1][0])
      }
    }
    w.push(w_temp)
    v.push(v_temp)
  }
  console.log(w, v)

  const len = targetArr.length
  const dp = Array.from(Array(len+1), () => Array(money + 1))
  for (let j = 0; j <= money; j++) {
    dp[0][j] = 0
  }
  for (let i = 1; i <= len; i++) {
    for (let j = 0; j <= money; j++) {
      // let { price, value } = targetArr[i]
      // dp[i][j] = j >= price ? Math.max(dp[i - 1][j - price] + value, dp[i - 1][j]) : dp[i - 1][j]
      let max_value = dp[i-1][j]
      for(let k=0; k<w[i].length; k++){
        if(j>=w[i][k]){
          max_value = Math.max(max_value, dp[i-1][j-w[i][k]]+v[i][k])
        }
      }
      dp[i][j] = max_value
    }
  }
  // console.log(dp[len][money])
  return dp[len][money]
  // console.log(dp[len][money])
  // for (let i = 1; i <= len; i++) {
  //   for (let j = 0; j <= money; j++) {
  //     let price = primary[i][0]
  //     let satisfactioin = price * primary[i][1]
  //     let index = primary[i][2]
  //     let price1 = price // 主件 + 附件1
  //     let satisfactioin1 = satisfactioin
  //     let price2 = price // 主件 + 附件2
  //     let satisfactioin2 = satisfactioin
  //     let price3 = price // 主件 + 附件1 + 附件2
  //     let satisfactioin3 = satisfactioin
  //     let
  //     if (index in annex) {
  //       if (annex[index].length == 1) {
  //         price1 += annex[index][0][1]
  //         satisfactioin1 += annex[index][0][2]
  //         dp[i][j] = j >= price ?
  //           Math.max(dp[i - 1][j - price] + satisfactioin, dp[i - 1][j]) : dp[i - 1][j]
  //         dp[i][j] = j >= price1 ?
  //           Math.max()
  //       } else {

  //       }
  //     } else {
  //       dp[i][j] = j >= price ?
  //         Math.max(dp[i - 1][j - price] + satisfactioin, dp[i - 1][j]) : dp[i - 1][j]
  //     }
  //   }
  // }
  // return dp[len][money] * base
}
console.log(getMaxValue())