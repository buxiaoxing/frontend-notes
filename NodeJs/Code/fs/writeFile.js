const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./TestFile/1.txt")

async function test(){
  // await fs.promises.writeFile(filename, "123") // 默认覆盖文件内容，文件名不存在则新建，目录不存在则会报错
  // console.log("写入成功")


  // await fs.promises.writeFile(filename, "123", {
  //   flag: "a" // 在后面新增
  // }) 
  // console.log("写入成功")


  const buffer = Buffer.from("abc", "utf-8")
  await fs.promises.writeFile(filename, buffer)
  console.log("写入成功")
}

test()