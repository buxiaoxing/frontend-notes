// 创建目录 , 创建文件直接使用 writeFile 就可以
const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./mkdir")

async function test(){
  await fs.promises.mkdir(filename)
  console.log("创建成功")
}

test()