const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./TestFile")

async function test(){
  const list = await fs.promises.readdir(filename)
  console.log(list) // 获取目录中的文件和子目录，无法获取子目录里面的内容
}

test()