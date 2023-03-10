function getCompeleNum(number){
  let count = 0
  for(let i=2; i<number; i++){
      let arr = []
      for(let j=1; j<i; j++){
          if(i % j == 0){
              arr.push(j)
          }
      }
      if(arr.reduce((a,b)=>a+b)==i){
          count++
      }
  }
  return count
}
console.log(getCompeleNum(1000))