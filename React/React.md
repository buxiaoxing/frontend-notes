## React基本介绍

### React基本介绍

React 起源于 *Facebook* 的内部项目，因为该公司对市场上所有 *JavaScript MVC* 框架都不满意，就决定自己写一套，用来架设 Instagram 的网站。

React 的实质其实是一个用于构建用户界面的 JavaScript 库。React 主要用于构建 *UI*。*React* 于 *2013* 年 *5* 月开源，由于拥有较高的性能，代码逻辑简单，越来越多的人已开始关注和使用它。

>*UI* = *fn(state)*

由于 React 的设计思想极其独特，属于革命性创新，性能出众，所以，越来越多的人开始关注和使用，认为它可能是将来 Web 开发的主流工具。

这个项目本身也越滚越大，从最早的 *UI* 引擎变成了一整套前后端通吃的 *Web App* 解决方案。



**React 官网**：*https://reactjs.org/*



React 从诞生到现在，一直在给我们带来各种各样的惊喜。甚至从 2015 年开始，每年都会举行 *React Conf* 大会，介绍 React 本年度所更新的新特性有哪些。

![image-20221027152326265](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2022-10-27-072327.png)

>*React Conf* 官网：*https://conf.reactjs.org/*
>
>*React Conf* 油管视频：*https://www.youtube.com/channel/UC1hOCRBN2mnXgN5reSoO3pQ*



下面介绍一下 React 几个重要版本的重大更新：

- React 16 :出现了 *Fiber*，整个更新变的可中断、可分片、具有优先级
- React 16.8：推出了 *Hooks*，标志着从类组件正式转为函数组件
- React 17：过渡版本，没有添加任何面向开发人员的新功能。而主要侧重于升级简化 React 本身。
- React 18
  - *transition*
  - *Suspense*
  - 新的 *Hooks*
  - *Offscreen*
  - ......

### React特点

在 React 官网中，罗列了 *3* 个特点：

- 声明式
- 组件化
- 一次学习，跨平台编写



除此之外，React 还具有如下的特点：

- 单向数据流
- 虚拟 *DOM*
- *Diff* 算法



### 搭建开发环境

- VScode配置

  emmet配置: 

  ```json
  // include 下
  "javascript": "javascriptreact"
  ```

  VScode插件安装

  - ESLint 代码风格检查

  - ES7+ React/Redux/GraphQL/React-Native snippets 快速代码编写

    `rcc` : 快速构建类组件

    `rfc`: 快速构建函数组件

虽然官方提供了通过 *CDN* 引入 React 的方式：*https://zh-hans.reactjs.org/docs/cdn-links.html*

但是实际开发中肯定是使用 React 的脚手架工具来搭建项目，React 官方提供了脚手架工具 *Create React App*： *https://create-react-app.dev/*

快速开始：

```js
npx create-react-app my-app
cd my-app
npm start
```



## JSX基本语法

### JSX基本语法

在 React 中，使用 *JSX* 来描述页面。

```js
function App() {
  return (
    <div>Hello React~</div>
  );
}
```

你可以把类似于 *HTML* 的代码单独提取出来，例如：

```js
function App() {
  const ele = <div>Hello React~</div>
  return (
    ele
  );
}
```

注意这种类似于 HTML 的语法在 React 中称之为 *JSX*， 这是一种 JavaScript 的**语法扩展**。在 React 中推荐使用 JSX 来描述用户界面。JSX 乍看起来可能比较像是模版语言，但事实上它完全是在 JavaScript 内部实现的。



使用 JSX 来描述页面时，有如下的一些语法规则：

- **根元素只能有一个**
- JSX 中使用 JavaScript 表达式。**表达式**写在花括号 *{}* 中
- **属性值**指定为字符串字面量，或者在属性值中插入一个 JavaScript 表达式
- style 对应样式对象，class 要写作 *className*
- 注释需要写在花括号
- JSX 允许在模板中插入**数组**，数组会自动展开所有成员



### *createElement* 方法

JSX 是一种 JavaScript 的语法扩展，*Babel* 会把 JSX 转译成一个名为 *React.createElement* 函数调用。

```js
React.createElement(type, [props], [...children]);
```

参数说明：

- *type*：创建的 React 元素类型（可选的值有：标签名字符串、React 组件）。
- *props*（可选）：React 元素的属性。
- *children*（可选）：React 元素的子元素。

例如，下面两种代码的作用完全是相同的：

```js
const element1 = (
    <h1 className="greeting">
    	Hello, world!
    </h1>
);
const element2 = React.createElement(
    'h1',
    {className: 'greeting'},
    'Hello, world!'
);
```

这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。

可以看出，*JSX* 的本质其实就是 *React.createElement* 方法的一种语法糖。

## 组件与事件绑定

### React中的组件

在 React 中，可以使用**类**的方式来声明一个组件。

```js
class 类名 extends React.Component{
  render(){
    return (
    	// 一段 JSX
    )
  }
}
```



除了类组件，React 中还支持使用**函数**来创建组件，同样需要**返回一段 JSX**，来表示这个组件的 UI 是什么样的。

```js
function 组件名(){
  return (
  	// 一段 JSX
  );
}
```

早期的函数组件被称之为**无状态组件**，一般仅仅用来做纯 UI 的展示，里面不会有复杂的逻辑。

但是从 React 16.8 推出 *Hooks* 后，现在更多的是使用函数组件了。

这不仅仅是语法的改变，同时也代表着整个 React 编程思想的一种转变。



### 为组件绑定事件

在 React 中绑定事件的写法如下：

```react
<button onClick={activateLasers}>Activate Lasers</button>
```

在 React 中无法通过 return false 来**阻止默认行为**，所以只有使用 *e.preventDefault* 的方式来阻止默认行为。

```react
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

如果是类组件，那么事件处理函数写作一个类方法。

```react
class Welcome extends React.Component {
  // 事件处理函数
  eventHandler(e){
    window.alert('Hello');
    e.preventDefault();
  }
  
  render() {
    return (
      <a href="https://www.baidu.com/" onClick={this.eventHandler}>this is a test</a>
    );
  }
}
```

在 React 的事件处理函数中所传入的事件对象，是一个**合成事件对象**。

React 也提供了访问**原生事件对象**的方式。如下：

```react
eventHandler(e){
    e.nativeEvent // 原生事件对象
}
```

### this的指向

由于 JS 中 this 的特殊性，事件处理函数中的 this 并不会指向当前的组件，这就需要我们自行对 this 进行指向的修正。

这里介绍 3 种解决方式：

- 将事件处理函数修改为**箭头函数**
- 将事件绑定修改为箭头函数
- 使用 *bind* 方法来强制绑定 this 的指向



### 向事件处理程序传参

另外还有一个非常重要的问题，就是如何向事件处理函数传递参数。

如果要传递参数，可以使用下面的两种方式来进行传参：

- 通过 *bind* 方法在绑定 this 指向时向事件处理函数进行传参

- 绑定事件时，通过书写**箭头函数**的形式来传参

  ```jsx
  onClick={(e)=>eventHandler("Hello333",e)}
  ```

### HOC(高阶组件)

> HOF(高阶函数) Higher-Order Function：以函数作为参数，并返回一个函数
>
> HOC：以组件作为参数，返回一个组件

通常，可以利用 HOC 实现**横切**关注点

可以通过高阶组件**增加组件的功能**

**注意**

1. 不要在render中使用高阶组件
2. 不要在高阶组件内部更改传入的组件

### Ref

使用场景：希望直接使用**dom元素**中的某个方法，或者希望直接使用**自定义组件**中的某个方法。

1. Ref 作用于内置的 html 组件，得到的是真实的 dom 对象
2. ref 作用与类组件，得到的将是类的实例
3. ref **不能作用与函数组件**(函数组件只能使用hooks)

**ref赋值的方式**

1. 字符串

   ref不在推荐使用字符串赋值，字符串赋值的方式将来可能被移除

    <img src="http://img.buxiaoxing.com/uPic/2023/02/25234440-UbBHUH-image-20230225234439802.png" alt="image-20230225234439802" style="zoom:50%;" />

2. 对象

   通过 `React.createRef` 函数创建

    <img src="http://img.buxiaoxing.com/uPic/2023/02/25234858-Wl6nkA-image-20230225234858584.png" alt="image-20230225234858584" style="zoom:50%;" />

3. 函数

    <img src="http://img.buxiaoxing.com/uPic/2023/02/25235244-rSX4Li-image-20230225235243922.png" alt="image-20230225235243922" style="zoom:50%;" />

   **函数的调用时间**

   1. *componentDidMount*(该生命周期内可以使用)的时候会调用该函数

   2. 如果 ref 的值发生了变动（旧的函数被新的函数替代），会分别调用旧的函数和新的函数，时间点出现在 *componentDidUpdate* 之前

      旧的函数被调用时，传递null

      新的函数被调用时，传递对象(dom或者类实例)

   3. Ref 所在的组件被**卸载**，会调用对象

**谨慎使用Ref**

能够使用属性和状态进行控制，就不要使用ref（与react声明式渲染的理念不符）

两种情况可以使用

1. 需要调用真实 dom 对象中的方法
2. 需要调用类组件的方法



#### Ref 转发

> Ref 转发是一项将 [ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 自动地通过组件传递到其一子组件的技巧(即可以拿到*子子组件*的dom)

**React.forwardRef**

1. 转发的必须是*函数组件*，不能是类组件，函数组件必须有第二个参数来得到ref

   类组件可以通过普通属性（不能使用ref）传递进去。

2. 返回值，返回一个新的组件

   ```jsx
   function A(props, ref){
     return <h1 ref={ref}>
       A
     </h1>
   }
   
   class B extends React.Component{
   
     render(){
       return (
         <h1 ref={this.props.forwardRef}>
           B
         </h1>
       )
     }
   }
   
   // 函数组件转发
   const NewA = React.forwardRef(A)
   // 类组件转发(嵌套一层函数组件)
   const NewB = React.forwardRef((props, ref)=>(
     <B forwardRef={ref}></B>
   ))
   export default class ForwardRef extends Component {
     ARef = React.createRef()
     BRef = React.createRef()
     componentDidMount(){
       console.log(this.ARef)
       console.log(this.BRef)
     }
     render() {
       return (
         <div>
           <NewA ref={this.ARef} />
           <NewB ref={this.BRef} />
         </div>
       )
     }
   }
   ```



### React中的事件

> 这里的事件指React内置的 DOM 组件的事件
>
> React 中的 div p这些组件都是 React 自定定义的虚拟dom，并不是真实 dom

1. React 中的事件几乎都通过事件委托注册在 *document* 上的

   - 如果给真实 DOM 注册事件，阻止了事件冒泡，会导致 react 的相应事件无法触发
   - 如果给真实 DOM 注册事件，事件会先于 React 事件运行
   - 一些不冒泡的事件，直接在元素上监听
   - 一些 *document* 上面没有的事件，直接在元素上监听（play focus）

2. React 的事件参数，并非真实 DOM 事件参数，是React合成的一个对象，该对象类似于正式 DOM 事件参数

   - *stopPropagation*，阻止事件在虚拟 dom 树中冒泡(虚拟dom树的事件处理函数应该是放在一个队列中的，document在处理事件时会遍历这个队列，如果队列中的某项阻止的事件冒泡，事件参数有*isPropagationStopped*函数判断是否阻止了事件冒泡，则不会再往后遍历)

   - 可以通过 *nativeEvent*，获取到真实的DOM事件对象

     可以通过 *nativeEvent.stopImmediatePropagation()* 阻止 document 上剩余事件的执行。

   - 为了提高执行效率，React使用事件对象池来处理事件对象（*事件对象会被重用*，事件函数结束后，该事件对象就会清空，所以在事件处理函数中，不要异步使用事件对象）

     可以通过 *persist()* 函数让此事件对象持久化，但会影响执行效率

     

## 组件状态与数据传递

### 组件状态

早期类组件被称之为**有状态组件**，就是因为在类组件中能够维护组件数据。

```js
class 类名 extends React.Component{
  constructor(){
    super();
    // 设置组件自身的数据状态
    this.state = {
      xxx : xxx
    }
  }
  render(){
    return (
    	// 通过 {this.state.xxx} 来获取状态数据
    )
  }
}

// 或者
class 类名 extends React.Component{
  state = {
      xxx : xxx
  }
  render(){
    return (
    	// 通过 {this.state.xxx} 来获取状态数据
    )
  }
}
```



不要直接去修改状态值，而是应该通过 *setState* 方法修改组件的 state 状态数据。

```js
this.setState({
  xxx: 新值
})
```

*setState*，它对状态的改变，**可能**是异步的。

> 如果改变状态的代码处于某个 *HTML* 元素的**事件**中，则其是异步的，否则是同步



如果在事件处理函数里面想拿到 setState 执行后的数据，可以提前使用一个变量来存储计算结果，或者使用 **setState 的第二个参数**，它是一个函数，这个函数会在 state **更新后被调用**。



最佳实践：

1. 把所有的 setState 当作是异步的
2. 永远不要信任 setState 调用之后的状态
3. 如果要使用改变之后的状态，需要使用**回调函数**（setState 的第二个参数）
4. 如果新的状态要根据之前的状态进行**运算**，使用函数的方式改变状态（setState 的第一个函数）



React 会对异步的 setState 进行优化，将**多次 setState 进行合并**(浅合并 *Object.assign* )（将多次状态改变完成后，再统一对 *state* 进行改变，然后触发 *render*）





### props

和 Vue 一样，在 React 中组件会存在层级关系，那么自然会涉及到组件之间进行数据的传递。

如果是**父组件向子组件传递数据**，则使用 props。

**Props 的只读性**:组件无论是使用 函数声明还是通过 class 声明，都绝不能修改自身的 props

如果是函数组件，props 作为函数的一个参数传入：

```react
function 组件名(props) {
  return (
    // 一段 JSX
    // 通过 props.xxx 获取传入的值
    <div>
      <p>姓名：{props.name}</p>
      <p>年龄：{props.age}</p>
      <p>性别：{props.gender}</p>   
    </div>
  );
}
```

如果是类组件，则需要在 *constructor* 中将 props 通过 *super* 传递给父类，然后通过 *this.props* 的方式来获取传入的值：

```react
class 组件名 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
       // 一段 JSX
    	 // 通过 this.props.xxx 获取传入的值
        <div>
          <p>姓名：{this.props.name}</p>
          <p>年龄：{this.props.age}</p>
          <p>性别：{this.props.gender}</p>   
        </div>
     );
	}
}
```



通过 *props.children*，可以实现类似于 Vue 中插槽的功能，例如：

```react
class 组件B extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
          {this.props.children}
      </div>
    );
  }
}
class 组件A extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <组件B>
        <p>Hello, React</p>
        <p>Hello, Redux</p>
        <p>Hello, Facebook</p>
        <p>Hello, Google</p>
      </组件B>
    );
  }
}
```

### props验证

在 Vue 中，可以对传入的 props 设置**默认值**，以及验证 props 的有效性，在 React 中，针对 props 也可以做这些事。

通过 *defaultprops* 就可以对 props 设置默认值。

```react
function Greeting(props) {
  const { name, age, gender } = props;
  return (
    <div>
      <p>姓名：{name}</p>
      <p>年龄：{age}</p>
      <p>性别：{gender}</p>   
    </div>
   );
}
// 设置默认的 props 值，当组件没有传值时会使用默认值
Greeting.defaultProps = {
  name : 'xiejie',
  age : 18,
  gender : 'male'
};
```

```react
class Greeting extends React.Component {
  constructor(props) {
    super(props);
  }
  // 设置默认的 defaultProps 属性值
  static defaultProps = {
    name : "xiejie",
    age : 18,
    gender : 'male' 
  }
  render() {
    return (
      <div>
        <p>姓名：{this.props.name}</p>
        <p>姓名：{this.props.age}</p>
        <p>姓名：{this.props.gender}</p>
      </div>
    );
  }
}
// 或者
Greeting.defaultProps = {
    name : "xiejie",
    age : 18,
    gender : 'male' 
}
```



关于 props 的类型检查，从 React v15.5 版本开始，移入到了 [`prop-types` 库](https://www.npmjs.com/package/prop-types) 。

```react
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

```react
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```

### 状态提升

在 Vue 中，父传子通过 *props*，子传父通过触发自定义事件。

在 React 中，如果**子组件需要向父组件传递数据**，同样是通过触发父组件传递给子组件的事件来进行传递。

这在官网中被称之为“状态提升”：*https://zh-hans.reactjs.org/docs/lifting-state-up.html*

汇率转换案例：

父组件

```react
import React from "react";
import Money from "./component/Money";

// 类组件
class App extends React.Component {
  state = {
    dollar: "",
    rmb: ""
  }

  transformToRMB = (value) => {
    if (parseFloat(value) || value === "" || parseFloat(value) === 0) {
      this.setState({
        dollar: value,
        rmb: value === "" ? "" : (value * 7.3255).toFixed(2)
      })
    } else {
      alert("请输入数字");
    }
  }

  transformToDollar = (value) => {
    if (parseFloat(value) || value === "" || parseFloat(value) === 0) {
      this.setState({
        dollar: value === "" ? "" : (value * 0.1365).toFixed(2),
        rmb: value
      })
    } else {
      alert("请输入数字");
    }
  }

  render() {
    return (
      <div>
        <Money text="美元" money={this.state.dollar} transform={this.transformToRMB} />
        <Money text="人民币" money={this.state.rmb} transform={this.transformToDollar} />
      </div>
    )
  }

}

export default App;
```

子组件

```react
import React from 'react';

function Money(props) {


    function handleChange(e){
       // 在子组件中，要做的事情很简单，将用户数据的值，传递给父组件
       // 让父组件来进行修改
       props.transform(e.target.value);
    }


    return (
        <fieldset>
            <legend>{props.text}</legend>
            <input type="text" value={props.money} onChange={handleChange}/>
        </fieldset>
    );
}

export default Money;
```

**react是 *自上而下* 的数据流**(单向数据流)

任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“*低于*”它们的组件

如果你把一个以组件构成的树想象成一个 props 的**数据瀑布**的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动



### Context

> 上下文：Context，表示做一些事的环境

**React上下文的特点**

1. 当某个组件创建了上下文后，上下文中的数据，会被所有**后代组件共享**
2. 如果某个组件依赖了上下文，会导致该**组件不再纯粹**（外部数据仅来源于属性props）
3. 一般情况下，用于第三方组件（通用组件）

#### 旧版API

**创建上下文**

只有类组件才可以*创建*上下文

1. 给类组件书写静态属性 *childContextTypes*，使用该属性对上下文中的数据类型进行约束

2. 添加实例方法 *getChildContext*，该方法返回的对象，即为上下文中的数据，该数据必须满足类型约束，该方法会在**每次render之后运行**。

    <img src="http://img.buxiaoxing.com/uPic/2023/02/28005359-TZuxN2-image-20230228005359752.png" alt="image-20230228005359752" style="zoom:50%;" />

**使用上下文的数据**

要求：如果要使用上下文中的数据，组件必须有一个静态属性 *contextTypes*，该属性描述了需要获取的上下文中的数据类型

多个上下文时获取**除本身外最近的**上下文

1. 可以在组件的构造函数中，通过*第二个参数*，获取上下文数据

2. 从类组件的 *context属性* 中获取

    <img src="http://img.buxiaoxing.com/uPic/2023/02/28005333-HJB9D4-image-20230228005333487.png" alt="image-20230228005333487" style="zoom:50%;" />

3. 在函数组件中，通过*第二个参数*，获取上下文数据

    <img src="http://img.buxiaoxing.com/uPic/2023/02/28005305-OhLVGG-image-20230228005305528.png" alt="image-20230228005305528" style="zoom:50%;" />

**上下文数据变化**

上下文中的数据不可以直接变化，最终都是通过**状态**改变

在上下文中加入一个处理函数，可以用于后代组件更改上下文的数据

#### 新版API

> 旧版API存在严重的效率问题，并且容易导致滥用(*多级上下文时会就近覆盖*)

**创建上下文**

上下文时一个独立于组件的对象，使用 `React.createContext(默认值)` 创建，返回的是一个包含*两个属性*的对象。

 <img src="http://img.buxiaoxing.com/uPic/2023/03/05105442-QLXKKU-image-20230305105441860.png" alt="image-20230305105441860" style="zoom:50%;" />

1. *Provider*: 生产者。一个组件，该组件会创建一个上下文，该组件有一个 value 属性，通过该属性，可以为其数据赋值

   同一个Provider，不要用到多个组件中，如果需要再其他组件中使用该上下文数据，应该考虑将上下文数据*提升*到更高的层次

    <img src="http://img.buxiaoxing.com/uPic/2023/03/05105415-38yeo7-image-20230305105415785.png" alt="image-20230305105415785" style="zoom:50%;" />

2. *Comsumer*属性：也是一个组件，可以使用Consumer来获取上下文数据

**使用上下文**

1. 在类组件中，直接使用*this.context*获取上下文数据
   1. 要求：必须拥有静态属性 *contextType* , 应赋值为创建的上下文对象
   
    <img src="http://img.buxiaoxing.com/uPic/2023/03/05105345-Hjn8qV-image-20230305105345320.png" alt="image-20230305105345320" style="zoom:50%;" />
2. 在函数组件中，需要使用*Consumer*来获取上下文数据（类组件也可以通过这种方式获取）
   1. Consumer是一个组件
   2. 它的子节点，是一个函数（它的props.children需要传递一个函数）
   
    <img src="http://img.buxiaoxing.com/uPic/2023/03/05105659-HNMRon-image-20230305105659458.png" alt="image-20230305105659458" style="zoom:50%;" />

**注意细节**

如果，上下文提供者（Context.Provider）中的*value*属性发生变化(*Object.is*比较)，会导致该上下文提供的*所有后代元素全部重新渲染*，无论该子元素是否有优化（无论shouldComponentUpdate函数返回什么结果）



#### 使用Context封装表单组件

> 我们在使用表单的时候需要让每一个组件受控，但我们其实只关心最后提交的数据。可以使用Context完成表单的封装。

Form.js

 <img src="http://img.buxiaoxing.com/uPic/2023/03/05193411-8E0CB4-image-20230305193411861.png" alt="image-20230305193411861" style="zoom:50%;" />

Input.js

 <img src="http://img.buxiaoxing.com/uPic/2023/03/05193506-n6Qvxl-image-20230305193506788.png" alt="image-20230305193506788" style="zoom:50%;" />



### Render props

> 有时候，某些组件的各种功能及其处理逻辑几乎完全相同，只是显示的界面不一样，建议下面的方式任选其一解决重复代码的问题（横切关注点）

1. render props

   1. 某个组件，需要某个属性
   2. 该属性是一个函数，函数的返回值用于渲染
   3. 函数的参数会传递为需要的数据
   4. 通常使用的props名为render（任何属性名都可以）

    <img src="http://img.buxiaoxing.com/uPic/2023/03/06014331-EFYVxj-image-20230306014331557.png" alt="image-20230306014331557" style="zoom:50%;" />

    <img src="http://img.buxiaoxing.com/uPic/2023/03/06014401-pNWReZ-image-20230306014401123.png" alt="image-20230306014401123" style="zoom:50%;" />

2. HOC

      <img src="http://img.buxiaoxing.com/uPic/2023/03/06015037-OUdcsf-image-20230306015037764.png" alt="image-20230306015037764" style="zoom:50%;" />

      <img src="http://img.buxiaoxing.com/uPic/2023/03/06015101-wERDNL-image-20230306015101104.png" alt="image-20230306015101104" style="zoom:50%;" />

## 表单

### 受控组件

无论是学习 Vue，还是 React，最重要的是要转换思想，这一步非常重要，往往也比较困难。

在以前 jQuery 时代，开发人员需要获取到 *DOM* 节点，然后进行操作。而在现代前端开发中，采用的是 *MVVM* 的模式，将视图和视图模型进行绑定，**视图模型的改变，会自然的带来视图的**改变。开发人员需要专注在视图模型上面。



因此，这里所谓的受控组件，本质上其实就是将表单中的控件和视图模型（状态）进行绑定，之后都是针对状态进行操作。

下面，我们来看一些具体的案例：

- 一个基本的受控组件

```react
import React from "react";

// 类组件
class App extends React.Component {
  state = {
    value : ""
  }

  handleChange = (e) => {
    this.setState({
      value : e.target.value
    })
  }

  clickHandle = () => {
    // 提交整个表单
    console.log(`你要提交的内容为：${this.state.value}`);
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.value} onChange={this.handleChange}/>
        <button onClick={this.clickHandle}>提交</button>
      </div>
    )
  }

}

export default App;
```

- 对用户输入的内容进行限制

```react
import React from "react";

// 类组件
class App extends React.Component {
  state = {
    value1 : "",
    value2 : ""
  }

  handleChange = (e) => {
   const name = e.target.name;
   switch(name){
    case "one": {
      // 用户输入的是第一个输入框
      // 只能输入大写
      this.setState({
        value1 : e.target.value.toUpperCase()
      })
      break;
    }
    case "two":{
      // 用户输入的是第二个输入框
      // 只能输入数字
      const newValue = e.target.value.split("").map(item=>{
        if(!isNaN(item)){
          return item
        }
      }).join("");
      this.setState({
        value2 : newValue
      })
      break;
    }
   }
  }

  clickHandle = () => {
    // 提交整个表单
    console.log(`你要提交的内容为：${this.state.value}`);
  }

  render() {
    return (
      <div>
        <input
          type="text"
          name="one"
          value={this.state.value1}
          onChange={this.handleChange}
          placeholder="自动转为大写"
        />
        <input
          type="text"
          name="two"
          value={this.state.value2}
          onChange={this.handleChange}
          placeholder="只能输入数字"
        />
        <button onClick={this.clickHandle}>提交</button>
      </div>
    )
  }

}

export default App;
```

- **文本域**

```react
import React from "react";

// 类组件
class App extends React.Component {
  state = {
   value : ""
  }

  handleChange = (e) => {
   this.setState({
    value : e.target.value
   })
  }

  clickHandle = () => {
    // 提交整个表单
    console.log(`你要提交的内容为：${this.state.value}`);
  }

  render() {
    return (
      <div>
        <textarea 
          cols="30" 
          rows="10" 
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button onClick={this.clickHandle}>提交</button>
      </div>
    )
  }

}

export default App;

```

- **多选框**

```react
import React from "react";

// 类组件
class App extends React.Component {
  state = {
    checkBoxs: [
      { content: "html", checked: false },
      { content: "css", checked: false },
      { content: "js", checked: false },
      { content: "vue", checked: false },
      { content: "react", checked: false },
    ],
  }

  handleChange = (index) => {
    const arr = [...this.state.checkBoxs];
    arr[index].checked = !arr[index].checked;
    this.setState({
      checkBoxs: arr
    })
  }

  clickHandle = () => {
    // 提交整个表单
    console.log(this.state.checkBoxs);
  }

  render() {
    return (
      <div>
        <div>
          {
            this.state.checkBoxs.map((item, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={item.content}
                  checked={item.checked}
                  onChange={()=>this.handleChange(index)}
                />
                <span>{item.content}</span>
              </div>
            ))
          }
        </div>
        <button onClick={this.clickHandle}>提交</button>
      </div>
    )
  }

}

export default App;
```

- 下拉列表

```react
import React from "react";

// 类组件
class App extends React.Component {
  state = {
    value : "html"
  }

  handleChange = (e) => {
    this.setState({
      value : e.target.value
    })
  }

  clickHandle = () => {
    // 提交整个表单
    console.log(this.state.value);
  }

  render() {
    return (
      <div>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="js">JS</option>
          <option value="vue">Vue</option>
          <option value="react">React</option>
        </select>
        <button onClick={this.clickHandle}>提交</button>
      </div>
    )
  }

}

export default App;
```

### 非受控组件

大多数情况下，在 React 中推荐使用受控组件来对表单进行操作，这样能够对表单控件的数据进行一个统一管理。

但是在某些特殊情况下，需要使用以前传统的 DOM 方案进行处理，此时替代的方案就是非受控组件。

- 非受控组件基本示例

```react
import React from "react";

// 类组件
class App extends React.Component {
 
  constructor(){
    super();
    // 创建了一个 ref，回头我们就可以获取到和该 ref 绑定了的 DOM 节点
    this.inputCon = React.createRef();
  }

  clickHandle = () => {
    // 通过 this.inputCon.current 可以获取到 input DOM 节点
    console.log(this.inputCon.current.value);
  }


  render() {
    return (
      <div>
        <input type="text" ref={this.inputCon}/>
        <button onClick={this.clickHandle}>获取用户输入的内容</button>
      </div>
    )
  }

}

export default App;

```

- 非受控组件的**默认值**

```react
<div>
  {/* 一旦你用了 value，React 会认为你这是一个受控组件 */}
  {/* 如果想要给默认值，使用 defaultValue */}
  <input type="text" ref={this.inputCon} defaultValue="123"/>
  <button onClick={this.clickHandle}>获取用户输入的内容</button>
</div>
```

- 文件上传

```react
import React from "react";

// 类组件
class App extends React.Component {

  constructor() {
    super();
    // 创建 ref 的时候，命名一般采用 xxxRef 结尾
    this.uploadRef = React.createRef();
  }

  clickHandle = () => {
    // 通过 this.uploadRef.current 可以获取到 input DOM 节点
    console.log(this.uploadRef.current.files);
  }


  render() {
    return (
      <div>
        <input type="file" ref={this.uploadRef}/>
        <button onClick={this.clickHandle}>获取用户输入的内容</button>
      </div>
    )
  }

}

export default App;

```



关于受控组件和非受控组件，可以参阅：*https://goshacmd.com/controlled-vs-uncontrolled-inputs-react/*

## 生命周期

### 什么是生命周期

所谓生命周期，指的是组件从**诞生到销毁**会经历一系列的过程，该过程就叫做生命周期。

React 在组件的生命周期中提供了一系列的**钩子函数**（类似于事件），可以让开发者在函数中注入代码，这些代码会在适当的时候运行。

**生命周期钩子函数是属于类组件所独有的东西**，但是从 React 16.8 推出 *Hooks* 以来，整体已经开始以函数组件为主，因此这里我们仅介绍一些常用的生命周期钩子函数。

![image-20230225104357254](http://img.buxiaoxing.com/uPic/2023/02/25104357-zR1I17-image-20230225104357254.png)

完整的生命周期图谱，可以参阅官网：*https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/*

![image-20230305231743621](http://img.buxiaoxing.com/uPic/2023/03/05231743-JyGAOT-image-20230305231743621.png)

### 常用的生命周期钩子函数

有关生命周期钩子函数的介绍，可以参阅官网：*https://zh-hans.reactjs.org/docs/react-component.html*

官网中在介绍这些钩子函数时，也是分为了**常用**和**不常用**两大块来介绍的。

常用的生命周期钩子函数如下：

- *constructor*
  - 同一个组件对象只会创建一次
  - 不能在第一次挂载到页面之前，调用 *setState*，为了避免问题，构造函数中严禁使用 *setState*

- *render*
  - render 是整个类组件中必须要书写的生命周期方法
  - 返回一个*虚拟 DOM*，会被挂载到虚拟 DOM 树中，最终渲染到页面的真实 DOM 中
  - render 可能不只运行一次，只要**需要重新渲染，就会重新运行**
  - 严禁使用 *setState*，因为可能会导致无限递归渲染

```react
import React from "react";

// 类组件
class App extends React.Component {

  constructor() {
    super();
    // 主要做一些初始化操作，例如该组件的状态
    this.state = {
      value : 1
    }
    console.log("constructor");
  }


  clickHandle=()=>{
    this.setState({
      value : this.state.value + 1
    })
  }

  render() {
    console.log("render");
    return (
      <div>
        <div>{this.state.value}</div>
        <button onClick={this.clickHandle}>+1</button>
      </div>
    )
  }

}

export default App;

```

- *componentDidMount*
  - 类似于 Vue 里面的 mounted
  - 只会执行**一**次
  - 可以使用 setState
  - 通常情况下，会将*网络请求、启动计时器*等一开始需要的操作，书写到该函数中
- *componentWillUnmount*
  - 通常在该函数中**销毁一些组件依赖的资源**，比如计时器

### PureComponent

> 纯组件，用于避免不必要的渲染（运行render函数），从而提高效率

**父组件重新渲染会导致所有子组件重新渲染**

优化：如果一个组件的属性和状态，都没有发生变化，该组件是没有必要重新渲染的

新挂在的组件不会运行 `shouldComponentUpdate` ，只有更新的组件会运行

 <img src="http://img.buxiaoxing.com/uPic/2023/03/06002142-TnryCH-image-20230306002142019.png" alt="image-20230306002142019" style="zoom:50%;" />

`PureComponent` 是一个组件，如果某个组件继承自该组件，则该组件的 `shouldComponentUpdate` 会进行优化，对属性和状态进行浅比较，如果相等，则不会重新渲染。

 <img src="http://img.buxiaoxing.com/uPic/2023/03/06003804-wuI1f2-image-20230306003803987.png" alt="image-20230306003803987" style="zoom:50%;" />

**注意**

1. `PureComponent` 进行的是浅比较，

   1. 为了效率，应该尽量使用 `PureComponent`
   2. 要求不要改动之前的状态，永远创建**新的状态**，覆盖之前的状态。（*Immutable*，不可变对象）
   3. 有一个第三方JS库，Immutable.js，专门用于制作不可变对象。

2. 函数组件使用 `React.memo` 函数制作纯组件。

    <img src="http://img.buxiaoxing.com/uPic/2023/03/06004252-57hoen-image-20230306004252664.png" alt="image-20230306004252664" style="zoom:50%;" />

   **memo**其实就是一个高阶函数，包了一层纯类组件

    <img src="http://img.buxiaoxing.com/uPic/2023/03/06004354-1VWxjv-image-20230306004354816.png" alt="image-20230306004354816" style="zoom:50%;" />



## Hooks

### Hooks基本介绍

> Hook 是 *React 16.8* 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。



Hooks 的出现，首先能解决如下的一些问题：

- 告别令人疑惑的**生命周期**
  
  例如下面的例子，相同的代码在不同的生命周期中存在了两份


```react
import React from "react";

// 类组件
class App extends React.Component {

  constructor() {
    super();
    this.state = {
      count : 0
    }
  }

  componentDidMount(){
    document.title = `你点击了${this.state.count}次`;
  }

  componentDidUpdate(){
    document.title = `你点击了${this.state.count}次`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    )
  }
}

export default App;

```

- 告别类组件中烦人的 *this*
  - 在类组件中，会存在 this 的指向问题，例如在事件处理函数中，不能直接通过 this 获取组件实例，需要修改 this 指向
- 告别繁重的类组件，回归前端程序员更加熟悉的函数



另外，Hooks 的出现，还有更加重要的一个信号，那就是整个 React 思想上面的转变，从“面向对象”的思想开始转为“**函数式编程**”的思想。这是编程范式上面的转变。

编程范式：

- 命令式编程：告诉计算机怎么做（*How*），我们需要给计算机指明每一个步骤
  - 面向过程
  - 面向对象
- 声明式编程：告诉计算机我要什么（*What*）
  - 函数式编程
  - *DSL*（领域专用语言，*HTML、CSS、SQL*）

声明式编程并不是新的产物，它是和命令式编程同期出现的。但是，早期更加流行命令式编程。不过随着近几年整个项目工程越来越复杂，以前的命令式编程就有点力不从心，所以现在慢慢开始流行声明式编程。



因此当你学习 Hooks 的时候，会发现突然多了一些以前不熟悉的概念，例如：纯函数、副作用、柯里化、高阶函数等概念。

当然，你可能好奇“面向对象”和“函数式编程”有什么区别，这里推荐一篇文章：

*https://www.imaginarycloud.com/blog/functional-programming-vs-oop/*



Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 React 的**函数组件中**调用 Hook。不要在其他 JavaScript 函数中调用。

### *useState*

> 为函数组件**添加状态**



*useState* 包含以下的知识点：

- 基本使用

```react
import { useState } from 'react';

function App(props) {

  let [count, setCount] = useState(0);

  function clickhandle(){
    setCount(++count);
  }

  return (
    <div>
      <div>{count}</div>
      <button onClick={clickhandle}>+1</button>
    </div>
  );
}

export default App;

```

- 声明多个 *state* 状态，个函数组件中可以有多个状态，这种做法非常有利于横向切分关注点

```react
import { useState } from 'react';

function App(props) {

  let [age, setAge] = useState(18);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);

  function clickhandle(){
    setAge(++age);
  }


  return (
    <div>
      <div>年龄：{age}</div>
      <div>水果：{fruit}</div>
      <div>待办事项：{todos[0].text}</div>
      <button onClick={clickhandle}>+1</button>
    </div>
  );
}

export default App;
```

- **注意的细节**
  1. useState最好写到函数的起始位置，便于阅读
  2. useState严禁出现在代码块（判断、循环）中
  3. useState返回的函数（数组的第二项），*引用不变*（节约内存空间）
  4. 使用函数改变数据，若数据和之前的数据完全相等（使用*Object.is*比较），不会导致重新渲染，以达到优化效率的目的。
  5. 使用函数改变数据，传入的值不会和原来的数据进行合并，而是*直接替换*。
  6. 如果要实现*强制刷新*组件
     1. 类组件：使用*forceUpdate*函数
     2. 函数组件：使用一个空对象的*useState*
  7. **如果某些状态之间没有必然的联系，应该分化为不同的状态，而不要合并成一个对象**
  8. 和类组件的状态一样，函数组件中*改变状态可能是异步的*（在DOM事件中），*多个状态变化会合并以提高效率*，此时，不能信任之前的状态，而应该使用回调函数的方式改变状态。如果状态*变化要使用到之前的状态，尽量传递函数*。

### *useEffect*

> 处理函数**副作用**

*useEffect* 包含以下知识点：

- **副作用**的概念

  - 纯函数：一个确切的参数在你的函数中运行后，一定能得到一个确切的值，例如下面的例子：

  ```js
  function test(x){
    return x * 2;
  }
  
  x => 2 ===> 4
  x => 3 ===> 6
  ```

  - 如果一个函数中，存在副作用，那么我们就称该函数不是一个纯函数，所谓副作用，就是指*函数的结果是不可控，不可预期*。

  - 常见的副作用有发送网络请求、添加一些监听的注册和取消注册，手动修改 DOM，以前我们是将这些副作用写在生命周期钩子函数里面，现在就可以书写在 useEffect 这个 Hook 里面

    ```
    ajax请求
    计时器
    其他异步操作
    更改真实DOM对象
    本地存储
    其他会对外部产生影响的操作
    ```

- 基本使用

  > useEffect，该函数接收一个函数作为参数，接收的函数就是需要进行副作用操作的函数
  >
  > 副作用函数的运行*时间点*，是在页面完成*真实的UI渲染之后*。因此它的执行是*异步*的，并且不会阻塞浏览器
  >
  > 与类组件中componentDidMount和componentDidUpdate的区别
  >
  > 1. componentDidMount和componentDidUpdate，更改了真实DOM，但是用户还没有看到UI更新就执行，同步的。
  > 2. useEffect中的副作用函数，更改了真实DOM，并且用户已经看到了UI更新之后执行，异步的。

  ```js
  import { useState, useEffect } from 'react';
  
  function App() {
  
    let [count, setCount] = useState(0);
  
    useEffect(()=>{
      // 书写你要执行的副作用，会在组件渲染完成后执行
      // 第二个参数不传，每次重新渲染都会执行。
      document.title = `你点击了${count}次`;
    });
  
  
    function clickhandle() {
      setCount(++count);
    }
  
    return (
      <div>
        <div>你点击了{count}次</div>
        <button onClick={clickhandle}>+1</button>
      </div>
    );
  }
  
  export default App;
  ```

  

- 执行清理工作

  > useEffect中的副作用函数，可以有返回值，返回值必须是一个函数，该函数叫做清理函数
  >
  > 1. 该函数运行时间点，在*每次运行副作用函数之前*
  > 2. 首次渲染组件不会运行
  > 3. 组件被销毁时一定会运行

  ```js
  import { useState, useEffect } from 'react';
  function App() {
    let [count, setCount] = useState(0);
    useEffect(()=>{
      // 书写你要执行的副作用，会在组件渲染完成后执行
      const stopTimer = setInterval(()=>{
        console.log("Hello");
      },1000)   
  
      // console.log("副作用函数执行了");
      // 在 useEffect 中，可以返回一个函数，该函数我们称之为清理函数（一般就是做一些清理操作）
      // 该函数会在下一次渲染之后，但是在执行副作用操作之前执行
      return ()=>{
        // console.log("清理函数执行了");
        clearInterval(stopTimer);
      }
    });
  
    function clickhandle() {
      setCount(++count);
    }
  
    return (
      <div>
        <div>你点击了{count}次</div>
        <button onClick={clickhandle}>+1</button>
      </div>
    );
  }
  export default App;
  ```

  

- 副作用的依赖

  > useEffect函数，可以传递第二个参数
  >
  > 1. 第二个参数是一个数组
  > 2. 数组中记录该副作用的依赖数据
  > 3. 当组件重新渲染后，*只有依赖数据与上一次不一样的时，才会执行副作用*
  > 4. 所以，当传递了依赖数据之后，如果数据没有发生变化
  >    1. 副作用函数仅在第一次渲染后运行
  >    2. 清理函数仅在卸载组件后运行

  ```react
  import { useState, useEffect } from 'react';
  
  function App() {
  
    let [count1, setCount1] = useState(0);
    let [count2, setCount2] = useState(0);
    let [count3, setCount3] = useState(0);
  
    useEffect(()=>{
      console.log("执行副作用函数");
    },[count1]);
  
    return (
      <div>
        <div>count1:{count1}</div>
        <div>count2:{count2}</div>
        <div>count3:{count3}</div>
        <button onClick={()=>setCount1(++count1)}>+1</button>
        <button onClick={()=>setCount2(++count2)}>+1</button>
        <button onClick={()=>setCount3(++count3)}>+1</button>
      </div>
    );
  }
  
  export default App;
  ```

- 如果想要副作用只执行**一**次，传递第二个参数为一个空数组

  ```js
  useEffect(()=>{
    console.log("执行副作用函数");
  },[]);
  ```

**注意**

1. 每个函数组件中，可以多次使用useEffect，但不要放入判断或循环等代码块中。
2. 副作用函数中，如果使用了函数上下文中的变量，则由于*闭包*的影响，会导致*副作用函数中变量不会实时变化*(**定时器**)。
3. 副作用函数在每次注册时，会覆盖掉之前的副作用函数，因此，尽量*保持副作用函数稳定*，否则控制起来会比较复杂。

### 自定义 *Hook*

除了使用官方内置的 Hook，我们还可以自定义 Hook，自定义 *Hook 的本质其实就是函数*，但是和普通函数还是有一些区别，主要体现在以下两个点：

- 自定义 Hook 能够调用诸如 *useState*、*useRef* 等，普通函数则不能。由此可以通过内置的 Hooks 获得 *Fiber* 的访问方式，可以实现在**组件级别存储数据**的方案等。
- 自定义 Hooks 需要以 *use 开头*，普通函数则没有这个限制。使用 use 开头并不是一个语法或者一个强制性的方案，更像是一个约定。

*App.jsx*

```react
import { useState } from 'react';
import useMyBook from "./useMyBook"

function App() {

  const {bookName, setBookName} = useMyBook();
  const [value, setValue] = useState("");


  function changeHandle(e){
    setValue(e.target.value);
  }

  function clickHandle(){
    setBookName(value);
  }

  return (
    <div>
      <div>{bookName}</div>
      <input type="text" value={value} onChange={changeHandle}/>
      <button onClick={clickHandle}>确定</button>
    </div>
  )
  
}

export default App;
```

*useMyBook*

```react
import { useState } from "react";

function useMyBook(){
    const [bookName, setBookName] = useState("React 学习");
    return {
        bookName, setBookName
    }
}

export default useMyBook;
```



使用Hook的时候，如果没有严格按照Hook的规则进行，eslint的一个插件（*eslint-plugin-react-hooks*）会报出警告

单文件禁用eslint规则

```js
/* eslint "react-hooks/exhaustive-deps": "off" */
```

 

### useReducer

#### **Flux**

> Facebook 出品的一个数据流框架

1. 规定数据是*单向流动*的
2. 数据存储在*数据仓库*中（目前，可以认为state就是一个存储数据的仓库）
3. *action*是改变数据的唯一原因（本质上就是一个对象，action有两个属性）
   1. type：字符串，动作的类型
   2. payload：任意类型，动作发生后的附加信息
   3. 例如，如果是添加一个学生，action可以描述为：
      1. `{ type:"addStudent", payload: {学生对象的各种信息} }`
   4. 例如，如果要删除一个学生，action可以描述为：
      1. `{ type:"deleteStudent", payload: 学生id }`
4. 具体改变数据的是一个函数，该函数叫做 *reducer*
   1. 该函数接收两个参数
      1. state：表示当前数据仓库中的数据
      2. action：描述了如何去改变数据，以及改变数据的一些附加信息
   2. 该函数必须有一个返回结果，用于表示数据仓库变化之后的数据
      1. Flux要求，对象是不可变的，如果返回对象，必须创建新的对象
   3. reducer必须是*纯函数*，不能有任何副作用
5. 如果要触发 *reducer*，不可以直接调用，而是应该调用一个辅助函数 *dispatch*
   1. 该函数仅接收一个参数：action
   2. 该函数会间接去调用 reducer，以达到改变数据的目的

#### 手写useReducer

> React 提供的 useReducer 也是这样实现的

```js
import {useState} from "react"
/**
 * 
 * @param {Function} reducer 
 * @param {any} initVal 
 * @param {Function} initValFun 
 */
export function useReducer(reducer, initVal, initValFun){
  const [state, setState] = useState(initValFun?initValFun(initVal): initVal)
  function dispatch(action){
    const newState = reducer(state, action)
    console.log(`日志：n的值 ${state} -> ${newState}`)
    setState(newState)
  }

  return [state, dispatch]
}
```



### useContext

> 用与获取上下文

```jsx
// 创建上下文
const ctx = react.creatContext()

<ctx.Provider value="abc">
      <...>
</ctx.Provider>
```

```js
const val = useContext(ctx) // 就直接获取到了上下文的值，更方便使用
```



## React渲染

### 元素

> 元素是构成 React 应用的最小砖块

与浏览器的 DOM 元素不同，React 元素是**创建开销极小的普通对象**。React DOM 会负责更新 DOM 来与 React 元素保持一致。

React 元素是 *不可变对象*。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。

更新 UI 唯一的方式是**创建一个全新的元素**，并将其传入

React DOM 会将元素和它的子元素与它们之前的**状态进行比较**，并只会进行必要的更新来使 DOM 达到预期的状态。



### 条件渲染

1. 使用 if 语句
2. 使用 && 
3. 将元素使用 *变量保存*
4. 三目运算符



### 列表渲染

- 使用 map

  当没有传递 key 的时候，React 默认使用索引作为key

- Key

  如果列表项目的**顺序可能会变化**，不建议使用索引来用作 key 值

  **使用 索引作为 key 会存在什么问题**

  > Key 是 React 唯一识别元素的东西
  >
  > 1. 性能问题，浏览器会重新渲染所有列表元素（例如**删除一个元素，其他元素的索引都会改变**，导致所有重新渲染）



### Portals

> 插槽：将一个React元素渲染到指定的 DOM 容器中

ReactDom.createPortal(React元素，真实的DOM 容器)，该函数返回一个 React 元素

 <img src="http://img.buxiaoxing.com/uPic/2023/03/07193529-WpKwEz-image-20230307193529325.png" alt="image-20230307193529325" style="zoom:50%;" />

**注意事件冒泡**

1. React 中的事件是包装过的。
2. 它的事件冒泡是根据虚拟 DOM 树来冒泡的，与真实 DOM 无关。



### 渲染过程

> 渲染：生成用于显示的对象，以及将这些对象形成真实的DOM对象

- **React元素**(*React Element*)

  通过*React.createElement*创建（语法糖：JSX）

  如 `<div></div>` `<App />`

- **React节点**

  专门用于渲染到UI界面的对象，React会通过React元素，创建React节点，*ReactDOM* 一定是通过React节点来进行渲染的

  节点类型

  - React DOM节点：创建该节点的React元素类型是一个字符串

  - React 组件节点：创建该节点的React元素类型是一个函数或是一个类

  - React 文本节点：由字符串、数字创建的

  - React 空节点：由*null、undefined、false、true*

  - React 数组节点：该节点由一个数组创建

    

  **整个渲染流程大致如下**

  ![image-20230312171029391](http://img.buxiaoxing.com/uPic/2023/03/12171029-ivggxR-image-20230312171029391.png)

#### 首次渲染(新节点挂载)

1. 通过参数的值(reactDOM.render()的参数)创建节点
2. 根据不同的节点，做不同的事情
   1. 文本节点: 通过*document.createTextNode*创建真实的文本节点
   2. 空节点：什么都不做
   3. 数组节点：遍历数组，将数组每一项*递归*创建节点（回到第1步进行反复操作，直到遍历结束）
   4. DOM节点：通过*document.createElement*创建真实的DOM对象，然后立即设置该真实DOM元素的各种属性，然后遍历对应React元素的children属性，递归操作（回到第1步进行反复操作，直到遍历结束）
   5. 组件节点
      1. 函数组件：调用函数(该函数必须返回一个*可以生成节点的内容*)，将该函数的返回结果*递归*生成节点（回到第1步进行反复操作，直到遍历结束）
      2. 类组件
         1. 创建该类的实例(执行 constructor)
         2. 立即调用对象的生命周期方法：*static getDerivedStateFromProps*
         3. 运行该对象的*render*方法，拿到节点对象（将该节点*递归*操作，回到第1步进行反复操作）
         4. 将该组件的*componentDidMount*加入到执行*队列*（先进先出，先进先执行），当整个虚拟DOM树全部构建完毕，并且将*真实的DOM对象加入到容器*中后，执行该队列
3. 生成出*虚拟DOM树*之后，将该树*保存*起来，以便后续使用
4. 将之前生成的*真实的DOM对象，加入到容器*中。

```js
const app = <div className="assaf">
    <h1>
        标题
        {["abc", null, <p>段落</p>]}
    </h1>
    <p>
        {undefined}
    </p>
</div>;
ReactDOM.render(app, document.getElementById('root'));
```

以上代码生成的虚拟 DOM 树

![image-20230312173336540](http://img.buxiaoxing.com/uPic/2023/03/12173336-2P8EHM-image-20230312173336540.png)

```js
function Comp1(props) {
    return <h1>Comp1 {props.n}</h1>
}

function App(props) {
    return (
        <div>
            <Comp1 n={5} />
        </div>
    )
}

const app = <App />;
ReactDOM.render(app, document.getElementById('root'));
```

<img src="http://img.buxiaoxing.com/uPic/2023/03/12173415-XlvSB9-image-20230312173415419.png" alt="image-20230312173415419" style="zoom:50%;" />

```js
class Comp1 extends React.Component {
    render() {
        return (
            <h1>Comp1</h1>
        )
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <Comp1 />
            </div>
        )
    }
}

const app = <App />;
ReactDOM.render(app, document.getElementById('root'));
```

<img src="http://img.buxiaoxing.com/uPic/2023/03/12173459-UASdKl-image-20230312173458942.png" alt="image-20230312173458942" style="zoom:50%;" />

#### 更新节点

更新的场景：

1. 重新调用 *ReactDOM.render*，触发根节点更新
2. 在类组件的实例对象中调用 *setState*，会导致该实例所在的节点更新

**节点的更新**

- 如果调用的是 *ReactDOM.render*，进入根节点的**对比（diff）更新**
- 如果调用的是 *setState*
  1. 运行生命周期函数，*static getDerivedStateFromProps*
  2. 运行 *shouldComponentUpdate*，如果该函数返回false，终止当前流程 
  3. 运行 *render*，得到一个新的节点，进入该新的节点的**对比更新**
  4. 将生命周期函数 *getSnapshotBeforeUpdate* 加入执行队列，以待将来执行
  5. 将生命周期函数 *componentDidUpdate* 加入执行队列，以待将来执行

后续步骤

1. 更新虚拟DOM树
2. 完成真实的DOM更新
3. 依次调用执行队列中的 *componentDidMount*
4. 依次调用执行队列中的 *getSnapshotBeforeUpdate*
5. 依次调用执行队列中的 *componentDidUpdate*

##### **对比更新**

将新产生的节点，对比之前虚拟DOM中的节点，发现差异，完成更新

问题：对比之前DOM树中哪个节点

React为了提高对比效率，做出以下假设

1. 假设节点不会出现层次的移动（对比时，直接找到旧树中对应位置的节点进行对比）

2. 不同的节点类型会生成不同的结构

   1. 相同的*节点类型*：节点本身类型相同，如果是由React元素生成，*type*值还必须一致
   2. 其他的，都属于不相同的节点类型

3. 多个兄弟通过唯一标识（*key*）来确定对比的新节点。*key的作用就是找到对比的节点*

   key值的作用：用于通过旧节点，寻找对应的新节点，如果某个旧节点有key值，则其更新时，会寻找相同层级中的相同key值的节点，进行对比。

   **key值应该在一个范围内唯一（兄弟节点中），并且应该保持稳定**

**找到了对比目标**

判断节点类型是否一致

- 如果**一致**

  根据不同的节点类型，做不同的事情

  - **空节点**

  不做任何事情

  - **DOM节点**

    - 直接*重用之前的真实DOM对象*

    - 将其属性的变化记录下来，以待将来统一完成更新（现在不会真正的变化）

    - 遍历该新的React元素的子元素，**递归对比更新**

  - **文本节点**

    - 直接*重用之前的真实DOM对象*
    - 将新的文本变化记录下来，将来统一完成更新

  - **组件节点**

    - **函数组件** 重新调用函数，得到一个节点对象，进入**递归对比更新**

    - **类组件**

      1. *重用之前的实例*

      2. 调用生命周期方法 *getDerivedStateFromProps*

      3. 调用生命周期方法 *shouldComponentUpdate*，若该方法返回false，终止

      4. 运行 *render*，得到新的节点对象，进入**递归对比更新**

      5. 将该对象的 *getSnapshotBeforeUpdate* 加入队列

      6. 将该对象的 *componentDidUpdate* 加入队列

  - **数组节点**

  遍历数组进行**递归对比更新**

- **不一致**

  整体上，先创建新节点，再卸载旧节点

  **创建新节点**

  进入新节点的挂载流程

  **卸载旧节点**

  1. **文本节点、DOM节点、数组节点、空节点、函数组件节点**：直接放弃该节点，如果节点有子节点，递归卸载节点
  2. **类组件节点**：
     1. 直接放弃该节点
     2. 调用该节点的 *componentWillUnMount* 函数
     3. 递归卸载子节点

**没有找到对比目标**

新的DOM树中有节点被删除

新的DOM树中有节点添加

- 创建新加入的节点
- 卸载多余的旧节点

## React API

### React.Component

使用 *class* 方式定义 React 组件的基类

### React.PureComponent

实现了 *shouldComponentUpdate()*(浅层对比props和state) 的 React.Component

在某些情况下使用 PureComponent 可以*提高性能*

**注意**

仅在你的 props 和 state 较为简单时，才使用 `React.PureComponent`，或者在深层数据结构发生变化时调用 [`forceUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#forceupdate) 来确保组件被正确地更新

### React.memo

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

*React.memo* 是高阶组件

如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中调用，以此**通过记忆组件渲染结果的方式来提高组件的性能表现**。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

### React.createElement

创建并返回指定类型的新 React 元素

### React.cloneElement

```jsx
React.cloneElement(
  element,
  [config],
  [...children]
)
```





## 工具

### 严格模式

StrictMode(```React.StrictMode```)，本质是一个组件，该组件不进行UI渲染（```React.Fragment <> </>```），它的作用是，在渲染内部组件时，发现不合适的代码。

- *识别不安全的生命周期*
- 关于使用过时字符串 *ref API 的警告*
- 关于使用废弃的 *findDOMNode* 方法的警告
- 检测意外的*副作用*
  - React要求，副作用代码仅出现在以下生命周期函数中
  - 1. ComponentDidMount
  - 2. ComponentDidUpdate
  - 3. ComponentWillUnMount

副作用：一个函数中，做了一些会影响函数外部数据的事情，例如：

1. 异步处理
2. 改变参数值
3. setState
4. 本地存储
5. 改变函数外部的变量

相反的，如果一个函数没有副作用，则可以认为该函数是一个纯函数

在严格模式下，虽然不能监控到具体的副作用代码，但它会*将不能具有副作用的函数调用两遍*，以便发现问题。（这种情况，仅在开发模式下有效）

- 检测过时的 context API



### Profiler

性能分析工具

分析某一次或多次提交（更新），涉及到的组件的渲染时间

火焰图：得到某一次提交，每个组件总的渲染时间以及自身的渲染时间

排序图：得到某一次提交，每个组件自身渲染时间的排序

组件图：某一个组件，在多次提交中，自身渲染花费的时间
