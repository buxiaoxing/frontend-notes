function foo(versions) {
  let newVers = versions.map(item => {
    let obj = {}
    let tmpArr = item.split(".")
    obj.str = item
    obj.main = Number(tmpArr[0])
    obj.sub = Number(tmpArr[1])
    if (tmpArr[2]) {
      let tmpArr2 = tmpArr[2].split("-")
      obj.v3 = Number(tmpArr2[0])
      if (tmpArr2[1]) {
        obj.v4 = tmpArr2[1]
      }
    }

    return obj
  })
  newVers.sort(versionSort)
  return newVers
}

function versionSort(b, a) {
  if (a.main !== b.main) {
    return a.main - b.main
  }
  if (a.sub !== b.sub) {
    if (a.sub === undefined) {
      return -1
    }
    if (b.sub === undefined) {
      return 1
    }
    return a.sub - b.sub
  }
  if (a.v3 !== b.v3) {
    if (a.v3 === undefined) {
      return -1
    }
    if (b.v3 === undefined) {
      return 1
    }
    return a.v3 - b.v3
  }
  if (a.v4 !== b.v4) {
    if (a.v4 === undefined) {
      return -1
    }
    if (b.v4 === undefined) {
      return 1
    }
    if (a.v4 < b.v4) {
      return -1
    } else {
      return 1
    }
  }
  return 0
}

// function versionMax(v1, v2){
//   if(v1.main>v2.main){ // 第一层判断
//     return v1.str
//   }
// }

// let arr = ["1.3.11-S2", "1.3.11-S13"]
// let arr = ["2.5.1-C", "1.4.2-D"]
// let arr = ["1.05.1", "1.5.01"]
let arr = ["1.5", "1.5.0"]
// let arr = ["1.5.1-A", "1.5.1-a"]
console.log(foo(arr))
// let test = [1,2,3,4]


