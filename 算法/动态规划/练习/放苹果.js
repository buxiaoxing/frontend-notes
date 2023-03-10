/*
把m个同样的苹果放在n个同样的盘子里，允许有的盘子空着不放，问共有多少种不同的分法？
注意：如果有7个苹果和3个盘子，（5，1，1）和（1，5，1）被视为是同一种分法。
 */
function appleCombination(apple, plate){
  if(apple < 0 || plate < 0){
      return 0
  }
  if(apple == 1 || plate == 1){
      return 1
  }
  return appleCombination(apple-plate, plate) + appleCombination(apple, plate-1)
}

console.log(appleCombination(2, 2))