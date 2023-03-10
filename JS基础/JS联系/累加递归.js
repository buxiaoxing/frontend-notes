function accumulate(num){
  if(num === 1){
    return 1
  }
  return accumulate(num-1) + num
}
console.log(accumulate(100))

function factorial(num){
  if(num === 1){
    return 1
  }
  return factorial(num-1) * num
}

function accumulate2(i, j){
  if(i===j){
    return i
  }
  return accumulate2(i, j-1)+j
}