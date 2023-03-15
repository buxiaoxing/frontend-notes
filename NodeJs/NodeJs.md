

## 文件 I/O

### I/O概述

> I/O：input ouput(输入输出)
>
> I/O速度往往低于内存和CPU的交互速度



### fs模块

#### 读取文件

- *fs.readFile(path, [config], callback)* 读取文件

   <img src="http://img.buxiaoxing.com/uPic/2023/03/08111801-Tjj2pz-image-20230308111800830.png" alt="image-20230308111800830" style="zoom:50%;" />

  **异步读取**

- *fs.readFileSync(path, [config])* 同步读取文件

   <img src="http://img.buxiaoxing.com/uPic/2023/03/08112036-30VL6B-image-20230308112036663.png" alt="image-20230308112036663" style="zoom:50%;" />

​		Sync 函数是同步的，会导致JS运行阻塞，及其影响性能

​		通常在程序启动时运行有限的次数即可

​		**所有Api都提供了同步调用方式**

- *fs.promises.readFile(path, [config])* Promise的调用方式

   <img src="http://img.buxiaoxing.com/uPic/2023/03/08112539-ZfAqLm-image-20230308112539338.png" alt="image-20230308112539338" style="zoom:50%;" />

  **所有nodejs Api都提供了Promise的调用方式**

#### 写入文件

***writeFile(filename, content, [config])***

<img src="http://img.buxiaoxing.com/uPic/2023/03/08113640-uqaNCx-image-20230308113640179.png" alt="image-20230308113640179" style="zoom:50%;" />

- 手动复制文件

  ```js
  const filename = path.resolve(__dirname, "./TestFile/IMG_0509.jpeg")
  const filename2 = path.resolve(__dirname, "./TestFile/copied.jpeg")
  
  async function copyFile(sourceName, targetNamt){
    // 先读取
    const buffer = await fs.promises.readFile(sourceName)
    // 再写入
    await fs.promises.writeFile(targetNamt, buffer)
  }
  copyFile(filename, filename2)
  ```

  

#### stat

> 读取文件/目录状态信息

```js
const stat = await fs.promises.stat(filename)
console.dir(stat)
console.log(stat.atime) // 上次访问时间
console.log(stat.size) // 占用字节，目录为0
console.log(stat.mtime) // 上次文件被修改时间
console.log(stat.ctime) // 上次文件状态被修改的时间
console.log(stat.birthtime) // 文件创建时间
console.log(stat.isDirectory()) // 是否是目录
console.log(stat.isFile()) // 是否是文件
```

#### readdir

> 获取目录中的文件或目录，无法获取子目录里面的内容

```js
const list = await fs.promises.readdir(filename)
console.log(list) // 获取目录中的文件和子目录，无法获取子目录里面的内容
//[ '1.txt', 'IMG_0509.jpeg', 'copied.jpeg', 'copied2.jpeg' ] 返回一个数组
```

#### mkdir

> 创建目录 , 创建文件直接使用 writeFile 就可以

```js
async function test(){
  await fs.promises.mkdir(filename) // 没有返回
  console.log("创建成功")
}
```

**手写判断目录是否存在**

```js
// 通过 stat 判断目录是否存在，如果不存在则会抛出错误
async function isExists(filename){
  try {
    await fs.promises.stat(filename)
    return true
  } catch (error) {
    // 文件不存在
    if(error.code === "ENOENT"){ // 捕获这个错误的 code， ENOENT 代表文件不存在
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
```

#### 练习

> 读取一个目录下所有子目录和文件

```js

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

  // 获取文件内容，如果是文件则返回内容，如果是目录则返回 null
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

  // 获取该目录的子目录/子文件，如果这是个文件则返回 []
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
```



## 文件流

> 之前读取文件的方式是将文件的所有内容全部读到内存中，内存压力很大
>
> 流是一点一点传输，减少内存的压力
>
> **文件流是指内存和磁盘之间的数据流动**

### 流读取

*createReadStream(path[, option])*

> 返回：Readable的子类ReadStream 

```
Option: 可选配置

encodeing: 编码方式
start: 起始字节
end: 结束字节
highWaterMark: 每次读取数。如果encoding有值，表示字符数; 如果encodeing为null，表示字节数
```

```js
const rs = fs.createReadStream(fromName)
```

- **rs.on(事件名，处理函数)**	事件监听

  *open*

  *data*

  *close* 文件流关闭后触发，可通过 rs.close() 手动关闭，或文件读取完成后自动关闭

  *error*

  *end*

- **rs.pause()** 暂停读取，会触发 pause 事件

- **rs.resume()** 恢复读取，会触发 resume 事件

### 流写入

*createWriteStream(path[, options])*

> 返回Writable子类WriteStream

```
options可选配置
flags: 操作文件方式 w: 覆盖；a: 追加
encoding
start
highWaterMark: 每次最多写入的字节数

```

```js
const ws = fs.createWriteStream(toName)
```

- **ws.on(事件名，处理函数)** 事件监听

  *open*

  *error*

  *close*

- **ws.write(data)** 

  写数据，可以是buffer也可以是字符串；返回一个boolean值，true表示通道没有被填满；false表示通道已被填满。需要排队，如果排队的过多，机会产生 *背压问题*。当队列清空时会触发 *drain* 事件

- **ws.end([data])**

  结束写入，data是可选的，表示关闭前的最后一次写入

### rs.pipe(ws)

> 将可读流连接到可写流
>
> 返回参数的值
>
> 可解决背压问题

### 解决背压问题

```js
const fromName= path.resolve(__dirname, './TestFile/copied.jpeg')
const toName= path.resolve(__dirname, './TestFile/copied2.jpeg')
console.time("方式2")
const rs = fs.createReadStream(fromName)
const ws = fs.createWriteStream(toName)
// rs.pipe(ws) // 等同于下面的方式，解决背压问题
// rs.on("end", ()=>{
//   ws.end()
//   console.timeEnd("方式2")
// })
let flag = true
rs.on("data", chunk=>{
  flag = ws.write(chunk)
  if(!flag){
    rs.pause()
  }
})
ws.on("drain", ()=>{
  rs.resume()
})
rs.on("end", ()=>{
  ws.end()
  console.timeEnd("方式2")
})
```



## net模块

### http请求

- 短连接

  发送请求，收到回应后双方就挂断电话

  <img src="http://img.buxiaoxing.com/uPic/2023/03/11142043-R06B3b-image-20230311142042961.png" alt="image-20230311142042961" style="zoom:50%;" />

- 长连接

  `keep-alive` 请求头，保持连接
  <img src="http://img.buxiaoxing.com/uPic/2023/03/11142127-6uf6P3-image-20230311142127454.png" alt="image-20230311142127454" style="zoom:50%;" />

  

### net能干什么

> net是一个通信模块

- 可以实现进程间的通信 *IPC*
- 网络通信 *TCP/IP*



### 创建客户端

*net.createConnection(options[, connectionListener])*

```js
const socket = net.createConnection({
  host: "www.baidu.com",
  port: 80,
}, ()=>{
  console.log("连接成功")
})
```

**返回 *socket***

 <img src="http://img.buxiaoxing.com/uPic/2023/03/11143704-erosRB-image-20230311143704389.png" alt="image-20230311143704389" style="zoom:50%;" />

socket 是一个特殊文件，在node中表现为一个*双工流对象*，通过向流写入内容发送数据，通过监听流的内容获取数据



### 创建服务器

*net.createServer()*

```js
const server = net.createServer();
```

**返回 *server***

- *server.listen(port)* 监听当前计算机中某个端口

- *server.on(事件, 回调函数)* 监听事件

  - *listening*

    监听端口后触发该事件

  - *connection*

    当某个连接到来是，触发该事件

    回调函数会获得一个 socket 对象

     <img src="http://img.buxiaoxing.com/uPic/2023/03/11144319-TpuRaP-image-20230311144319546.png" alt="image-20230311144319546" style="zoom:50%;" />





## 生命周期

![image-20230311144455544](http://img.buxiaoxing.com/uPic/2023/03/11144455-cJEFGR-image-20230311144455544.png)

- *timer* 存放计时器的回调函数

- *poll* 轮询队列

  除了 timer check，绝大部分回调会进入该队列（文件的读取，监听用户请求）

  > 如果 poll 中有回调，依次执行回调，知道清空队列
  >
  > 如果 poll 中没有回调，等待其他队列出现回调，结束该阶段，进入下一阶段。
  >
  > 如果其他队列也没有回调，会一直等待（如果没有等待的东西，程序就会结束）。

- *check* 检查阶段

  *setImmediate* 的回调会直接进入该队列

- *nextTick* 和 *Promise*

  事件循环中，每打算执行一个回调之前，必须先清空nextTick队列和promise队列。nextTick优先级更高
