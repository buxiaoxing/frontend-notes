

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

- *writeFile(filename, content, [config])*

<img src="http://img.buxiaoxing.com/uPic/2023/03/08113640-uqaNCx-image-20230308113640179.png" alt="image-20230308113640179" style="zoom:50%;" />

- 手动复制文件



#### 读取文件/目录状态信息

- `state`





## 文件流

> 之前读取文件的方式是将文件的所有内容全部读到内存中，内存压力很大
>
> 流是一点一点传输，减少内存的压力

