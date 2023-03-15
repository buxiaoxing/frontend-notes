function foo(records){
  const result = []
  //第一种情况，实际设备号与注册设备号不一致
  for (const record of records) {
    let tmpArr = record.split(",")
    if(tmpArr[3] !== tmpArr[4]){
      result.push(record)
    }
    else if(util(record, records)){
      result.push(record)
    }
  }
  return result
}

function util(record, records){
  let recordArr = record.split(",")
  let time = recordArr[1]
  let distance = recordArr[2]
  for (const item of records) {
    let itemArr = item.split(",")
    if(Math.abs(itemArr[1]-time)<60 && Math.abs(itemArr[2]-distance)>5){
      return false
      
    }
  }
  return true
}

console.log(foo(["10000,10,1,ABCD,ABCD", "10000,50,10,ABCD,ABCD"]))