const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./TestFile/1.txt")

/* 回调异步调用 */
// fs.readFile(filename, "utf-8", (err, content)=>{
//   // console.log(content) // 没有配置默认得到的是Buffer
//   // console.log(content.toString("utf-8"))
//   console.log(content) // 配置了编码方式，直接得到字符串 

// })

/* 同步调用 */
// const content = fs.readFileSync(filename, "utf-8")
// console.log(content)

/* promise异步调用 */
fs.promises.readFile(filename, "utf-8").then((data)=>{
  console.log(data)
})