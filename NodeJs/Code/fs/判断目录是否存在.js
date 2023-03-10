
// 创建目录 , 创建文件直接使用 writeFile 就可以
const fs = require("fs")
const path = require("path")

const filename = path.resolve(__dirname, "./mkdir/3")

async function isExists(filename){
  try {
    await fs.promises.stat(filename)
    return true
  } catch (error) {
    // 文件不存在
    if(error.code === "ENOENT"){
      return false
    }
    throw error
  }
}

async function test(){
  const result = await isExists(filename)
  if(result){
    console.log("目录已存在")
  }else{
    await fs.promises.mkdir(filename)
    console.log("目录创建成功")
  }

}

test()