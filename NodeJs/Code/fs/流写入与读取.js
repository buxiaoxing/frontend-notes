const fs = require('fs')
const path = require('path')
// 普通读取与写入
async function method1(){
  const fromName= path.resolve(__dirname, './TestFile/copied.jpeg')
  const toName= path.resolve(__dirname, './TestFile/copied2.jpeg')
  console.time("方式1")
  const buffer = await fs.promises.readFile(fromName)
  await fs.promises.writeFile(toName, buffer)
  console.timeEnd("方式1")
}

function method2(){
  const fromName= path.resolve(__dirname, './TestFile/copied.jpeg')
  const toName= path.resolve(__dirname, './TestFile/copied2.jpeg')
  console.time("方式2")
  const rs = fs.createReadStream(fromName)
  const ws = fs.createWriteStream(toName)
  rs.pipe(ws) // 等同于下面的方式，解决背压问题
  rs.on("end", ()=>{
    ws.end()
    console.timeEnd("方式2")
  })
  // let flag = true
  // rs.on("data", chunk=>{
  //   flag = ws.write(chunk)
  //   if(!flag){
  //     rs.pause()
  //   }
  // })
  // ws.on("drain", ()=>{
  //   rs.resume()
  // })
  // rs.on("end", ()=>{
  //   ws.end()
  //   console.timeEnd("方式2")
  // })
}
method2()