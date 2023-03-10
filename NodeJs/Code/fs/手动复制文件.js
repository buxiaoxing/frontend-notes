
// 通过文件的读取与写入，复制文件
// 也可以通过 copyFile Api直接复制文件
const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./TestFile/IMG_0509.jpeg")
const filename2 = path.resolve(__dirname, "./TestFile/copied.jpeg")

async function copyFile(sourceName, targetNamt){
  const buffer = await fs.promises.readFile(sourceName)
  await fs.promises.writeFile(targetNamt, buffer)
}
copyFile(filename, filename2)