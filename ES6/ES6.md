## 块级绑定

### 变量声明问题（var）

1. 允许重复的变量声明，导致数据被覆盖
2. 变量提升：怪异的数据访问、闭包问题
3. 全局变量挂载到全局对象：全局对象成员污染问题

### 使用let声明变量

ES6不仅引入**let关键字**用于解决变量声明的问题，同时引入了**块级作用域**的概念

块级作用域：代码执行时遇到花括号，会创建一个块级作用域，花括号结束，销毁块级作用域

声明变量的问题

1. 全局变量挂载到全局对象：全局对象成员污染问题

let声明的变量不会挂载到全局对象

2. 允许重复的变量声明：导致数据被覆盖

let声明的变量，不允许当前作用域范围内重复声明

在块级作用域中用let定义的变量，在作用域外不能访问

3. 变量提升：怪异的数据访问、闭包问题

使用let不会有变量提升，因此，不能在定义let变量之前使用它

底层实现上，**let声明的变量实际上也会有提升，但是，提升后会将其放入到“暂时性死区”**，如果访问的变量位于暂时性死区，则会报错：“Cannot access 'a' before initialization”。当代码运行到该变量的声明语句时，会将其从暂时性死区中移除。

在循环中，用let声明的循环变量，会特殊处理，每次进入循环体，都会开启一个新的作用域，并且将循环变量绑定到该作用域（每次循环，使用的是一个全新的循环变量）

在循环中使用let声明的循环变量，在循环结束后会销毁



### 使用const声明常量

**const和let完全相同，仅在于用const声明的变量，必须在声明时赋值，而且不可以重新赋值**。

实际上，在开发中，应该尽量使用const来声明变量，以保证变量的值不会随意篡改，原因如下：

1. 根据经验，开发中的很多变量，都是不会更改，也不应该更改的。
2. 后续的很多框架或者是第三方JS库，都要求数据不可变，使用常量可以一定程度上保证这一点。

注意的细节：

1. 常量不可变，是指声明的常量的内存空间不可变，并不保证内存空间中的地址指向的其他空间不可变。
2. 常量的命名
   1. 特殊的常量：该常量从字面意义上，一定是不可变的，比如圆周率、月地距地或其他一些绝不可能变化的配置。通常，**该常量的名称全部使用大写，多个单词之间用下划线分割**
   2. 普通的常量：使用和之前一样的命名即可
3. 在for循环中，循环变量不可以使用常量



## 字符串和正则表达式

### 更好的Unicode支持

早期，由于存储空间宝贵，Unicode使用16位二进制来存储文字。我们将一个16位的二进制编码叫做一个码元（Code Unit）。

后来，由于技术的发展，Unicode对文字编码进行了扩展，将某些文字扩展到了32位（占用两个码元），并且，将某个文字对应的二进制数字叫做码点（Code Point）。

ES6为了解决这个困扰，为字符串提供了方法：codePointAt，根据字符串码元的位置得到其码点。

同时，ES6为正则表达式添加了一个flag: u，如果添加了该配置，则匹配时，使用码点匹配

### 更多的字符串API

以下均为字符串的实例（原型）方法

- includes

判断字符串中是否包含指定的子字符串

- startsWith

判断字符串中是否以指定的字符串开始

- endsWith

判断字符串中是否以指定的字符串结尾

- repeat

将字符串重复指定的次数，然后返回一个新字符串。



### [扩展]正则中的粘连标记

标记名：y

含义：匹配时，完全按照正则对象中的lastIndex位置开始匹配，并且匹配的位置必须在lastIndex位置。



### 模板字符串

ES6之前处理字符串繁琐的两个方面：

1. 多行字符串
2. 字符串拼接


在ES6中，提供了模板字符串的书写，可以非常方便的换行和拼接，要做的，仅仅是将字符串的开始或结尾改为 ` 符号

如果要在字符串中拼接js表达式，只需要在模板字符串中使用```${JS表达式}```

### [扩展]模板字符串标记

在模板字符串书写之前，可以加上标记:

```js
标记名`模板字符串`
```

标记是一个函数，函数参数如下：

1. 参数1：被插值分割的字符串数组
2. 后续参数：所有的插值

## 函数

###  参数默认值?

#### 使用

在书写形参时，直接给形参赋值，附的值即为默认值

这样一来，当调用函数时，如果没有给对应的参数赋值（给它的值是undefined），则会自动使用默认值。

#### [扩展]对arguments的影响

只要给函数加上参数默认值，该函数会自动变量严格模式下的规则：arguments和形参脱离

#### [扩展]留意暂时性死区

形参和ES6中的let或const声明一样，具有作用域，并且根据参数的声明顺序，存在暂时性死区。

```js
function test(a = b, b) {
  console.log(a, b);
}

test(undefined, 2); // 报错 ReferenceError: Cannot access 'b' before initialization
```



### 剩余参数

arguments的缺陷：

1. 如果和形参配合使用，容易导致混乱
2. 从语义上，使用arguments获取参数，由于形参缺失，无法从函数定义上理解函数的真实意图


ES6的剩余参数专门用于收集末尾的所有参数，将其放置到一个形参数组中。

语法:

```js
function (...形参名){

}
```

**细节：**

1. 一个函数，仅能出现一个剩余参数
2. 一个函数，如果有剩余参数，剩余参数必须是最后一个参数

### 展开运算符

使用方式：```  ...要展开的东西  ```

#### 对数组展开 ES6



#### 对对象展开 ES7

### 函数的双重用途

> 构造函数和普通函数

ES6提供了一个特殊的API，可以使用该API在函数内部，判断该函数是否使用了new来调用

```js
new.target 
//该表达式，得到的是：如果没有使用new来调用函数，则返回undefined
//如果使用new调用函数，则得到的是new关键字后面的函数本身
```

### 箭头函数

回顾：this指向

1. 通过对象调用函数，this指向对象
2. 直接调用函数，this指向全局对象
3. 如果通过new调用函数，this指向新创建的对象
4. 如果通过apply、call、bind调用函数，this指向指定的数据
5. 如果是DOM事件函数，this指向事件源

#### 使用语法

箭头函数是一个函数表达式，理论上，任何使用函数表达式的场景都可以使用箭头函数

完整语法：

```js
(参数1, 参数2, ...)=>{
    //函数体
}
```

如果参数只有一个，可以省略小括号

```js
参数 => {

}
```

如果箭头函数只有一条返回语句，可以省略大括号，和return关键字

```js
参数 => 返回值
```

#### 注意细节

- 箭头函数中，不存在this、arguments、new.target，如果使用了，则使用的是函数外层的对应的this、arguments、new.target
- 箭头函数没有原型
- 箭头函数不能作用构造函数使用

#### 应用场景

1. 临时性使用的函数，并不会可以调用它，比如：
   1. 事件处理函数
   2. 异步处理函数
   3. 其他临时性的函数
2. 为了绑定外层this的函数
3. 在不影响其他代码的情况下，保持代码的简洁，最常见的，数组方法中的回调函数



## 对象

### 新增的对象字面量语法

1. 成员速写

如果对象字面量初始化时，成员的名称来自于一个变量，并且和变量的名称相同，则可以进行简写

2. 方法速写

对象字面初始化时，方法可以省略冒号和function关键字

3. 计算属性名

有的时候，初始化对象时，某些属性名可能来自于某个表达式的值，在ES6，可以使用中括号来表示该属性名是通过计算得到的。

```js
const prop1 = "name2";
const prop2 = "age2";
const prop3 = "sayHello2";

const user = {
    // 计算属性名
    [prop1]: "姬成",
    [prop2]: 100,
    [prop3](){ //方法省略冒号和关键字
        console.log(this[prop1], this[prop2])
    }
}

user[prop3]();

console.log(user)
```

### Object的新增API

1. Object.is

用于判断两个数据是否相等，基本上跟严格相等（===）是一致的，除了以下两点：

​	- NaN和NaN相等

​	- +0和-0不相等

2. Object.assign

​	- 用于混合对象

3. **Object.getOwnPropertyNames** 的枚举顺序
   - Object.getOwnPropertyNames方法之前就存在，只不过，官方没有明确要求，对属性的顺序如何排序，如何排序，完全由浏览器厂商决定。
   - ES6规定了该方法返回的数组的排序方式如下：
     - 先排数字，并按照升序排序
     - 再排其他，按照书写顺序排序

4. **Object.setPrototypeOf**

   该函数用于设置某个对象的隐式原型

   ​	比如： Object.setPrototypeOf(obj1, obj2)，
   ​	相当于：  ``` obj1.__proto__ = obj2 ```



### 面向对象简介

面向对象：一种编程思想，跟具体的语言


对比面向过程：

- 面向过程：思考的切入点是功能的步骤，适合小系统
- 面向对象：思考的切入点是对象的划分，适合大系统（可维护性，可扩展性）

【大象装冰箱】



### 类：构造函数的语法糖

#### 传统的构造函数的问题

1. 属性和原型方法定义分离，降低了可读性
2. 原型成员可以被枚举
3. 默认情况下，构造函数仍然可以被当作普通函数使用

#### 类的特点

1. 类声明不会被提升，与 let 和 const 一样，存在**暂时性死区**
2. 类中的所有代码均在**严格模式**下执行
3. 类的所有方法都是不可枚举的
4. 类的所有方法都无法被当作构造函数使用
5. 类的构造器必须使用 new 来调用

### 类的其他书写方式

1. 可计算的成员名

   ```js
   const printName = "print";
   
   class Animal {
       constructor(type, name, age, sex) {
           this.type = type;
           this.name = name;
           this.age = age;
           this.sex = sex;
       }
   
       [printName]() {
           console.log(`【种类】：${this.type}`);
           console.log(`【名字】：${this.name}`);
           console.log(`【年龄】：${this.age}`);
           console.log(`【性别】：${this.sex}`);
       }
   }
   
   const a = new Animal("狗", "旺财", 3, "男");
   a[printName]();
   ```

   

2. getter和setter

   Object.defineProperty 可定义某个对象成员属性的读取和设置

   使用getter和setter控制的属性，不在原型上

   ```js
   //创建一个age属性，并给它加上getter，读取该属性时，会运行该函数
       get age() {
           return this._age + "岁";
       }
   
   //创建一个age属性，并给它加上setter，给该属性赋值时，会运行该函数
       set age(age) {
           if (typeof age !== "number") {
               throw new TypeError("age property must be a number");
           }
           if (age < 0) {
               age = 0;
           }
           else if (age > 1000) {
               age = 1000;
           }
           this._age = age;
       }
   ```




3. 静态成员

   构造函数本身的成员

   使用static关键字定义的成员即静态成员

4. 字段初始化器（ES7）

   > 相当于 this.字段 = 字段

   注意：

   1). 使用static的字段初始化器，添加的是静态成员
   2). 没有使用static的字段初始化器，添加的成员位于对象上
   3). 箭头函数在字段初始化器位置上，`this` 指向当前对象

   ​    不会出现在原型上，会占用额外内存空间，每个实例的都会不一样。

   ```js
   class Person {
     constructor(name, age){
       this.name = name
       this.age = age
     }
     sayHello(){
       console.log(`hello I'm ${this.name}`)
     }
     sayHello2 = ()=>{
       console.log(`hello I'm ${this.name} 2`)
     }
   }
   ```

   ![image-20230219223415706](http://img.buxiaoxing.com/uPic/2023/02/19223415-p6g5bF-image-20230219223415706.png)

5. 类表达式

   ```js
   const A = class{
     // do something
   }
   ```

   

6. [扩展]装饰器（ES7）(Decorator)

   横切关注点

   装饰器的本质是一个函数

   ```js
   class Test {
   
       @Obsolete
       print() {
           console.log("print方法")
       }
   }
   
   function Obsolete(target, methodName, descriptor) {
       // function Test
       // print
       // { value: function print(){}, ... }
       // console.log(target, methodName, descriptor);
       const oldFunc = descriptor.value
       descriptor.value = function (...args) {
           console.warn(`${methodName}方法已过时`);
           oldFunc.apply(this, args);
       }
   }
   ```

### 类的继承

如果两个类A和B，如果可以描述为：B 是 A，则，A和B形成继承关系

如果B是A，则：

1. B继承自A
2. A派生B
3. B是A的子类
4. A是B的父类

如果A是B的父类，则B会自动拥有A中的所有实例成员。


新的关键字：

- extends：继承，用于类的定义
- super
  - 直接当作函数调用，表示父类构造函数
  - 如果当作对象使用，则表示父类的原型


注意：ES6要求，如果定义了constructor，并且该类是子类，则必须在constructor的第一行手动调用父类的构造函数

如果子类不写constructor，则会有默认的构造器，该构造器需要的参数和父类一致，并且自动调用父类构造器

【冷知识】

- 用JS制作抽象类
  - 抽象类：一般是父类，不能通过该类创建对象
- 正常情况下，this的指向，this始终指向具体的类的对象



## 解构

### 对象解构

#### 什么是解构

使用ES6的一种语法规则，将一个对象或数组的某个属性提取到某个变量中

**解构不会对被解构的目标造成任何影响**

#### 在解构中使用默认值

```js

{同名变量 = 默认值}

```

#### 非同名属性解构

```js

{属性名:变量名}

```

### 数组解构

```js
let a = 1, b = 2;
[b, a] = [a, b]
console.log(a, b) // 2,1
```

### 参数解构

```js
function ajax({
  method = "get",
  url = "/"
} = {}) {
  console.log(method, url)
}

ajax() // get /
```

## 符号

### 普通符号

符号是ES6新增的一个数据类型，它通过使用函数 ```Symbol(符号描述)``` 来创建

符号设计的初衷，是为了给对象设置私有属性

私有属性：只能在对象内部使用，外面无法使用

符号具有以下特点：

- 没有字面量
- 使用 typeof 得到的类型是 symbol
- **每次调用 Symbol 函数得到的符号永远不相等，无论符号名是否相同**
- 符号可以作为对象的属性名存在，这种属性称之为符号属性(之前属性名只能是字符串)
  - 开发者可以通过精心的设计，让这些属性无法通过常规方式被外界访问
  - 符号属性是**不能枚举**的，因此在 for-in 循环中无法读取到符号属性，Object.keys 方法也无法读取到符号属性
  - `Object.getOwnPropertyNames` 尽管可以得到所有无法枚举的属性，但是仍然无法读取到符号属性
  - ES6 新增 `Object.getOwnPropertySymbols` 方法，可以读取符号
- 符号无法被隐式转换，因此不能被用于数学运算、字符串拼接或其他隐式转换的场景，但符号可以显式的转换为字符串，通过 String 构造函数进行转换即可，console.log 之所以可以输出符号，是它在内部进行了显式转换

### 共享符号

根据某个符号名称（符号描述）能够得到同一个符号

```js
Symbol.for("符号名/符号描述")  //获取共享符号
```

**Symbol.for()实现**

```js
const SymbolFor = (()=>{
  const global = {}
  return function(desc){
    if(!global[desc]){
      global[desc] = Symbol(desc)
    }
    return global[desc]
  }
})()
```



### 知名（公共、具名）符号

知名符号是一些具有特殊含义的共享符号，通过 Symbol 的静态属性得到

ES6 延续了 ES5 的思想：减少魔法，暴露内部实现！

因此，ES6 用知名符号暴露了某些场景的内部实现

1. **Symbol.hasInstance**

该符号用于定义构造函数的静态成员，它将影响 instanceof 的判定

```js

obj instanceof A

//等效于

A[Symbol.hasInstance](obj) // Function.prototype[Symbol.hasInstance]

```

2. [扩展] **Symbol.isConcatSpreadable**

该知名符号会影响数组的 concat 方法

3. [扩展] **Symbol.toPrimitive**

该知名符号会影响类型转换的结果

4. [扩展] **Symbol.toStringTag**

该知名符号会影响 Object.prototype.toString 的返回值

5. 其他知名符号





## 异步处理





## Fetch api

###  Fetch Api 概述

**XMLHttpRequest的问题**

1. 所有的功能全部集中在同一个对象上，容易书写出混乱不易维护的代码
2. 采用传统的事件驱动模式，无法适配新的 Promise Api

**Fetch Api 的特点**

1. 并非取代 AJAX，而是对 AJAX 传统 API 的改进
2. 精细的功能分割：头部信息、请求信息、响应信息等均分布到不同的对象，更利于处理各种复杂的 AJAX 场景
3. 使用 Promise Api，更利于异步代码的书写
4. Fetch Api 并非 ES6 的内容，属于 HTML5 新增的 Web Api
5. 需要掌握网络通信的知识



### 基本使用

> 请求测试地址：http://study.yuanjin.tech/api/local

使用 `fetch` 函数即可立即向服务器发送网络请求

#### 参数

该函数有两个参数：

1. 必填，字符串，请求地址
2. 选填，对象，请求配置

**请求配置对象**

- method：字符串，请求方法，默认值 GET
- headers：对象，请求头信息
- body: 请求体的内容，必须匹配请求头中的 Content-Type
- mode：字符串，请求模式
  - cors：默认值，配置为该值，会在请求头中加入 origin 和 referer
  - no-cors：配置为该值，不会在请求头中加入 origin 和 referer，跨域的时候可能会出现问题
  - same-origin：指示请求必须在同一个域中发生，如果请求其他域，则会报错
- credentials: 如何携带凭据（cookie）
  - omit：默认值，不携带 cookie
  - same-origin：请求同源地址时携带 cookie
  - include：请求任何地址都携带 cookie
- cache：配置缓存模式
  - default: 表示 fetch 请求之前将检查下 http 的缓存.
  - no-store: 表示 fetch 请求将完全忽略 http 缓存的存在. 这意味着请求之前将不再检查下 http 的缓存, 拿到响应后, 它也不会更新 http 缓存.
  - no-cache: 如果存在缓存, 那么 fetch 将发送一个条件查询 request 和一个正常的 request, 拿到响应后, 它会更新 http 缓存.
  - reload: 表示 fetch 请求之前将忽略 http 缓存的存在, 但是请求拿到响应后, 它将主动更新 http 缓存.
  - force-cache: 表示 fetch 请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 除非没有任何缓存, 那么它将发送一个正常的 request.
  - only-if-cached: 表示 fetch 请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 如果没有缓存, 它将抛出网络错误(该设置只在 mode 为”same-origin”时有效).

#### 返回值

fetch 函数返回一个 Promise 对象

- 当收到服务器的返回结果后，Promise 进入 resolved 状态，状态数据为 Response 对象
- 当网络发生错误（或其他导致无法完成交互的错误）时，Promise 进入 rejected 状态，状态数据为错误信息

### Response 对象

- ok：boolean，当响应消息码在 200~299 之间时为 true，其他为 false
- status：number，响应的状态码
- text()：用于处理文本格式的 Ajax 响应。它从响应中获取文本流，将其读完，然后返回一个被解决为 string 对象的 Promise。
- blob()：用于处理二进制文件格式（比如图片或者电子表格）的 Ajax 响应。它读取文件的原始数据，一旦读取完整个文件，就返回一个被解决为 blob 对象的 Promise。
- json()：用于处理 JSON 格式的 Ajax 的响应。它将 JSON 数据流转换为一个被解决为 JavaScript 对象的 promise。
- redirect()：可以用于重定向到另一个 URL。它会创建一个新的 Promise，以解决来自重定向的 URL 的响应。

```js
async function getProvinces() {
  const url = 'http://study.yuanjin.tech/api/local';
  const resp = await fetch(url);
  const result = await resp.json();
  console.log(result);
}
```

### Request 对象

除了使用基本的fetch方法，还可以通过创建一个Request对象来完成请求（实际上，fetch的内部会帮你创建一个Request对象）

```js
new Request(url地址, 配置)
```

注意点：

尽量保证每次请求都是一个新的Request对象

```js
let req;

function getRequestInfo() {
  if (!req) {
    const url = 'http://study.yuanjin.tech/api/local';
    req = new Request(url, {});
    console.log(req);
  }
  return req.clone(); //克隆一个全新的request对象，配置一致
}

async function getProvinces() {
  const resp = await fetch(getRequestInfo());
  const result = await resp.json();
  console.log(result);
}

document.querySelector('button').onclick = function () {
  getProvinces();
};
```



### Headers 对象

在Request和Response对象内部，会将传递的请求头对象，转换为Headers

Headers对象中的方法：

- has(key)：检查请求头中是否存在指定的key值
- get(key): 得到请求头中对应的key值
- set(key, value)：修改对应的键值对
- append(key, value)：添加对应的键值对
- keys(): 得到所有的请求头键的集合
- values(): 得到所有的请求头中的值的集合
- entries(): 得到所有请求头中的键值对的集合

```js
let req;
function getCommonHeaders() {
  return new Headers({
    a: 1,
    b: 2,
  });
}

function getRequestInfo() {
  if (!req) {
    const url = 'http://study.yuanjin.tech/api/local';
    const headers = getCommonHeaders();
    headers.set('a', 3);
    req = new Request(url, {
      headers,
    });
  }
  return req.clone(); //克隆一个全新的request对象，配置一致
}
```



### 文件上传

流程：

1. 客户端将文件数据发送给服务器
2. 服务器保存上传的文件数据到服务器端
3. 服务器响应给客户端一个文件访问地址

> 测试地址：http://study.yuanjin.tech/api/upload
> 键的名称（表单域名称）：imagefile

请求方法：POST
请求的表单格式：multipart/form-data
请求体中必须包含一个键值对，键的名称是服务器要求的名称，值是文件数据

> HTML5 中，JS 仍然无法随意的获取文件数据，但是可以获取到 input 元素中，被用户选中的文件数据
> 可以利用 HTML5 提供的 FormData 构造函数来创建请求体

```js
<body>
    <img src="" alt="" id="imgAvatar" />
    <input type="file" id="avatar" />
    <button>上传</button>
    <script>
      async function upload() {
        const inp = document.getElementById('avatar');
        if (inp.files.length === 0) {
          alert('请选择要上传的文件');
          return;
        }
        const formData = new FormData(); //构建请求体
        formData.append('imagefile', inp.files[0]);
        const url = 'http://study.yuanjin.tech/api/upload';
        const resp = await fetch(url, {
          method: 'POST',
          body: formData, //自动修改请求头
        });
        const result = await resp.json();
        return result;
      }

      document.querySelector('button').onclick = async function () {
        const result = await upload();
        const img = document.getElementById('imgAvatar');
        img.src = result.path;
      };
    </script>
</body>
```

## 迭代器和生成器

### 迭代器

#### 背景知识

1. 什么是迭代？

从一个数据集合中按照一定的顺序，不断取出数据的过程

2. 迭代和遍历的区别？

迭代强调的是依次取数据，并不保证取多少，也不保证把所有的数据取完

遍历强调的是要把整个数据依次全部取出

3. 迭代器

对迭代过程的封装，在不同的语言中有不同的表现形式，通常为对象

4. 迭代模式

一种设计模式，用于统一迭代过程，并规范了迭代器规格：

- 迭代器应该具有得到下一个数据的能力
- 迭代器应该具有判断是否还有后续数据的能力

#### JS中的迭代器

JS规定，如果一个对象具有next方法，并且该方法返回一个对象，该对象的格式如下：

```js
{value: 值, done: 是否迭代完成}
```

则认为该对象是一个迭代器

含义：

- next方法：用于得到下一个数据
- 返回的对象
  - value：下一个数据的值
  - done：boolean，是否迭代完成





### 可迭代协议 与 for-of 循环

#### 可迭代协议

**概念回顾**

- 迭代器(iterator)：一个具有next方法的对象，next方法返回下一个数据并且能指示是否迭代完成
- 迭代器创建函数（iterator creator）：一个返回迭代器的函数

**可迭代协议**

ES6规定，如果一个对象具有知名符号属性```Symbol.iterator```，并且属性值是一个迭代器创建函数，则该对象是可迭代的（iterable）

> 思考：如何知晓一个对象是否是可迭代的？
> 思考：如何遍历一个可迭代对象？

#### for-of 循环

for-of 循环用于遍历可迭代对象，格式如下

```js
//迭代完成后循环结束
for(const item of iterable){
    //iterable：可迭代对象
    //item：每次迭代得到的数据
}
```

#### 展开运算符与可迭代对象

展开运算符可以作用于可迭代对象，这样，就可以轻松的将可迭代对象转换为数组。



### 生成器 (Generator)

1. 什么是生成器？

生成器是一个通过**构造函数Generator**创建的对象，生成器既是一个迭代器，同时又是一个可迭代对象

2. 如何创建生成器？

生成器的创建，必须使用生成器函数（Generator Function）

3. 如何书写一个生成器函数呢？

```js
//这是一个生成器函数，该函数一定返回一个生成器
function* method(){

}
```

4. 生成器函数内部是如何执行的？

生成器函数内部是为了给生成器的每次迭代提供的数据

每次调用生成器的next方法，将导致生成器函数运行到下一个yield关键字位置

yield是一个关键字，该关键字只能在生成器函数内部使用，表达“产生”一个迭代数据。

5. 有哪些需要注意的细节？

1). 生成器函数可以有返回值，返回值出现在第一次done为true时的value属性中
2). 调用生成器的next方法时，可以传递参数，传递的参数会交给yield表达式的返回值
3). 第一次调用next方法时，传参没有任何意义
4). 在生成器函数内部，可以调用其他生成器函数，但是要注意加上*号


6. 生成器的其他API

- return方法：调用该方法，可以提前结束生成器函数，从而提前让整个迭代过程结束
- throw方法：调用该方法，可以在生成器中产生一个错误