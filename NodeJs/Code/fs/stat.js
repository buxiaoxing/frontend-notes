const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./TestFile/1.txt")

async function test(){
  const stat = await fs.promises.stat(filename)
  // console.dir(stat)
  console.log(stat.atime) // 上次访问时间
  console.log(stat.size) // 占用字节，目录为0
  console.log(stat.mtime) // 上次文件被修改时间
  console.log(stat.ctime) // 上次文件状态被修改的时间
  console.log(stat.birthtime) // 文件创建时间
  console.log(stat.isDirectory()) // 是否是目录
  console.log(stat.isFile()) // 是否是文件
}

test()