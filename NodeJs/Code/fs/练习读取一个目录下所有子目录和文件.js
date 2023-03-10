
const fs = require('fs')
const path = require('path')

class DictInfo {
  constructor(filename, name, ext, isFile, size, createTime, updateTime) {
    this.filename = filename
    this.name = name
    this.ext = ext
    this.isFile = isFile
    this.size = size
    this.createTime = createTime
    this.updateTime = updateTime
  }

  async getContent(buffer = false){
    if(this.isFile){
      if(buffer){
        return await fs.readFile(this.filename)
      }else{
        return await fs.readFile(this.filename, "utf-8")
      }
    }else{
      return null
    }
  }

  async getChildren(){
    if(this.isFile){
      return []
    }
    let children = await fs.promises.readdir(this.filename)
    children = children.map(name=>{
      const result = path.resolve(this.filename, name)
      return DictInfo.getDictInfo(result)
    })
    return Promise.all(children)
  }

  static async getDictInfo(filename) {
    const stat = await fs.promises.stat(filename)
    return new DictInfo(filename, path.basename(filename),
      path.extname(filename), stat.isFile(), stat.size, stat.birthtime, stat.atime)
  }
}

async function readDir(filename) {
  const result =  await DictInfo.getDictInfo(filename)
  // return await result.getChildren()
  console.log(await result.getChildren())
  
}
const filename = path.resolve(__dirname, "./TestFile")
readDir(filename)