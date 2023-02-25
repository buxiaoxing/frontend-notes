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

**react是 *自上而下* 的数据流**

任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“*低于*”它们的组件

如果你把一个以组件构成的树想象成一个 props 的**数据瀑布**的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动

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

### *useState* 和 *useEffect*

React 内置了一些实用的 Hook，并且随着 React 版本的更新，Hook 的数量还在持续增加当中。

入门阶段，我们掌握两个最常用的 Hook，一个是为函数组件**添加状态**的 *useState*，另一个是处理函数**副作用**的 *useEffect*。



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

- 声明多个 *state* 状态

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

  - 如果一个函数中，存在副作用，那么我们就称该函数不是一个纯函数，所谓副作用，就是指函数的结果是不可控，不可预期。
  - 常见的副作用有发送网络请求、添加一些监听的注册和取消注册，手动修改 DOM，以前我们是将这些副作用写在生命周期钩子函数里面，现在就可以书写在 useEffect 这个 Hook 里面

- 基本使用

```react
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

```react
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

  - 目前，我们的副作用函数，每次重新渲染后，都会重新执行，有些时候我们是需要设置依赖项，传递第二个参数，第二个参数为一个依赖数组

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





## React渲染

### 元素

> 元素是构成 React 应用的最小砖块

与浏览器的 DOM 元素不同，React 元素是**创建开销极小的普通对象**。React DOM 会负责更新 DOM 来与 React 元素保持一致。

React 元素是 *不可变对象*。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。

更新 UI 唯一的方式是**创建一个全新的元素**，并将其传入

React DOM 会将元素和它的子元素与它们之前的**状态进行比较**，并只会进行必要的更新来使 DOM 达到预期的状态。