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
>
> ```js
> var arr = [1,3,4]
> const iterator = arr[Symbol.iterator]() //得到一个可迭代对象
> let result = iterator.next()
> // 迭代
> while(!result.done){
>   console.log(result.value)
>   result = iterator.next()
> }
> ```

#### for-of 循环

for-of 循环用于遍历可迭代对象，格式如下

```js
//迭代完成后循环结束
for(const item of iterable){
    //iterable：可迭代对象
    //item：每次迭代得到的数据
  console.log(item)
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
const generator = method() // generator是一个生成器
```

![image-20230221091945634](http://img.buxiaoxing.com/uPic/2023/02/21091945-Y2NDxy-image-20230221091945634.png)

4. 生成器函数内部是如何执行的？

生成器函数内部是为了给生成器的每次迭代提供的数据

每次调用生成器的next方法，将导致生成器函数**运行到下一个yield**关键字位置

**yield**是一个关键字，该关键字只能在生成器函数内部使用，表达“产生”一个迭代数据。

```js
function* test(){
  console.log("第一次运行")
  yield 1
  console.log("第二次运行")
  yield 2
  console.log("第三次运行")
  yield 3

}
const generator = test()
```

 <img src="http://img.buxiaoxing.com/uPic/2023/02/21092914-n4M4mC-image-20230221092914338.png" alt="image-20230221092914338" style="zoom:50%;" />



5. 有哪些需要注意的细节？

1). 生成器函数可以有返回值，**返回值**出现在第一次**done为true**时的value属性中

```js
function* test(){
  console.log("第一步")
  yield 1
  console.log("第二步")
  return 2
  console.log("第三步")
  yield 3
}
const generator = test()
```

 <img src="http://img.buxiaoxing.com/uPic/2023/02/21095533-4Dx3IR-image-20230221095533284.png" alt="image-20230221095533284" style="zoom:50%;" />

2). 调用生成器的next方法时，可以传递参数，传递的参数会交给**yield表达式的返回值**

```js
function* test(){
  let info = yield 1
  console.log(info)
  yield 2+info
}
const generator = test()
```

 <img src="http://img.buxiaoxing.com/uPic/2023/02/21095212-4linVB-image-20230221095212640.png" alt="image-20230221095212640" style="zoom:50%;" />

3). 第一次调用next方法时，传参没有任何意义
4). 在生成器函数内部，可以调用其他生成器函数，但是要注意加上*号

```js
function* t1(){
  yield "a"
  yield "b"
}
function* test(){
  yield *t1()
  yield 1
  yield 2
  yield 3
}
const generator = test()
```

 <img src="http://img.buxiaoxing.com/uPic/2023/02/21100653-JzlEjL-image-20230221100652900.png" alt="image-20230221100652900" style="zoom:50%;" />


6. 生成器的其他API

- return方法：调用该方法，可以**提前结束生成器函数**，从而提前让整个迭代过程结束

  ```js
  function* test(){
    yield 1
    yield 2
    yield 3
  }
  const generator = test()
  ```

   <img src="http://img.buxiaoxing.com/uPic/2023/02/21095822-lb494U-image-20230221095822214.png" alt="image-20230221095822214" style="zoom:50%;" />

- throw方法：调用该方法，可以在**生成器中**产生一个错误



### 生成器实现异步任务控制

```js
function* task(){
  const d = yield 1
  console.log(d)
  const resp = yield fetch("http://101.132.72.36:5100/api/local")
  const result = yield resp.json()
  console.log(result)
}
run(task)
function run (generatorFunc){
  // console.log("run")
  const generator = generatorFunc()
  let result = generator.next() // 启动任务，开始迭代
  handleResult()
  function handleResult(){
    if(result.done){
      return
    }
    // 迭代的数据是一个Promise
    // 等待Promise完成后进行下一次迭代
    if(typeof result.value.then === "function"){
      result.value.then((data)=>{
        console.log("then")
        result = generator.next(data)
        handleResult()
      }).catch((err)=>{
        console.log("catch")
        result = generator.throw(err)
        handleResult()
      })
    }else{
      // 迭代是同步代码，直接进行下一次迭代
      result = generator.next(result.value)
      handleResult()
    }
  }
}
```



## 更多集合类型

### set 集合

> 一直以来，JS只能使用数组和对象来保存多个数据，缺乏像其他语言那样拥有丰富的集合类型。因此，ES6新增了两种集合类型（set 和 map），用于在不同的场景中发挥作用。

**set用于存放不重复的数据**

1. 如何创建set集合

```js
new Set(); //创建一个没有任何内容的set集合

new Set(iterable); //创建一个具有初始内容的set集合，内容来自于可迭代对象每一次迭代的结果

```

2. 如何对set集合进行后续操作

- add(数据): 添加一个数据到set集合末尾，如果数据已存在，则不进行任何操作
  - set使用**Object.is**的方式判断两个数据是否相同，但是，针对+0和-0，set认为是相等
- has(数据): 判断set中是否存在对应的数据
- delete(数据)：删除匹配的数据，返回是否删除成功
- clear()：清空整个set集合
- size: 获取set集合中的元素数量，只读属性，无法重新赋值

3. 如何与数组进行相互转换

```js
const s = new Set([x,x,x,x,x]);
// set本身也是一个可迭代对象，每次迭代的结果就是每一项的值
const arr = [...s];
```

4. 如何遍历

1). 使用for-of循环
2). 使用set中的实例方法forEach

注意：set集合中**不存在下标**，因此**forEach**中的回调的第二个参数和第一个参数是一致的，均表示set中的每一项

```js
// 两个数组的并集、交集、差集 （不能出现重复项），得到的结果是一个新数组
const arr1 = [33, 22, 55, 33, 11, 33, 5];
const arr2 = [22, 55, 77, 88, 88, 99, 99];

//并集
// const result = [...new Set(arr1.concat(arr2))];
console.log("并集", [...new Set([...arr1, ...arr2])]);

const cross = [...new Set(arr1)].filter(item => arr2.indexOf(item) >= 0);
//交集
console.log("交集", cross)

//差集
console.log("差集", [...new Set([...arr1, ...arr2])].filter(item => cross.indexOf(item) < 0))
```

### 手写set

```js
class MySet{
  constructor(iterator = []){
    if(typeof iterator[Symbol.iterator] !== "function"){
      throw new TypeError(`你提供的${iterator}不是一个可迭代对象`)
    }
    this._datas = []
    for (const i of iterator) {
      this.add(i)
    }
  }

  add(data){
    if(!this.has(data)){
      this._datas.push(data)
    }
  }
  has(data){
    for (const i of this._datas) {
      if(this._isEqual(data, i)) return true
    }
    return false
  }
  get size(){
    return this._datas.length
  }

  delete(data){
    for (let i = 0; i < this._datas.length; i++) {
      const element = this._datas[i];
      if(this._isEqual(data, element)){
        this._datas.splice(i, 1)
        return true
      }
    }
    return false
  }

  clear(){
    this._datas.length = 0
  }

  forEach(callback){
    for (const i of this._datas) {
      callback(i, i, this)
    }
  }

  _isEqual(data1, data2){
    if(data1 === 0 && data2 === 0){
      return true
    }
    return Object.is(data1, data2)
  }

  *[Symbol.iterator](){
    for (const i of this._datas) {
      yield i
    }
  }
}
```



### map集合

键值对（key value pair）数据集合的特点：**键不可重复**

map集合专门用于存储多个键值对数据。

在map出现之前，我们使用的是对象的方式来存储键值对，键是属性名，值是属性值。

使用对象存储有以下问题：

1. 键名只能是字符串

2. 获取数据的数量不方便

3. 键名容易跟原型上的名称冲突

   


1. 如何创建map

```js
new Map(); //创建一个空的map
new Map(iterable); //创建一个具有初始内容的map，初始内容来自于可迭代对象每一次迭代的结果，但是，它要求每一次迭代的结果必须是一个 **长度为2的数组** ，数组第一项表示键，数组的第二项表示值
```

2. 如何进行后续操作

- size：只读属性，获取当前map中键的数量
- set(键, 值)：设置一个键值对，键和值可以是任何类型
  - 如果键不存在，则添加一项
  - 如果键已存在，则修改它的值
  - 比较键的方式和Set相同
- get(键): 根据一个键得到对应的值
- has(键)：判断某个键是否存在
- delete(键)：删除指定的键
- clear(): 清空map


3. 和数组互相转换

​		和set一样

4. 遍历

- for-of，每次迭代得到的是一个长度为2的数组
- forEach，通过回调函数遍历
  - 参数1：每一项的值
  - 参数2：每一项的键
  - 参数3：map本身



### 手写map

```js
class MyMap {
  constructor(iterator = []) {
    if (typeof iterator[Symbol.iterator] !== "function") {
      throw new TypeError(`你提供的${iterator}不是一个可迭代对象`)
    }
    this._data = []
    for (const item of iterator) {
      // item 也得是一个可迭代对象
      if (typeof item[Symbol.iterator] !== "function") {
        throw new TypeError(`你提供的${item}不是一个可迭代的对象`);
      }
      const iterator = item[Symbol.iterator]()
      const key = iterator.next().value
      const value = iterator.next().value
      this.set(key, value)
    }
  }
  set(key, value) {
    // 如果存在 key ，则替换值
    // 如果不存在 key ， 则新增一项
    // 比较方式与Set相同
    const obj = this._getObjt(key)
    if(obj){
      obj.value = value
    }else{
      this._data.push({
        key,
        value
      })
    }
  }

  get(key) {
    // 获得key对应的value
    const item = this._getObjt(key)
    if(item) return item.value
    return undefined
  }
  get size() {
    return this._data.length
  }
  has(key) {
    // 判断某个键是否存在
  }

  delete(key) {
    // 删除指定键
    for (let i = 0; i < this._data.length; i++) {
      const element = this._data[i];
      if(this._isEqual(element.key, key)){
        this._data.splice(i, 1)
        return true
      }
    }
    return false
  }
  clear() {
    // 清空map
    this._data.length = 0
  }
  forEach(callback) {
    // 参数1：每一项的值
    // 参数2：每一项的键
    // 参数3： map本身
    for (const i of this._data) {
      callback(i.value, i.key, this)
    }
  }

  has(key){
    return this._getObjt(key) !== undefined
  }

  *[Symbol.iterator](){
    for (const item of this._data) {
      yield [item.key, item.value]
    }
  }

  _getObjt(key){
    for (const item of this._data) {
      if(this._isEqual(key, item)) {
        return item
      }
    }
  }

  _isEqual(data1, data2){
    if(data1 === 0 && data2 === 0){
      return true
    }
    return Object.is(data1, data2)
  }

}
```

### WeakSet 和 WeakMap

#### WeakSet

使用该集合，可以实现和set一样的功能，不同的是：

1. **它内部存储的对象地址不会影响垃圾回收**

   普通集合如果该外部对象设置为null，但由于集合内部可以遍历的到，该对象并不会被垃圾回收。

   Weak集合中，则会被垃圾回收。

   ```js
   let obj = {
     name: "zs",
     age: 12
   }
   const set = new Set()
   set.add(obj)
   obj = null
   console.log(set)
   ```

    <img src="http://img.buxiaoxing.com/uPic/2023/02/21140712-ORvOIB-image-20230221140712098.png" alt="image-20230221140712098" style="zoom:50%;" />

   

2. 只能添加对象

3. 不能遍历（不是可迭代的对象）、没有size属性、没有forEach方法

#### WeakMap

类似于map的集合，不同的是：

1. **它的键存储的地址不会影响垃圾回收**
2. 它的键只能是对象
3. 不能遍历（不是可迭代的对象）、没有size属性、没有forEach方法



## 代理与反射

### 属性描述符

Property Descriptor 属性描述符  是一个普通对象，用于描述一个属性的相关信息

通过```Object.getOwnPropertyDescriptor(对象, 属性名)```可以得到一个对象的某个属性的属性描述符

- value：属性值
- configurable：该属性的描述符是否可以修改
- enumerable：该属性是否可以被枚举
- writable：该属性是否可以被重新赋值

> ```Object.getOwnPropertyDescriptors(对象)```可以得到某个对象的所有属性描述符

如果需要为某个对象添加属性时 或 修改属性时， 配置其属性描述符，可以使用下面的代码:

```js
Object.defineProperty(对象, 属性名, 描述符);
Object.defineProperties(对象, 多个属性的描述符)
```

#### 存取器属性

属性描述符中，如果配置了 **get** 和 **set** 中的任何一个，则该属性，不再是一个普通属性，而变成了存取器属性。

get 和 set配置均为函数，如果一个属性是存取器属性，则读取该属性时，会运行get方法，将get方法得到的返回值作为属性值；如果给该属性赋值，则会运行set方法。

存取器属性最大的意义，在于可以**控制属性的读取和赋值**。



### Reflect

1. Reflect是什么？

Reflect是一个内置的JS对象，它提供了一系列方法，可以让开发者通过调用这些方法，访问一些JS底层功能

由于它类似于其他语言的**反射**，因此取名为Reflect

2. 它可以做什么？

使用Reflect可以实现诸如 属性的赋值与取值、调用普通函数、调用构造函数、判断属性是否存在与对象中  等等功能

3. 这些功能不是已经存在了吗？为什么还需要用Reflect实现一次？

有一个重要的理念，在ES5就被提出：**减少魔法、让代码更加纯粹**

这种理念很大程度上是受到函数式编程的影响

ES6进一步贯彻了这种理念，它认为，**对属性内存的控制、原型链的修改、函数的调用**等等，这些都属于底层实现，属于一种魔法，因此，需要**将它们提取出来，形成一个正常的API，并高度聚合到某个对象**中，于是，就造就了Reflect对象

因此，你可以看到Reflect对象中有很多的API都可以使用过去的某种语法或其他API实现。

4. 它里面到底提供了哪些API呢？

- **Reflect.set(target, propertyKey, value)**: 设置对象target的属性propertyKey的值为value，等同于给对象的属性赋值

  ```js
  const obj = {
    a: 1,
    b: 2
  }
  // obj.a = 10;
  Reflect.set(obj, "a", 10); // 等同于 obj.a = 10
  console.log(Reflect.get(obj, "a"))
  ```

  

- **Reflect.get(target, propertyKey)**: 读取对象target的属性propertyKey，等同于读取对象的属性值

- **Reflect.apply(target, thisArgument, argumentsList)**：调用一个指定的函数，并绑定this和参数列表。等同于函数调用

- **Reflect.deleteProperty(target, propertyKey)**：删除一个对象的属性

- **Reflect.defineProperty(target, propertyKey, attributes)**：类似于Object.defineProperty，不同的是如果配置出现问题，返回false而不是报错

- **Reflect.construct(target, argumentsList)**：用构造函数的方式创建一个对象

- **Reflect.has(target, propertyKey)**: 判断一个对象是否拥有一个属性

- 其他API：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect



### Proxy 代理

代理：提供了修改底层实现的方式，重写Reflect中的逻辑

```js

//代理一个目标对象
//target：目标对象
//handler：是一个普通对象，其中可以重写底层实现
//返回一个代理对象
new Proxy(target, handler)
```

```js
const obj = {
  a: 1,
  b: 2
}

const proxy = new Proxy(obj, {
  set(target, propertyKey, value) {
    // console.log(target, propertyKey, value);
    // target[propertyKey] = value;
    Reflect.set(target, propertyKey, value);
  },
  get(target, propertyKey) {
    if (Reflect.has(target, propertyKey)) {
      return Reflect.get(target, propertyKey);
    } else {
      return -1;
    }
  },
  has(target, propertyKey) {
    return false;
  }
});
// console.log(proxy); // Proxy
// proxy.a = 10;
// console.log(proxy.a);

console.log(proxy.d);
console.log("a" in proxy);
```



### 观察者模式

有一个对象，是观察者，它用于观察另外一个对象的属性值变化，当属性值变化后会收到一个通知，可能会做一些事。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="container"></div>
  <script>
    //创建一个观察者
    function observer(target) {
      const div = document.getElementById("container");
      /* 不用代理创建观察者：会返回两个对象，浪费空间。不会检测到新增的属性  */
      // const ob = {};
      // const props = Object.keys(target);
      // for (const prop of props) {
      //   Object.defineProperty(ob, prop, {
      //     get() {
      //       return target[prop];
      //     },
      //     set(val) {
      //       target[prop] = val;
      //       render();
      //     },
      //     enumerable: true
      //   })
      // }
      const proxy = new Proxy(target, {
        set(target, prop, value){
          Reflect.set(target, prop, value)
          render()
        },
        get(target, prop){
          Reflect.get(target, prop)
        }
      })
      render();

      function render() {
        let html = "";
        for (const prop of Object.keys(target)) {
          html += `
                        <p><span>${prop}：</span><span>${target[prop]}</span></p>
                    `;
        }
        div.innerHTML = html;
      }

      return proxy;
    }
    const target = {
      a: 1,
      b: 2
    }
    const obj = observer(target)
  </script>
</body>

</html>
```



## 增强的数组功能

### 新增的数组API

#### 静态方法

- Array.of(...args): 使用指定的数组项创建一个新数组
- Array.from(arg): 通过给定的 **类数组** 或 **可迭代对象** 创建一个新的数组。

#### 实例方法

- find(callback): 用于查找满足条件的第一个元素
- findIndex(callback)：用于查找满足条件的第一个元素的下标
- fill(data)：用指定的数据填充满数组所有的内容
- copyWithin(target, start?, end?): 在数组内部完成复制
- includes(data)：判断数组中是否包含某个值，使用Object.is匹配



### [扩展]类型化数组

#### 数字存储的前置知识

1. 计算机必须使用**固定的位数**来存储数字，无论存储的数字是大是小，在内存中占用的空间是固定的。

2. n位的无符号整数能表示的数字是2^n个，取值范围是：0 ~ 2^n - 1

3. n位的有符号整数能表示的数字是2^n个，取值范围是：-2^(n-1) ~ 2^(n-1) - 1

4. 浮点数表示法可以用于表示整数和小数，目前分为两种标准：
   1. 32位浮点数：又称为单精度浮点数，它用1位表示符号，8位表示阶码，23位表示尾数
   2. 64位浮点数：又称为双精度浮点数，它用1位表示符号，11位表示阶码，52位表示尾数

5. JS中的所有数字，均使用双精度浮点数保存

#### 类型化数组

类型化数组：用于优化多个数字的存储

具体分为：

- Int8Array： 8位有符号整数（-128 ~ 127）
- Uint8Array： 8位无符号整数（0 ~ 255）
- Int16Array: ...
- Uint16Array: ...
- Int32Array: ...
- Uint32Array: ...
- Float32Array:
- Float64Array

1. 如何创建数组

```js

new 数组构造函数(长度)

数组构造函数.of(元素...)

数组构造函数.from(可迭代对象)

new 数组构造函数(其他类型化数组)

```


2. 得到长度

```js
数组.length   //得到元素数量
数组.byteLength //得到占用的字节数
```

3. 其他的用法跟普通数组一致，但是：

- 不能增加和删除数据，类型化数组的长度固定
- 一些返回数组的方法，返回的数组是同类型化的新数组

#### 负数10进制转2进制

>  10进制转2进制求补码

1. 10进制转2进制

   -129

   ```js
   129 -> 010000001
   ```

2. 求反

   ```js
   010000001 -> 101111110
   ```

3. 加1

   ```js
   101111110 -> 101111111
   ```

**负数2进制转10进制** 也是求反+1（补码）得到正数

```js
101111111 -> 010000000 // 求反
010000000 -> 010000001 // +1
-129
```



### ArrayBuffer

ArrayBuffer：一个对象，用于存储一块固定内存大小的数据。

```js

new ArrayBuffer(字节数)

```

可以通过属性```byteLength```得到字节数，可以通过方法```slice```得到新的ArrayBuffer

```js
//创建了一个用于存储10个字节的内存空间
const bf = new ArrayBuffer(10);

// 截取
const bf2 = bf.slice(3, 5);

console.log(bf, bf2);
```

![image-20230221185148427](http://img.buxiaoxing.com/uPic/2023/02/21185148-mk3ulY-image-20230221185148427.png)

#### 读写ArrayBuffer

1. 使用DataView

通常会在需要混用多种存储格式时使用DataView

```js
//创建了一个用于存储10个字节的内存空间
const bf = new ArrayBuffer(10);

//参数1：ArrayBuffer
//参数2：偏移量
//参数3：获取的字节长度
// 可通过参数2,3控制ArrayBuffer的某些字节
const view = new DataView(bf, 3, 4);

// console.log(view);
// 参数1：值
// 参数2：偏移量（相对于view）
view.setInt16(1, 3);
console.log(view);

console.log(view.getInt16(1));
```

 <img src="http://img.buxiaoxing.com/uPic/2023/02/21195321-iJmBhk-image-20230221195321096.png" alt="image-20230221195321096" style="zoom:50%;" />

2. 使用类型化数组

```js
const bf = new ArrayBuffer(10)
const arr = new Int16Array(bf)
arr[0] = 2344
console.log(arr)
```

 <img src="http://img.buxiaoxing.com/uPic/2023/02/22010625-b2YIrT-image-20230222010624832.png" alt="image-20230222010624832" style="zoom:50%;" />

**注意：**使用setInt16或者Int16Array是两个字节两个字节的操作

实际上，每一个类型化数组都对应一个ArrayBuffer，如果没有手动指定ArrayBuffer，类型化数组创建时，会新建一个ArrayBuffer