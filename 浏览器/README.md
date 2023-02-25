## 浏览器的渲染流程

### 浏览器整体渲染流程

浏览器，作为用户浏览网页最基本的一个入口，我们似乎认为在地址栏输入 *URL* 后网页自动就出来了。殊不知在用户输入网页地址，敲下回车的那一刻，浏览器背后做了诸多的事情。

去除 *DNS* 查找等这些细枝末节的工作，整个大的部分可以分为两个，那就是**网络**和**渲染**。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22092940-oQjC3e-2022-09-08-024403.png" alt="image-20220908104403123" style="zoom:45%;" />

首先，浏览器的网络线程会发送 *http* 请求，和服务器之间进行通信，之后将拿到的 *html* 封装成一个渲染任务，并将其传递给渲染主线程的消息队列。在事件循环机制的作用下，渲染主线程取出消息队列中的渲染任务，开启渲染流程。

这里咱们要研究的主要内容，是浏览器的渲染进程如何将一个密密麻麻的 *html* 字符串渲染成最终页面的。

我们先来看一下整体流程，整个渲染流程分为多个阶段，分别是： *HTML* 解析、样式计算、布局、分层、生成绘制指令、分块、光栅化、绘制：

<img src="http://img.buxiaoxing.com/uPic/2023/02/22094232-D4k9G8-2022-09-08-024727.png" alt="image-20220908104726589" style="zoom:50%;" />

每个阶段都有明确的输入输出，上一个阶段的输出会成为下一个阶段的输入。

这样，整个渲染流程就形成了一套组织严密的生产流水线。

接下来，咱们就一起来看一下每一个阶段的各个流程究竟是在干什么。

### 解析HTML

> 首先第一步就是解析 *html*，生成 *DOM* 树。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-11-20-091451.png" alt="image-20211120171451336" style="zoom:50%;" />

为了提高解析效率，浏览器在开始解析前，会启动一个预解析的线程，率先下载 *HTML* 中的外部 *CSS* 文件和外部的 *JS* 文件。

如果主线程解析到 *link* 位置，此时外部的 *CSS* 文件还没有下载解析好，主线程不会等待，继续解析后续的 *HTML*。这是因为下载和解析 *CSS* 的工作是在预解析线程中进行的。这就是 *CSS* 不会阻塞 *HTML* 解析的根本原因。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22095105-T83N5D-2022-09-08-041457.png" alt="image-20220908121457474" style="zoom:50%;" />

上面也有提到，预解析线程除了下载外部 *CSS* 文件以外，还会下载外部  *JS* 文件，那么这里同学们自然也会好奇针对 *JS* 代码浏览器是如何处理的？

如果主线程解析到 *script* 位置，会停止解析 *HTML*，转而等待 *JS* 文件下载好，并将全局代码解析执行完成后，才能继续解析 *HTML*。

为什么呢？

这是因为 *JS* 代码的执行过程可能会修改当前的 *DOM* 树，所以 *DOM* 树的生成必须暂停。这就是 *JS* 会阻塞 *HTML* 解析的根本原因。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22095350-U3IfBd-2022-09-08-042138.png" alt="image-20220908122137888" style="zoom:50%;" />

因此，如果你想首屏渲染的越快，就越不应该在最前面就加载 *JS* 文件，这也是都建议将 *script* 标签放在 *body* 标签底部的原因。

另外，在现代浏览器中，为我们提供了新的方式来避免 *JS* 代码阻塞渲染的情况：

- *async* 
- *defer* 
- *prefetch* 
- *preload*

最后总结一下此阶段的成果，第一步完成后，会得到 *DOM* 树和 *CSSOM* 树，浏览器的默认样式、内部样式、外部样式、行内样式均会包含在 *CSSOM* 树中。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22095539-wH3NyG-2022-09-08-043007.png" alt="image-20220908123007132" style="zoom:50%;" />

### 样式计算

拥有了 *DOM* 树我们还不足以知道页面的外貌，因为我们通常会为页面的元素设置一些样式。主线程会遍历得到的 *DOM* 树，依次为树中的每个节点计算出它最终的样式，称之为 *Computed Style*。

在这一过程中，很多预设值会变成绝对值，比如 *red* 会变成 *rgb(255,0,0)*；相对单位会变成绝对单位，比如 *em* 会变成 *px*。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22134102-OPdlSr-2021-11-20-091530.png" alt="image-20211120171529844" style="zoom:50%;" />

这一步完成后，我们就得到一棵带有样式的 *DOM* 树。也就是说，经过样式计算后，之前的 *DOM* 数和 *CSSOM* 数合并成了一颗带有样式的 *DOM* 树。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22134158-d6XA44-2022-09-08-061123.png" alt="image-20220908141123262" style="zoom:50%;" />

### 布局

前面这些步骤完成之后，渲染进程就已经知道页面的具体文档结构以及每个节点拥有的样式信息了，可是这些信息还是不能最终确定页面的样子。

还需要通过布局（*layout*）来计算出每个节点的几何信息（*geometry*）。

生成布局树的具体过程是：主线程会遍历刚刚构建的 *DOM* 树，根据 *DOM* 节点的计算样式计算出一个布局树（*layout tree*）。布局树上每个节点会有它在页面上的 *x，y* 坐标以及盒子大小（*bounding box sizes*）的具体信息。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22142953-0h9QrO-2022-09-08-063741.png" alt="image-20220908143740837" style="zoom:50%;" />

布局树大部分时候，和 *DOM* 树并非一一对应。虽然它长得和先前构建的 *DOM* 树差不多，但是不同的是这颗树只有那些可见的（*visible*）节点信息。

比如 *display:none* 的节点没有几何信息，因此不会生成到布局树；

<img src="http://img.buxiaoxing.com/uPic/2023/02/22143028-qkRzvc-2022-09-08-064042.png" alt="image-20220908144042164" style="zoom:50%;" />

又比如使用了伪元素选择器，虽然 *DOM* 树中不存在这些伪元素节点，但它们拥有几何信息，所以会生成到布局树中。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22143046-gqKDjM-2022-09-08-064105.png" alt="image-20220908144104772" style="zoom:50%;" />

还有匿名行盒、匿名块盒等等都会导致 *DOM* 树和布局树无法一一对应。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22143132-OqG4Bh-2022-09-08-064945.png" alt="image-20220908144944360" style="zoom:50%;" />

### 分层

<img src="http://img.buxiaoxing.com/uPic/2023/02/22143206-95sNm2-2022-09-08-070423.png" alt="image-20220908150422668" style="zoom:50%;" />

分层的好处在于，将来某一个层改变后，仅会对该层进行后续处理，从而提升效率。

为了确定哪些元素需要放置在哪一层，主线程需要遍历整颗布局树来创建一棵层次树（*Layer Tree*）

<img src="http://img.buxiaoxing.com/uPic/2023/02/22143940-Mcm0J4-2022-09-08-070247.png" alt="image-20220908150246720" style="zoom:50%;" />

滚动条、堆叠上下文、*transform*、*opacity* 等样式都会或多或少的影响分层结果，也可以通过使用 *will-change* 属性来告诉浏览器对其分层。



### 生成绘制指令

分层工作结束后，接下来就是生成绘制指令。

主线程会为每个层单独产生绘制指令集，用于描述这一层的内容该如何画出来。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22144711-mRulnZ-2022-09-08-071357.png" alt="image-20220908151357092" style="zoom:50%;" />

这里的绘制指令，类似于“将画笔移动到 *xx* 位置，放下画笔，绘制一条 *xx* 像素长度的线”，我们在浏览器所看到的各种复杂的页面，实际上都是这样一条指令一条指令的执行所绘制出来的。

如果你熟悉 *Canvas*，那么这样的指令类似于：

```js
context.beginPath(); // 开始路径
context.moveTo(10, 10); // 移动画笔
context.lineTo(100, 100); // 绘画出一条直线
context.closePath(); // 闭合路径
context.stroke(); // 进行勾勒
```

但是你要注意，这一步只是生成诸如上面代码的这种绘制指令集，还没有开始执行这些指令。

另外，还有一个重要的点你需要知道，生成绘制指令集后，渲染主线程的工程就暂时告一段落，接下来主线程将每个图层的绘制信息提交给合成线程，剩余工作将由**合成线程**完成。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22144807-djMygB-2022-09-08-072311.png" alt="image-20220908152310570" style="zoom:50%;" />

### 分块

合成线程首先对每个图层进行分块，将其划分为更多的小区域。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22144830-lr4yQq-2022-09-08-073041.png" alt="image-20220908153040434" style="zoom:50%;" />

<img src="http://img.buxiaoxing.com/uPic/2023/02/22144854-hhUPKx-2022-09-08-073140.png" alt="image-20220908153140082" style="zoom:50%;" />

### 光栅化

分块完成后，进入**光栅化**阶段。所谓光栅化，就是将**每个块变成位图**。

更简单的理解就是确认每一个**像素点**的 *rgb* 信息，如下图所示：

<img src="http://img.buxiaoxing.com/uPic/2023/02/22145141-fhEZYu-2022-09-08-085823.png" alt="image-20220908165823172" style="zoom:50%;" />

光栅化的操作，并不由合成线程来做，而是会由合成线程将块信息交给 *GPU* 进程，以极高的速度完成光栅化。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22145218-vewSdw-2022-09-08-090342.png" alt="image-20220908170342666" style="zoom:50%;" />

*GPU* 进程会开启多个线程来完成光栅化，并且优先处理靠近视口区域的块。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22145243-ME4SAk-2022-09-08-090810.png" alt="image-20220908170809995" style="zoom:50%;" />



### 绘制

最后一步，我们总算迎来了真正的绘制。

当所有的图块都被栅格化后，合成线程会拿到每个层、每个块的位图，从而生成一个个「指引（**quad**）」信息。

<img src="http://img.buxiaoxing.com/uPic/2023/02/22145451-J5Zs9z-2022-09-08-090959.png" alt="image-20220908170958873" style="zoom:50%;" />

指引会标识出每个位图应该画到屏幕的哪个位置，以及会考虑到旋转、缩放等变形。

变形发生在合成线程，与渲染主线程无关，这就是 *transform* 效率高的本质原因。

合成线程会通过 IPC 向浏览器进程（*browser process*）提交（*commit*）一个渲染帧。这个时候可能有另外一个合成帧被浏览器进程的 *UI*线程（*UI thread*）提交以改变浏览器的 *UI*。这些合成帧都会被发送给 *GPU* 完成最终的屏幕成像。

最后总结一下浏览器从拿到 *html* 文档到最终渲染出页面的整体流程，如下图：

<img src="http://img.buxiaoxing.com/uPic/2023/02/22145838-Gx3rRd-2022-09-08-092525.png" alt="image-20220908172524782" style="zoom:50%;" />





### 常见面试题

1. 什么是 `reflow`

   > *reflow* 的本质就是重新计算 *layout* 树。
   >
   > 当进行了会影响布局树的操作后，需要重新计算布局树，会引发 *layout*。
   >
   > 为了避免连续的多次操作导致布局树反复计算，浏览器会合并这些操作，当 *JS* 代码全部完成后再进行统一计算。所以，改动属性造成的 *reflow* 是异步完成的。
   >
   > 也同样因为如此，当 *JS* 获取布局属性时，就可能造成无法获取到最新的布局信息。
   >
   > 浏览器在反复权衡下，最终决定获取属性立即 *reflow*。
   >
   > <img src="http://img.buxiaoxing.com/uPic/2023/02/22150451-p6MfUG-2022-09-08-092554.png" alt="image-20220908172553393" style="zoom:50%;" />

2. 什么是 `repaint`

   > *repaint* 的本质就是重新根据分层信息计算了**绘制指令**。
   >
   > 当改动了**可见样式**后，就需要重新计算，会引发 *repaint*。
   >
   > 由于元素的布局信息也属于可见样式，所以 *reflow* 一定会引起 *repaint*。
   >
   > <img src="http://img.buxiaoxing.com/uPic/2023/02/22150604-QEjtaB-2022-09-08-092823.png" alt="image-20220908172822640" style="zoom:50%;" />

3. 为什么 *transform* 的效率高？

   > 因为 *transform* 既不会影响布局也不会影响绘制指令，它影响的只是渲染流程的最后一个「*draw*」阶段
   >
   > 由于 *draw* 阶段在合成线程中，所以 *transform* 的变化几乎不会影响渲染主线程。反之，渲染主线程无论如何忙碌，也不会影响 *transform* 的变化。
   >
   > <img src="http://img.buxiaoxing.com/uPic/2023/02/22150801-R7jtsS-2022-09-08-092652.png" alt="image-20220908172651862" style="zoom:50%;" />



## 资源提示关键词

### 阻塞渲染回顾

我们都知道，*HTML* 用于描述网页的整体结构。为了理解 *HTML*，浏览器必须将它转为自己能够理解的格式，也就是 *DOM*（文档对象模型）

浏览器引擎有一段特殊的代码，称为解析器，用于将数据从一种格式转换为另一种格式。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081458.png" alt="image-20211206161457653" style="zoom:50%;" />

浏览器一点一点地构建 *DOM*。一旦第一块代码进来，它就会开始解析 *HTML*，将节点添加到树结构中。

![ezgif-2-2688553063](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081522.gif)

构建出来的 *DOM* 对象，实际上有 *2* 个作用：

- *HTML* 文档的结构以对象的方式体现出来，形成我们常说的 *DOM* 树

- 作为外界的接口供外界使用，例如 *JavaScript*。当我们调用诸如 *document.getElementById* 的方法时，返回的元素是一个 *DOM* 节点。每个 *DOM* 节点都有许多可以用来访问和更改它的函数，用户看到的内容也会相应地发生变化。



![ezgif-2-01a1ded8c4](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081639.gif)

*CSS* 样式会被映射为 *CSSOM*（ *CSS* 对象模型），它和 *DOM* 很相似，但是针对的是 *CSS* 而不是 *HTML*。

在构建 *CSSOM* 的时候，无法进行增量构建（不像构建 *DOM* 一样，解析到一个 *DOM* 节点就扔到 *DOM* 树结构里面），因为 *CSS* 规则是可以相互覆盖的，浏览器引擎需要经过复杂的计算才能弄清楚 *CSS* 代码如何应用于 *DOM*。

![image-20211206161700033](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081700.png)

当浏览器正在构建 *DOM* 时，如果它遇到 *HTML* 中的 `<script>...</script>` 标记，它必须立即执行它。如果脚本是外部的，则必须先下载脚本。

过去，为了执行脚本，必须暂停解析。解析会在 *JavaScript* 引擎执行完脚本中的代码后再次启动。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081717.png" alt="image-20211206161717368" style="zoom:50%;" />



为什么解析必须停止呢？

原因很简单，这是因为 *Javascript* 脚本可以改变 *HTML* 以及根据 *HTML* 生成的 *DOM* 树结构。例如，脚本可以通过使用 *document.createElement( )* 来添加节点从而更改 *DOM* 结构。

![image](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081740.gif)

这也是为什么我们建议将 *script* 标签写在 *body* 元素结束标签前面的原因。

```html
<body>
    <!-- HTML Code -->
    <script>
        JS Code...
    </scirpt>
</body>
```

接下来我们回头来看一下 *CSS* 是否会阻塞渲染。

看上去 *JavaScript* 会阻止解析，是因为它可以修改文档。那么 *CSS* 不能修改文档，所以它似乎没有理由阻止解析，对吧？

但是，如果**脚本中需要获取一些尚未解析的样式信息**怎么办？在 *JavaScript* 中完全可以访问到 *DOM* 节点的某些样式，或者使用 *JavaScript* 直接访问 *CSSOM*。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081801.png" alt="image-20211206161801072" style="zoom:50%;" />

因此，*CSS* 可能会根据文档中外部样式表和脚本的顺序阻止解析。如果在文档中的脚本之前放置了外部样式表，则 *DOM* 和 *CSSOM* 对象的构建可能会相互干扰。

当解析器到达一个脚本标签时，在 *JavaScript* 执行完成之前无法继续构建 *DOM*，然而如果这一段 *JavaScript* 中涉及到访问和使用 *CSSOM*，那么必须等待 *CSS* 文件被下载、解析并且 *CSSOM* 可用。如果 *CSSOM* 处于未可用状态，则会阻塞 *JavaScript* 的执行。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081819.png" alt="image-20211206161819188" style="zoom:50%;" />

（上图中 *JavaScript* 的执行被 *CSS* 构建 *CSSOM* 的过程阻塞了）



另外，虽然 *CSS* 不会阻塞 *DOM* 的构建，但是也会阻塞渲染。

还记得我们前面有讲过要 *DOM* 树和 *CSSOM* 树都准备好，才会生成渲染树（ *Render Tree* ）么，浏览器在拥有 *DOM* 和 *CSSOM* 之前是不会显示任何内容。

这是因为没有 *CSS* 的页面通常无法使用。如果浏览器向你展示了一个没有 *CSS* 的凌乱页面，那么片刻之后就会进入一个有样式的页面，不断变化的内容和突然的视觉变化会给用户带来混乱的用户体验。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-081854.gif" alt="2021-11-22 15.59.41" style="zoom:50%;" />



（这种糟糕的用户体验有一个名字，叫做“无样式内容闪现”，*Flash of Unstyled Content*，或者简称 *FOUC* ）



为了解决这些问题，所以我们需要尽快的交付 *CSS*。

这也解释了为什么“顶部样式，底部脚本”被称之为“最佳实践”。

随着现代浏览器的普及，浏览器为我们提供了更多强大的武器（资源提示关键词），合理利用，方可大幅提高页面加载速度。



### defer 和 async

现代浏览器引入了 *defer* 和 *async*。

*async* 表示加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。也就是说**下载** JS 文件的时候不会阻塞 DOM 树的构建，但是**执行**该 JS 代码会阻塞 DOM 树的构建。

```html
<script async src="script.js"></script>
```

*defer* 表示加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有**元素解析完成之后**，*DOMContentLoaded* 事件触发之前完成。也就是说，下载 JS 文件的时候不会阻塞 DOM 树的构建，然后**等待 DOM 树构建完毕后再执行**此 JS 文件。

```html
<script defer src="myscript.js"></script>
```

具体加载瀑布图如下图所示：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-08-032125.png" alt="image-20211208112125053" style="zoom:90%;" />

### preload

*preload* 顾名思义就是一种预加载的方式，它通过声明向浏览器声明一个需要**提前加载**的资源，当资源真正被使用的时候立即执行，就无需等待网络的消耗。

```html
<link rel="stylesheet" href="style2.css">
<script src="main2.js"></script>

<link rel="preload" href="style1.css" as="style">
<link rel="preload" href="main1.js" as="script">
```

在上面的代码中，会先加载 *style1.css* 和 *main1.js* 文件（但不会生效），在随后的页面渲染中，一旦需要使用它们，它们就会立即可用。

可以使用 *as* 来指定将要预加载的内容类型。

![image-20211208112151152](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-08-032151.png)



*preload* 指令的一些优点如下：

- 允许浏览器设置资源优先级，从而允许 *Web* 开发人员优化某些资源的交付。

- 使浏览器能够确定资源类型，因此它可以判断将来是否可以重用相同的资源。

- 浏览器可以通过引用 *as* 属性中定义的内容来确定请求是否符合内容安全策略。

- 浏览器可以根据资源类型发送合适的 *Accept* 头（例如：*image/webp* ）



### prefetch

*prefetch* 是一种利用浏览器的**空闲时间**加载页面将来可能用到的资源的一种机制，通常可以用于加载非首页的其他页面所需要的资源，以便加快后续页面的首屏速度。

*prefetch* 加载的资源可以获取非当前页面所需要的资源，并且将其放入缓存至少 *5* 分钟（无论资源是否可以缓存）。并且，当页面跳转时，未完成的 *prefetch* 请求不会被中断；

它的用法跟 *preload* 是一样的：

```html
<link rel="prefetch" href="/path/to/style.css" as="style">
```



***DNS prefetching***

*DNS prefetching* 允许浏览器在用户浏览时在后台对页面执行 *DNS* 查找。这最大限度地减少了延迟，因为一旦用户单击链接就已经进行了 *DNS* 查找。 

通过将 *rel="dns-prefetch"* 标记添加到链接属性，可以将 *DNS prefetching* 添加到特定 *URL*。建议在诸如 *Web* 字体、*CDN* 之类的东西上使用它。

```html
<!-- Prefetch DNS for external assets -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="dns-prefetch" href="//cdn.domain.com">
```



### prerender

*prerender* 与 *prefetch* 非常相似，*prerender* 同样也是会收集用户接下来可能会用到的资源。

不同之处在于 *prerender* 实际上是在后台渲染整个页面。

```html
<link rel="prerender" href="https://www.keycdn.com">
```



### preconnect

我们要讨论的最后一个资源提示是 *preconnect*。 

*preconnect* 指令允许浏览器在 *HTTP* 请求实际发送到服务器之前设置早期连接。

我们知道，浏览器要建立一个连接，一般需要经过 *DNS* 查找，*TCP* 三次握手和 *TLS* 协商（如果是 *https* 的话），这些过程都是需要相当的耗时的。所以 *preconnet*，就是一项使浏览器能够预先建立一个连接，等真正需要加载资源的时候就能够直接请求了。

![image-20211208112216614](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-08-032217.png)



以下是为 *CDN URL* 启用 *preconnect* 的示例。

```html
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```

在上面的代码中，浏览器会进行以下步骤：

- 解释 *href* 的属性值，判断是否是合法的 *URL*。如果是合法的 *URL*，然后继续判断 *URL* 的协议是否是 *http* 或者 *https*，如果不是合法的 *URL*，则结束处理。
- 如果当前页面 *host* 不同于 *href* 属性中的 *host*，那么将不会带上 *cookie*，如果希望带上 *cookie* 等信息，可以加上 *crossorign* 属性。



## 浏览器的组成部分

浏览器由以下几个部分组成：

1. 用户界面（*user interface*）

   用于呈现浏览器窗口部件，比如地址栏、前进后退按钮、书签、顶部菜单等

2. 浏览器引擎（*browser engine*）

   用户在用户界面和渲染引擎中传递指令

3. 渲染引擎（*rendering engine*）

   负责解析 *HTML*、*CSS*，并将解析的内容显示到屏幕上。我们平时说的浏览器内核就是指这部分。

   现代网络浏览器的渲染引擎：

   - *Firefox：Gecko Software*

   - *Safari：WebKit*

   - *Chrome、Opera* (*15* 版本之后)：*Blink*

   - *Internet Explorer：Trident*

4. 网络（*networking*）

   用户网络调用，比如发送 *http* 请求

5. 用户界面后端（*UI backend*）

   用于绘制基本的窗口小部件，比如下拉列表、文本框、按钮等，向上提供公开的接口，向下调用操作系统的用户界面。

6. *JS* 解释器（*JavaScript interpreter*）

   解释执行 *JS* 代码。我们平时说的 *JS* 引擎就是指这部分。

   不同的浏览器使用不同的 *JS* 引擎：

   - *Chrome*： *V8* (*JavaScript* 引擎) (*Node JS* 建立在此之上)

   - *Mozilla*： *SpiderMonkey* (旧称“松鼠鱼”)

   - *Microsoft Edge*：*Chakra*

   - *Safari*：*JavaScriptCore / Nitro WebKit*

7. 数据存储（*data storage*）

   用户保存数据到磁盘中。比如 *cookie、localstorage* 等都是使用的这部分功能。

## 浏览器离线存储

目前常见的浏览器离线存储的方式如下：

- *Cookie*
- *Web Storage*
- *WebSQL*
- *IndexedDB*
- *File System*

### WebSQL

*WebSQL* 数据库 *API* 并不是 *HTML5* 规范的一部分，但是它是一个独立的规范，引入了一组使用 *SQL* 操作客户端数据库的 *APIs*。

如果你之前接触过诸如像 *MySQL* 这样的关系型数据库，学习过 *SQL* 语言，那么 *WebSQL* 对于你来讲没有任何的难度。

最新版的 *Safari, Chrome* 和 *Opera* 浏览器都支持 *WebSQL*。

 <img src="http://img.buxiaoxing.com/uPic/2023/02/22154447-A5hYOp-2021-12-01-015120.png" alt="image-20211130142613099" style="zoom:50%;" />

在 *WebSQL* 中，有 *3* 个核心方法：

- *openDatabase*：这个方法使用现有的数据库或者新建的数据库创建一个数据库对象。

- *transaction*：这个方法让我们能够控制一个事务，以及基于这种情况执行提交或者回滚。

- *executeSql*：这个方法用于执行实际的 *SQL* 查询。

#### 打开数据库

我们可以使用 *openDatabase( )* 方法来打开已存在的数据库，如果数据库不存在，则会创建一个新的数据库，使用代码如下：

```js
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
```

在上面的代码中，我们尝试打开一个名为 *mydb* 的数据库，因为第一次不存在此数据库，所以会创建该数据库，版本号为 *1.0*，大小为 *2M*。



 <img src="http://img.buxiaoxing.com/uPic/2023/02/22155025-S0o4ob-2021-12-01-015135.png" alt="image-20211130142639596" style="zoom:50%;" />

*openDatabase( )* 方法对应的 *5* 个参数：

- 数据库名称

- 版本号

- 描述文本

- 数据库大小

- 创建回调

第 *5* 个参数，创建回调会在创建数据库后被调用。

#### 执行操作

执行操作使用 *database.transaction( )* 函数：

```js
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
});
```

上面的语句执行后会在 '*mydb*' 数据库中创建一个名为 *LOGS* 的表。

该表存在 *2* 个字段 *id* 和 *log*，其中 *id* 是唯一的。

 <img src="http://img.buxiaoxing.com/uPic/2023/02/22155048-KjnU2l-2021-12-01-015142.png" alt="image-20211130142711069" style="zoom:50%;" />



#### 插入数据

在执行上面的创建表语句后，我们可以插入一些数据：

```js
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS STU (id unique, name, age)');
    tx.executeSql('INSERT INTO STU (id, name, age) VALUES (1, "张三", 18)');
    tx.executeSql('INSERT INTO STU (id, name, age) VALUES (2, "李四", 20)');
});
```

在上面的代码中，我们创建了一张名为 *STU* 的表，该表存在 *3* 个字段 *id，name* 和 *age*。

之后我们往这张表中插入了 *2* 条数据。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-15151.png" alt="image-20211130142729393" style="zoom:67%;" />



我们也可以使用动态值来插入数据：

```js
var stuName = "谢杰";
var stuAge = 18;
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS STU (id unique, name, age)');
    // tx.executeSql('INSERT INTO STU (id, name, age) VALUES (1, "张三", 18)');
    // tx.executeSql('INSERT INTO STU (id, name, age) VALUES (2, "李四", 20)');
    tx.executeSql('INSERT INTO STU (id, name, age) VALUES (3, ?, ?)', [stuName, stuAge]);
});
```

在上面的代码中，我们使用动态值的方式插入了一条数据，实例中的 *stuName* 和 *stuAge* 是外部变量，*executeSql* 会映射数组参数中的每个条目给 "?"。

>注意：由于上一次操作已经插入了 *id* 为 *1* 和 *2* 的数据，所以这一次插入内容时，要将前面两次插入语句注释调，否则插入操作不会成功。因为这里是一个**事务**，前面失败了会导致后面也失败。



#### 读取数据

以下实例演示了如何读取数据库中已经存在的数据：

```html
<div id="status"></div>
```

```js
var stuName = "谢杰";
var stuAge = 18;
// 打开数据库
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
// 插入数据
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS STU (id unique, name, age)');
    tx.executeSql('INSERT INTO STU (id, name, age) VALUES (1, "张三", 18)');
    tx.executeSql('INSERT INTO STU (id, name, age) VALUES (2, "李四", 20)');
    tx.executeSql('INSERT INTO STU (id, name, age) VALUES (3, ?, ?)', [stuName, stuAge]);
});
    
// 读取操作
db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM STU', [], function (tx, results) {
        var len = results.rows.length, i;
        msg = "<p>查询记录条数: " + len + "</p>";
        document.querySelector('#status').innerHTML += msg;

        for (i = 0; i < len; i++) {
            msg = "<p><b>" + results.rows.item(i).name + ":" + results.rows.item(i).age + "</b></p>";
            document.querySelector('#status').innerHTML += msg;
        }

    }, null);
});
```

在上面的代码中，第二个部分是读取数据的操作。这里我们仍然是使用的 *executeSql( )* 方法来执行的 *SQL* 命令，但是用法又不一样了。是时候来看一下完整的 *executeSql( )* 方法是什么样了。

```js
executeSql(sqlStatement, arguments, callback, errorCallback)
```

该方法完整的语法实际上是接收 *4* 个参数，分别是：

- *SQL* 语句
- 参数
- 执行 *SQL* 语句后的回调
- 错误回调

因此在上面的示例中，我们 *executeSql( )* 的第三个参数就是执行了 *SQL* 语句后的回调。我们在回调中可以通过 *results.rows* 拿到该表中的数据，之后对数据进行业务需求的操作即可。

 <img src="http://img.buxiaoxing.com/uPic/2023/02/22155525-3XmNCn-2021-12-01-015159.png" alt="image-20211130142755739" style="zoom:50%;" />

#### 删除数据

删除数据也是使用 *SQL* 中的语法，同样也支持动态指定的方式。

```js
var stuID = 2;
// 删除操作
db.transaction(function (tx) {
    tx.executeSql('DELETE FROM STU  WHERE id=1');
    tx.executeSql('DELETE FROM STU WHERE id=?', [stuID]);
});
```

在上面的代码中，我们删除了 *id* 为 *1* 和 *2* 的两条数据，其中第二条是动态指定的。

#### 修改数据

要修改数据也是使用 *SQL* 中的语法，同样也支持动态指定的方式。

```js
var stuID = 3;
// 更新操作
db.transaction(function (tx) {
    tx.executeSql('UPDATE STU SET name=\'王羲之\' WHERE id=3');
    tx.executeSql('UPDATE STU SET age=21 WHERE id=?', [stuID]);
});
```

在上面的代码中，我们修改了 *id* 为 *3* 的学生，名字修改为“王羲之”，年龄修改为 *21*。



#### 总结

目前来看，*WebSQL* 已经不再是 *W3C* 推荐规范，官方也已经不再维护了。原因说的很清楚，当前的 *SQL* 规范采用 *SQLite* 的 *SQL* 方言，而作为一个标准，这是不可接受的。

另外，*WebSQL* 使用 *SQL* 语言来进行操作，更像是一个关系型数据库，而 *IndexedDB* 则更像是一个 *NoSQL* 数据库， 这也是目前 *W3C* 强推的浏览端数据库解决方案。

所以本文不再对 *WebSQL* 做过多的介绍。

如果有兴趣的同学，可以参阅下面的资料进行扩展阅读：

- *View Web SQL data*：*https://developer.chrome.com/docs/devtools/storage/websql/?utm_source=devtools#run*（需要搭梯子）
- *CSDN WebSQL* 最全详解：*https://blog.csdn.net/weixin_45389633/article/details/107308968*



### *IndexedDB*

#### *IndexedDB* 简介

随着浏览器的功能不断增强，越来越多的网站开始考虑，将大量数据储存在客户端，这样可以减少从服务器获取数据，直接从本地获取数据。

现有的浏览器数据储存方案，都不适合储存大量数据：*Cookie* 的大小不超过 *4KB*，且每次请求都会发送回服务器；*LocalStorage* 在 *2.5MB* 到 *10MB* 之间（各家浏览器不同），而且不提供搜索功能，不能建立自定义的索引。所以，需要一种新的解决方案，这就是 IndexedDB 诞生的背景。



*MDN* 官网是这样解释 *IndexedDB* 的：

>*IndexedDB* 是一种底层 API，用于在客户端存储**大量的结构化数据**（也包括文件/二进制大型对象（*blobs*））。该 API 使用索引实现对数据的高性能搜索。虽然 *Web Storage* 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 IndexedDB 提供了这种场景的解决方案。



通俗地说，*IndexedDB* 就是浏览器提供的**本地数据库**，它可以被网页脚本创建和操作。*IndexedDB* 允许储存大量数据，提供查找接口，还能建立索引。这些都是 *LocalStorage* 所不具备的。就数据库类型而言，*IndexedDB* 不属于关系型数据库（不支持 *SQL* 查询语句），更接近 *NoSQL* 数据库。

下表罗列出了几种常见的客户端存储方式的对比：

|          | 会话期 Cookie      | 持久性 Cookie            | sessionStorage   | localStorage             | IndexedDB      | WebSQL |
| -------- | ------------------ | ------------------------ | ---------------- | ------------------------ | -------------- | ------ |
| 存储大小 | 4kb                | 4kb                      | 2.5~10MB         | 2.5~10MB                 | >250MB         | 已废弃 |
| 失效时间 | 浏览器关闭自动清除 | 设置过期时间，到期后清除 | 浏览器关闭后清除 | 永久保存（除非手动清除） | 手动更新或删除 | 已废弃 |



*IndexedDB* 具有以下特点。

- **键值对储存**：*IndexedDB* 内部采用对象仓库（ *object store* ）存放数据。所有类型的数据都可以直接存入，包括 *JavaScript* 对象。对象仓库中，数据以“键值对”的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。

- **异步**：*IndexedDB* 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 *LocalStorage* 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。

- **支持事务**：*IndexedDB* 支持事务（ *transaction* ），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。这和 *MySQL* 等数据库的事务类似。

- **同源限制**：*IndexedDB* 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

- **储存空间大**：这是 *IndexedDB* 最显著的特点之一。*IndexedDB* 的储存空间比 *LocalStorage* 大得多，一般来说不少于 *250MB*，甚至没有上限。

- **支持二进制储存**：*IndexedDB* 不仅可以储存字符串，还可以储存二进制数据（*ArrayBuffer* 对象和 *Blob* 对象）。

*IndexedDB* 主要使用在于客户端需要存储大量的数据的场景下：

- 数据可视化等界面，大量数据，每次请求会消耗很大性能。

- 即时聊天工具，大量消息需要存在本地。

- 其它存储方式容量不满足时，不得已使用 *IndexedDB*

#### IndexedDB重要概念

在正式开始之前，我们先来介绍一下 *IndexedDB* 里面一些重要的概念。

*IndexedDB* 是一个比较复杂的 *API*，涉及不少概念。它把不同的实体，抽象成一个个对象接口。学习这个 *API*，就是学习它的各种对象接口。

- 数据库：*IDBDatabase* 对象

- 对象仓库：*IDBObjectStore* 对象

- 索引：*IDBIndex* 对象

- 事务：*IDBTransaction* 对象

- 操作请求：*IDBRequest* 对象

- 指针：*IDBCursor* 对象

- 主键集合：*IDBKeyRange* 对象

下面是一些主要的概念。

（1）数据库

数据库是一系列相关数据的容器。每个域名（严格的说，是协议 + 域名 + 端口）都可以新建任意多个数据库。

*IndexedDB* 数据库有版本的概念。同一个时刻，只能有一个版本的数据库存在。如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成。

（2）对象仓库

每个数据库包含若干个对象仓库（ *object store* ）。它类似于关系型数据库的**表格**。

（3）数据记录

对象仓库保存的是数据记录。每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。主键用来建立默认的索引，必须是不同的，否则会报错。主键可以是数据记录里面的一个属性，也可以指定为一个递增的整数编号。

```js
{ id: 1, text: 'foo' }
```

上面的对象中，*id* 属性可以当作主键。

数据体可以是任意数据类型，不限于对象。

（4）索引

为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引。

在关系型数据库当中也有索引的概念，我们可以给对应的表字段添加索引，以便加快查找速率。在 *IndexedDB* 中同样有索引，我们可以在创建 *store* 的时候同时创建索引，在后续对 *store* 进行查询的时候即可通过索引来筛选，给某个字段添加索引后，在后续插入数据的过成功，索引字段便不能为空。

（5）事务

数据记录的读写和删改，都要通过事务完成。事务对象提供 *error、abort* 和 *complete* 三个事件，用来监听操作结果。

（6）指针（游标）
游标是 *IndexedDB* 数据库新的概念，大家可以把游标想象为一个指针，比如我们要查询满足某一条件的所有数据时，就需要用到游标，我们让游标一行一行的往下走，游标走到的地方便会返回这一行数据，此时我们便可对此行数据进行判断，是否满足条件。

#### IndexedDB实操

*IndexedDB* 所有针对仓库的操作都是基于事务的。

在正式开始之前，我们先创建如下的项目结构：

 <img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015307.png" alt="image-20211201095256757" style="zoom:50%;" />



该项目目录下存在 *2* 个文件，其中 *db.js* 是用来封装各种数据库操作的。

##### 操作数据库

首先第一步是创建以及连接数据库。

*db.js*

```js
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
function openDB(dbName, version = 1) {
    return new Promise((resolve, reject) => {
        var db; // 存储创建的数据库
        // 打开数据库，若没有则会创建
        const request = indexedDB.open(dbName, version);

        // 数据库打开成功回调
        request.onsuccess = function (event) {
            db = event.target.result; // 存储数据库对象
            console.log("数据库打开成功");
            resolve(db);
        };

        // 数据库打开失败的回调
        request.onerror = function (event) {
            console.log("数据库打开报错");
        };

        // 数据库有更新时候的回调
        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            console.log("onupgradeneeded");
            db = event.target.result; // 存储数据库对象
            var objectStore;
            // 创建存储库
            objectStore = db.createObjectStore("stu", {
                keyPath: "stuId", // 这是主键
                autoIncrement: true // 实现自增
            });
            // 创建索引，在后面查询数据的时候可以根据索引查
            objectStore.createIndex("stuId", "stuId", { unique: true });
            objectStore.createIndex("stuName", "stuName", { unique: false });
            objectStore.createIndex("stuAge", "stuAge", { unique: false });
        };
    });
}
```

在上面的代码中，我们封装了一个 *openDB* 的函数，该函数调用 *indexedDB.open* 方法来尝试打开一个数据库，如果该数据库不存在，就会创建。

*indexedDB.open* 方法返回一个对象，我们在这个对象上面分别监听了成功、错误以及更新这三个事件。

这里尤其要说一下 *upgradeneeded* 更新事件。该事件会在数据库发生更新时触发，什么叫做数据库有更新时呢？就是添加或删除表，以及数据库版本号更新的时候。

因为一开始创建数据库时，版本是从无到有，所以也会触发这个事件。

*index.html*

```html
<body>
    <script src="./db.js"></script>
    <script>
        openDB('stuDB',1)
    </script>
</body>
```

在 *index.html* 文件中，我们引入了 *db.js*，然后调用了 *openDB* 方法，效果如下图所示。

![image-20211201095341185](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015341.png)



使用完数据库后，建议关闭数据库，以节约资源。

```js
/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
function closeDB(db) {
  db.close();
  console.log("数据库已关闭");
}
```

如果要删除数据库，可以使用 *indexDB* 的 *deleteDatabase* 方法即可。

```js
/**
 * 删除数据库
 * @param {object} dbName 数据库名称
 */
function deleteDBAll(dbName) {
  console.log(dbName);
  let deleteRequest = window.indexedDB.deleteDatabase(dbName);
  deleteRequest.onerror = function (event) {
    console.log("删除失败");
  };
  deleteRequest.onsuccess = function (event) {
    console.log("删除成功");
  };
}
```

##### 插入数据

接下来是插入数据，我们仍然封装一个 *addData* 方法，代码如下：

```js
/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
function addData(db, storeName, data) {
    var request = db
        .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(data);

    request.onsuccess = function (event) {
        console.log("数据写入成功");
    };

    request.onerror = function (event) {
        console.log("数据写入失败");
    };
}
```

*IndexedDB* 插入数据需要通过事务来进行操作，插入的方法也很简单，利用 *IndexedDB* 提供的 *add* 方法即可，这里我们同样将插入数据的操作封装成了一个函数，接收三个参数，分别如下：

- *db*：在创建或连接数据库时，返回的 *db* 实例，需要那个时候保存下来。
- *storeName*：仓库名称(或者表名)，在创建或连接数据库时我们就已经创建好了仓库。
- *data*：需要插入的数据，通常是一个对象。

接下来我们在 *index.html* 中来测试。

```html
<body>
    <script src="./db.js"></script>
    <script>
        openDB('stuDB', 1)
            .then((db) => {
                addData(db, "stu", { "stuId": 1, "stuName": "谢杰", "stuAge": 18 });
                addData(db, "stu", { "stuId": 2, "stuName": "雅静", "stuAge": 20 });
                addData(db, "stu", { "stuId": 3, "stuName": "谢希之", "stuAge": 4 });
            })
    </script>
</body>
```

效果如下：



![image-20211201095402192](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015402.png)



>注意：插入的数据是一个对象，而且必须包含我们声明的索引键值对。

##### 读取数据

读取数据根据需求的不同有不同的读取方式。

**通过主键读取数据**

```js
/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        var transaction = db.transaction([storeName]); // 事务
        var objectStore = transaction.objectStore(storeName); // 仓库对象
        var request = objectStore.get(key); // 通过主键获取数据

        request.onerror = function (event) {
            console.log("事务失败");
        };

        request.onsuccess = function (event) {
            console.log("主键查询结果: ", request.result);
            resolve(request.result);
        };
    });
}
```

在我在仓库对象上面调用 *get* 方法从而通过主键获取数据。

*index.html*

```html
<body>
    <script src="./db.js"></script>
    <script>
        openDB('stuDB', 1)
            .then((db) => {
                addData(db, "stu", { "stuId": 1, "stuName": "谢杰", "stuAge": 18 });
                addData(db, "stu", { "stuId": 2, "stuName": "雅静", "stuAge": 20 });
                addData(db, "stu", { "stuId": 3, "stuName": "谢希之", "stuAge": 4 });
                return getDataByKey(db, "stu", 2);
            }).then((stuInfo)=>{
                console.log(stuInfo); // {stuId: 2, stuName: '雅静', stuAge: 20}
            })
    </script>
</body>
```

在 *index.html* 中进行测试，调用上面封装的 *getDataByKey* 方法，可以看到返回了主键 *stuId* 为 *2* 的学生数据。

**查询整张表的内容**

仓库对象也提供了 *getAll* 方法， 能够查询整张表的数据内容。

*db.js*

```js
/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        ...
        var request = objectStore.getAll(); // 通过主键获取数据
        ...
    });
}
```

在 *index.html* 中调用方法时就需要再传递第三个参数作为 *key* 了。

```js
openDB('stuDB', 1)
.then((db) => {
    addData(db, "stu", { "stuId": 1, "stuName": "谢杰", "stuAge": 18 });
    addData(db, "stu", { "stuId": 2, "stuName": "雅静", "stuAge": 20 });
    addData(db, "stu", { "stuId": 3, "stuName": "谢希之", "stuAge": 4 });
    return getDataByKey(db, "stu");
}).then((stuInfo)=>{
    console.log(stuInfo); // 会查询到该表的所有数据
})
```

**指针查询**

```js
/**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
function cursorGetData(db, storeName) {
    return new Promise((resolve, reject) => {
        let list = [];
        var store = db
            .transaction(storeName, "readwrite") // 事务
            .objectStore(storeName); // 仓库对象
        var request = store.openCursor(); // 指针对象
        // 游标开启成功，逐行读数据
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                // 必须要检查
                list.push(cursor.value);
                cursor.continue(); // 遍历了存储对象中的所有内容
            } else {
                resolve(list)
            }
        };
    })
}
```

在上面的代码中，我们通过仓库对象的 *openCursor* 方法开启了一个指针，这个指针会指向数据表的第一条数据，之后指针逐项进行偏移从而遍历整个数据表。

所以每次偏移拿到数据后，我们 *push* 到 *list* 数组里面，如果某一次没有拿到数据，说明已经读取完了所有的数据，那么我们就返回 *list* 数组。

*indx.html*

```js
openDB('stuDB', 1)
.then((db) => {
    addData(db, "stu", { "stuId": 1, "stuName": "谢杰", "stuAge": 18 });
    addData(db, "stu", { "stuId": 2, "stuName": "雅静", "stuAge": 20 });
    addData(db, "stu", { "stuId": 3, "stuName": "谢希之", "stuAge": 4 });
    return cursorGetData(db, "stu");
}).then((stuInfo)=>{
    console.log(stuInfo); 
})
```

目前为止，我们的精准查询只能通过主键来进行查询。但是更多的场景是我们压根儿就不知道某一条数据的主键。例如我们要查询学生姓名为“张三”的学生数据，对于我们来讲，我们知道的信息只有学生姓名“张三”。

**索引查询数据**。

*db.js*

```js
/**
 * 通过索引读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
function getDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        var store = db.transaction(storeName, "readwrite").objectStore(storeName);
        var request = store.index(indexName).get(indexValue);
        request.onerror = function () {
            console.log("事务失败");
        };
        request.onsuccess = function (e) {
            var result = e.target.result;
            resolve(result);
        };
    })
}
```

在上面的方法中，我们通过仓库对象的 *index* 方法传入了索引名称，然后链式调用 *get* 方法传入索引的值来得到最终的查询结果。

*index.html*

```js
openDB('stuDB', 1)
.then((db) => {
    addData(db, "stu", { "stuId": 4, "stuName": "牛牛", "stuAge": 4 });
    return getDataByIndex(db, "stu", "stuAge", 4);
}).then((stuInfo) => {
    console.log(stuInfo); // {stuId: 3, stuName: '谢希之', stuAge: 4}
})
```

在 *index.html* 中我们新增了一条数据，年龄也为 *4*，当前的数据库表信息如下：

![image-20211201095425944](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015426.png)



但是很奇怪的是我们查询出来的数据却只有第一条符合要求的。

如果我们想要查询出索引中满足某些条件的所有数据，可以将索引和游标结合起来。

*db.js*

```js
/**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        let list = [];
        var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
        var request = store
            .index(indexName) // 索引对象
            .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                // 必须要检查
                list.push(cursor.value);
                cursor.continue(); // 遍历了存储对象中的所有内容
            } else {
                resolve(list)
            }
        };
        request.onerror = function (e) { };
    })
}
```

在上面的方法中，我们仍然是使用仓库对象的 *index* 方法进行索引查询，但是之后链式调用的时候不再是使用 *get* 方法传入索引值，而是调用了 *openCursor* 来打开一个指针，并且让指针指向满足索引值的数据，之后和前面一样，符合要求的数据推入到 *list* 数组，最后返回 *list* 数组。

当然，你可能很好奇 *IDBKeyRange* 的 *only* 方法是什么意思，除了 *only* 方法还有其他方法么？

*IDBKeyRange* 对象代表数据仓库（*object store*）里面的一组主键。根据这组主键，可以获取数据仓库或索引里面的一组记录。

*IDBKeyRange* 可以只包含一个值，也可以指定上限和下限。它有四个静态方法，用来指定主键的范围。

- *IDBKeyRange.lowerBound( )*：指定下限。

- *IDBKeyRange.upperBound( )*：指定上限。

- *IDBKeyRange.bound( )*：同时指定上下限。

- *IDBKeyRange.only( )*：指定只包含一个值。

下面是一些代码实例。

```js
// All keys ≤ x
var r1 = IDBKeyRange.upperBound(x);

// All keys < x
var r2 = IDBKeyRange.upperBound(x, true);

// All keys ≥ y
var r3 = IDBKeyRange.lowerBound(y);

// All keys > y
var r4 = IDBKeyRange.lowerBound(y, true);

// All keys ≥ x && ≤ y
var r5 = IDBKeyRange.bound(x, y);

// All keys > x &&< y
var r6 = IDBKeyRange.bound(x, y, true, true);

// All keys > x && ≤ y
var r7 = IDBKeyRange.bound(x, y, true, false);

// All keys ≥ x &&< y
var r8 = IDBKeyRange.bound(x, y, false, true);

// The key = z
var r9 = IDBKeyRange.only(z);
```

例如我们来查询年龄大于 *4* 岁的学生，其代码片段如下：

```js
function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        ...
        var request = store
            .index(indexName) // 索引对象
            .openCursor(IDBKeyRange.lowerBound(indexValue, true)); // 指针对象
        ...
    })

}
```

利用索引和游标结合查询，我们可以查询出索引值满足我们传入函数值的所有数据对象，而不是只查询出一条数据或者所有数据。

*IndexedDB* 分页查询不像 *MySQL* 分页查询那么简单，没有提供现成的 *API*，如 *limit* 等，所以需要我们自己实现分页。

```js
/**
 * 通过索引和游标分页查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 * @param {number} page 页码
 * @param {number} pageSize 查询条数
 */
function cursorGetDataByIndexAndPage(
    db,
    storeName,
    indexName,
    indexValue,
    page,
    pageSize
) {
    return new Promise((resolve, reject) => {
        var list = [];
        var counter = 0; // 计数器
        var advanced = true; // 是否跳过多少条查询
        var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
        var request = store
            // .index(indexName) // 索引对象
            // .openCursor(IDBKeyRange.only(indexValue)); // 按照指定值分页查询（配合索引）
            .openCursor(); // 指针对象
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            if (page > 1 && advanced) {
                advanced = false;
                cursor.advance((page - 1) * pageSize); // 跳过多少条
                return;
            }
            if (cursor) {
                // 必须要检查
                list.push(cursor.value);
                counter++;
                if (counter < pageSize) {
                    cursor.continue(); // 遍历了存储对象中的所有内容
                } else {
                    cursor = null;
                    resolve(list);
                }
            } else {
                resolve(list);
            }
        };
        request.onerror = function (e) { };
    })
}
```

这里用到了 *IndexedDB* 的一个 *API*：*advance*。

该函数可以让我们的游标跳过多少条开始查询。假如我们的额分页是每页 *5* 条数据，现在需要查询第 *2* 页，那么我们就需要跳过前面 *5* 条数据，从第 *6* 条数据开始查询，直到计数器等于 *5*，那么我们就关闭游标，结束查询。

下面在 *index.html* 中进行测试如下：

```html
<body>
    <script src="./db.js"></script>
    <script>
        openDB('stuDB', 1)
            .then((db) => {
                addData(db, "stu", { "stuId": 5, "stuName": "张三", "stuAge": 23 });
                addData(db, "stu", { "stuId": 6, "stuName": "李四", "stuAge": 24 });
                addData(db, "stu", { "stuId": 7, "stuName": "王武", "stuAge": 32 });
                addData(db, "stu", { "stuId": 8, "stuName": "刘德华", "stuAge": 34 });
                addData(db, "stu", { "stuId": 9, "stuName": "张学友", "stuAge": 28 });
                addData(db, "stu", { "stuId": 10, "stuName": "郭富城", "stuAge": 27 });
                addData(db, "stu", { "stuId": 11, "stuName": "黎明", "stuAge": 17 });
                addData(db, "stu", { "stuId": 12, "stuName": "邓超", "stuAge": 19 });
                addData(db, "stu", { "stuId": 13, "stuName": "刘翔", "stuAge": 15 });
                addData(db, "stu", { "stuId": 14, "stuName": "洋洋", "stuAge": 12 });
                addData(db, "stu", { "stuId": 15, "stuName": "林佳音", "stuAge": 14 });
                addData(db, "stu", { "stuId": 16, "stuName": "袁进", "stuAge": 34 });
                addData(db, "stu", { "stuId": 17, "stuName": "老闫", "stuAge": 36 });
                addData(db, "stu", { "stuId": 18, "stuName": "沈爷", "stuAge": 34 });
                return cursorGetDataByIndexAndPage(db, "stu", "", "", 3, 5);
            }).then((stuInfo) => {
                console.log(stuInfo); // {stuId: 3, stuName: '谢希之', stuAge: 4}
            })
    </script>
</body>
```

在上面的代码中，我们为了实现分页效果，添加了一些数据。然后查询第 *3* 页的内容。

![image-20211201095452722](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015453.png)

查询结果如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015510.png" alt="image-20211201095509714" style="zoom:50%;" />



##### 更新数据

*IndexedDB* 更新数据较为简单，直接使用 *put* 方法，值得注意的是如果数据库中没有该条数据，则会默认增加该条数据，否则更新。

有些小伙伴喜欢更新和新增都是用 *put* 方法，这也是可行的。

*db.js*

```js
/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
function updateDB(db, storeName, data) {
    return new Promise((resolve, reject) => {
        var request = db
            .transaction([storeName], "readwrite") // 事务对象
            .objectStore(storeName) // 仓库对象
            .put(data);

        request.onsuccess = function () {
            resolve({
                status: true,
                message: "更新数据成功"
            })
        };

        request.onerror = function () {
            reject({
                status: false,
                message: "更新数据失败"
            })
        };
    })
}
```

在上面的方法中，我们使用仓库对象的 *put* 方法来修改数据，所以在调用该方法时，需要传入整条数据对象，特别是主键。因为是通过主键来查询到要修改的数据。

如果传入的数据没有主键，则是一个新增数据的效果。

*index.html*

```js
openDB('stuDB', 1)
    .then((db) => {
        return updateDB(db, "stu", {stuId: 1, stuName: '谢杰2', stuAge: 19});
    }).then(({message}) => {
        console.log(message); 
    })
```

效果如下：

![image-20211201095532213](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015532.png)

##### 删除数据

删除数据这里记录 *2* 种方式，一个是通过主键来进行删除。

*db.js*

```js
/**
 * 通过主键删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} id 主键值
 */
function deleteDB(db, storeName, id) {
    return new Promise((resolve, reject) => {
        var request = db
            .transaction([storeName], "readwrite")
            .objectStore(storeName)
            .delete(id);

        request.onsuccess = function () {
            resolve({
                status: true,
                message: "删除数据成功"
            })
        };

        request.onerror = function () {
            reject({
                status: true,
                message: "删除数据失败"
            })
        };
    })
}
```

*index.html*

```js
openDB('stuDB', 1)
    .then((db) => {
        return deleteDB(db, "stu", 1)
    }).then(({message}) => {
        console.log(message); 
    })
```

执行上面的代码后 *stuId* 为 *1* 的学生被删除掉。

有时候我们拿不到主键值，只能只能通过索引值来删除。通过这种方式，我们可以删除一条数据（索引值唯一）或者所有满足条件的数据（索引值不唯一）。

*db.js*

```js
/**
 * 通过索引和游标删除指定的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
function cursorDelete(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        var store = db.transaction(storeName, "readwrite").objectStore(storeName);
        var request = store
            .index(indexName) // 索引对象
            .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
        request.onsuccess = function (e) {
            var cursor = e.target.result;
            var deleteRequest;
            if (cursor) {
                deleteRequest = cursor.delete(); // 请求删除当前项
                deleteRequest.onsuccess = function () {
                    console.log("游标删除该记录成功");
                    resolve({
                        status: true,
                        message: "游标删除该记录成功"
                    })
                };
                deleteRequest.onerror = function () {
                    reject({
                        status: false,
                        message: "游标删除该记录失败"
                    })
                };
                cursor.continue();
            }
        };
        request.onerror = function (e) { };
    })
}
```

*index.html*

```js
openDB('stuDB', 1)
    .then((db) => {
        return cursorDelete(db, "stu", "stuName", "雅静")
    }).then(({ message }) => {
        console.log(message);
    })
```

在上面的示例中，我们就删除了所有 *stuName* 值为 “雅静” 的同学。


-------

以上，就是关于 *IndexedDB* 的基本操作。

可以看到，在了解了它的几个基本概念后，上手还是比较容易的。

另外由于 *IndexedDB* 所提供的原生 *API* 比较复杂，所以现在也出现了基于 *IndexedDB* 封装的库。例如 *Dexie.js*。

![image-20211201095555138](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-01-015556.png)

（图为 *Dexie.js* 官网部分截图）



*Dexie.js* 官网：*https://dexie.org/*



该库和 *IndexedDB* 之间的关系，就类似于 *jQuery* 和 *JavaScript* 之间的关系。有兴趣的同学可以自行进行研究，这里就不再做过多的赘述。



如果想了解 *IndexedDB* 相关的更多 *API*，可以扩展阅读：*https://www.wangdoc.com/javascript/bom/indexeddb.html*





## File API

### *File API* 介绍

我们知道，*HTML* 的 *input* 表单控件，其 *type* 属性可以设置为 *file*，表示这是一个上传控件。

```html
<input type="file" name="" id="">
```

选择文件前：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-02-022039.png" alt="image-20211202102038796" style="zoom:50%;" />

选择文件后：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-02-022057.png" alt="image-20211202102056757" style="zoom:50%;" />

这种做法用户体验非常的差，我们无法**在客户端**对用户选取的文件进行 *validate*，无法读取文件大小，无法判断文件类型，无法预览。

如果是多文件上传，*JavaScript* 更是回天乏力。

```html
<input type="file" name="" id="" multiple>
```



<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-02-022115.png" alt="image-20211202102115626" style="zoom:50%;" />

但现在有了 *HTML5* 提供的 *File API*，一切都不同了。该接口允许 *JavaScript* 读取本地文件，但并不能直接访问本地文件，而是要依赖于用户行为，比如用户在 *type='file'* 控件上选择了某个文件或者用户将文件拖拽到浏览器上。

*File Api* 提供了以下几个接口来访问本地文件系统：

- *File*：单个文件，提供了诸如 *name、file size、mimetype* 等只读文件属性

- *FileList*：一个类数组 *File* 对象集合

- *FileReader*：异步读取文件的接口

- *Blob*：文件对象的二进制原始数据



### *File* 对象

*File* 对象代表一个文件，用来读写文件信息。它继承了 *Blob* 对象，或者说是一种特殊的 *Blob* 对象，所有可以使用 *Blob* 对象的场合都可以使用它。

最常见的使用场合是表单的文件上传控件（\<*input type="file"*>），用户选中文件以后，浏览器就会生成一个数组，里面是每一个用户选中的文件，它们都是 *File* 实例对象。

```html
<input type="file" name="" id="file">
```

```js
// 获取 DOM 元素
var file = document.getElementById('file');
file.onchange = function(event){
    var files = event.target.files;
    console.log(files);
    console.log(files[0] instanceof File);
}
```

上面代码中，*files[0]* 是用户选中的第一个文件，它是 *File* 的实例。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-02-022135.png" alt="image-20211202102135071" style="zoom:50%;" />



#### 构造函数

浏览器原生提供一个 *File( )* 构造函数，用来生成 *File* 实例对象。

```js
new File(array, name [, options])
```

*File( )* 构造函数接受三个参数。

- *array*：一个数组，成员可以是二进制对象或字符串，表示文件的内容。

- *name*：字符串，表示文件名或文件路径。

- *options*：配置对象，设置实例的属性。该参数可选。

第三个参数配置对象，可以设置两个属性。

- *type*：字符串，表示实例对象的 *MIME* 类型，默认值为空字符串。

- *lastModified*：时间戳，表示上次修改的时间，默认为 *Date.now( )*。

下面是一个例子。

```js
var file = new File(
  ['foo'],
  'foo.txt',
  {
    type: 'text/plain',
  }
);
```

#### 实例属性和实例方法

*File* 对象有以下实例属性。

- *File.lastModified*：最后修改时间

- *File.name*：文件名或文件路径

- *File.size*：文件大小（单位字节）

- *File.type*：文件的 *MIME* 类型

```js
var file = new File(
    ['foo'],
    'foo.txt',
    {
        type: 'text/plain',
    }
);
console.log(file.lastModified); // 1638340865992
console.log(file.name); // foo.txt
console.log(file.size); // 3
console.log(file.type); // text/plain
```

在上面的代码中，我们创建了一个 *File* 文件对象实例，并打印出了该文件对象的诸如 *lastModified、name、size、type* 等属性信息。

*File* 对象没有自己的实例方法，由于继承了 *Blob* 对象，因此可以使用 *Blob* 的实例方法 *slice( )*。



### *FileList* 对象

*FileList* 对象是一个类似数组的对象，代表一组选中的文件，每个成员都是一个 *File* 实例。

在最上面的那个示例中，我们就可以看到触发 *change* 事件后，*event.target.files* 拿到的就是一个 *FileList* 实例对象。

它主要出现在两个场合。

- 文件控件节点（\<*input type="file"*>）的 *files* 属性，返回一个 *FileList* 实例。

- 拖拉一组文件时，目标区的 *DataTransfer.files* 属性，返回一个 *FileList* 实例。

```html
<body>
    <input type="file" name="" id="file">
    <script>
        // 获取 DOM 元素
        var file = document.getElementById('file');
        file.onchange = function(event){
            var files = event.target.files;
            console.log(files);
            console.log(files instanceof FileList);
        }
    </script>
</body>
```

上面代码中，文件控件的 *files* 属性是一个 *FileList* 实例。

*FileList* 的实例属性主要是 *length*，表示包含多少个文件。

*FileList* 的实例方法主要是 *item( )*，用来返回指定位置的实例。它接受一个整数作为参数，表示位置的序号（从零开始）。

但是，由于 *FileList* 的实例是一个类似数组的对象，可以直接用方括号运算符，即 *myFileList[0]* 等同于 *myFileList.item(0)*，所以一般用不到 *item( )* 方法。



### *FileReader* 对象

*FileReader* 对象用于读取 *File* 对象或 *Blob* 对象所包含的文件内容。

浏览器原生提供一个 *FileReader* 构造函数，用来生成 *FileReader* 实例。

```js
var reader = new FileReader();
```

*FileReader* 有以下的实例属性。

- *FileReader.error*：读取文件时产生的错误对象

- *FileReader.readyState*：整数，表示读取文件时的当前状态。一共有三种可能的状态，*0* 表示尚未加载任何数据，*1* 表示数据正在加载，*2* 表示加载完成。

- *FileReader.result*：读取完成后的文件内容，有可能是字符串，也可能是一个 *ArrayBuffer* 实例。

- *FileReader.onabort*：*abort* 事件（用户终止读取操作）的监听函数。

- *FileReader.onerror*：*error* 事件（读取错误）的监听函数。

- *FileReader.onload*：*load* 事件（读取操作完成）的监听函数，通常在这个函数里面使用 *result* 属性，拿到文件内容。

- *FileReader.onloadstart*：*loadstart* 事件（读取操作开始）的监听函数。

- *FileReader.onloadend*：*loadend* 事件（读取操作结束）的监听函数。

- *FileReader.onprogress*：*progress* 事件（读取操作进行中）的监听函数。

下面是监听 *load* 事件的一个例子。

```html
<body>
    <input type="file" name="" id="file">
    <script>
        // 获取 DOM 元素
        var file = document.getElementById('file');
        file.onchange = function (event) {
            var file = event.target.files[0]; // 拿到第一个文件
            var reader = new FileReader(); // 创建一个 FileReader 实例对象
            // 读取文件成功后触发 load 事件
            reader.onload = function (event) {
                console.log(event.target.result)
            };
            // 读取文件
            reader.readAsText(file);
        }
    </script>
</body>
```

上面代码中，每当文件控件发生变化，就尝试读取第一个文件。如果读取成功（ *load* 事件发生），就打印出文件内容。

*FileReader* 有以下实例方法。

- *FileReader.abort( )*：终止读取操作，*readyState* 属性将变成 *2*。

- *FileReader.readAsArrayBuffer( )*：以 *ArrayBuffer* 的格式读取文件，读取完成后 *result* 属性将返回一个 *ArrayBuffer* 实例。

- *FileReader.readAsBinaryString( )*：读取完成后，*result* 属性将返回原始的二进制字符串。

- *FileReader.readAsDataURL( )*：读取完成后，*result* 属性将返回一个 *Data URL* 格式（ *Base64* 编码）的字符串，代表文件内容。对于图片文件，这个字符串可以用于 \<*img*> 元素的 *src* 属性。注意，这个字符串不能直接进行 *Base64* 解码，必须把前缀 `data:*/*;base64,` 从字符串里删除以后，再进行解码。

- *FileReader.readAsText( )*：读取完成后，*result* 属性将返回文件内容的文本字符串。该方法的第一个参数是代表文件的 *Blob* 实例，第二个参数是可选的，表示文本编码，默认为 *UTF-8*。

下面是一个读取图片文件的例子。

```html
<input type="file" name="" id="file">
<img src="" alt="" width="200"/>
```

```js
// 获取 DOM 元素
var file = document.getElementById('file');
file.onchange = function () {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function () {
        preview.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
};
```

上面代码中，用户选中图片文件以后，脚本会自动读取文件内容，然后作为一个 *Data URL* 赋值给 \<*img*> 元素的 *src* 属性，从而把图片展示出来。



### 综合实例

最后，我们通过一个综合实例来贯穿上面所学的内容。

*HTML*

```html
<label>
    <input type="file" name="" id="file">
    <div class="uploadImg">
        <!-- 制作中间的十字架 -->
        <div class="cross"></div>
    </div>
</label>
```

*CSS*

```css
.uploadImg {
    width: 150px;
    height: 150px;
    border: 1px dashed skyblue;
    border-radius: 30px;
    position: relative;
    cursor: pointer;
}

.cross {
    width: 30px;
    height: 30px;
    position: absolute;
    left: calc(50% - 15px);
    top: calc(50% - 15px);
}

.cross::before {
    content: "";
    width: 30px;
    height: 2px;
    background-color: skyblue;
    position: absolute;
    top: calc(50% - 1px);
}

.cross::after {
    content: "";
    width: 30px;
    height: 2px;
    background-color: skyblue;
    position: absolute;
    left: calc(50% - 15px);
    top: calc(50% - 1px);
    transform: rotate(90deg);
}

input[type="file"] {
    display: none;
}
```

*JS*

```js
var file = document.querySelector("#file");
var div = document.querySelector(".uploadImg");
var cross = document.querySelector(".cross");
console.log(div.firstChild);
file.onchange = function () {
    // 创建 filereader 用来读取文件
    var reader = new FileReader();
    // 获取到文件内容
    var content = file.files[0];
    if (content) {
        reader.readAsDataURL(content);
    }
    reader.onload = function () {
        // 设置 div 背景图像从而实现预览效果
        div.style.background = `url(${reader.result}) center/cover no-repeat`
        cross.style.opacity = 0;
    }
}
```



### *File System Access API*

看上去上面的 *File API* 还不错，能够读取到本地的文件，但是它和离线存储有啥关系？

我们要的是离线存储功能，能够将数据存储到本地。

嗯，确实 *File API* 只能够做读取的工作，但是有一套新的 *API* 规范又推出来了，叫做 *File System Access API*。

是的，你没有听错，这是**两套规范**，千万没弄混淆了。

- *File API* 规范：*https://w3c.github.io/FileAPI/*

- *File System Access API* 规范：*https://wicg.github.io/file-system-access/*

关于 *File System Access API*，这套方案应该是未来的主角。它提供了比较稳妥的本地文件交互模式，即保证了实用价值，又保障了用户的数据安全。

这个 *API* 对前端来说意义不小。有了这个功能，*Web* 可以提供更完整的功能链路，从打开、到编辑、到保存，一套到底。不过遗憾的是目前只有 *Chrome* 支持。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-02-022204.png" alt="image-20211202102203944" style="zoom:50%;" />

（图为该 *API* 目前在各大浏览器的支持情况，可以看到全线飙红）

目前针对该 *API* 的相关资料，无论是中文还是英文都比较少，如果对该 API 感兴趣的同学，下面给出两个扩展阅读资料（英文）

- *MDN*：*https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API*

- *web.dev*：*https://web.dev/file-system-access/*

## 浏览器缓存

### 什么是浏览器缓存

在正式开始讲解浏览器缓存之前，我们先来回顾一下整个 *Web* 应用的流程。

![image-20211203143550954](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063551.png)



上图展示了一个 *Web* 应用最最简单的结构。客户端向服务器端发送 *HTTP* 请求，服务器端从数据库获取数据，然后进行计算处理，之后向客户端返回 *HTTP* 响应。

那么上面整个流程中，哪些地方比较耗费时间呢？总结起来有如下两个方面：

- 发送请求的时候

- 涉及到大量计算的时候

一般来讲，上面两个阶段比较耗费时间。

首先是发送请求的时候。这里所说的请求，不仅仅是 *HTTP* 请求，也包括服务器向数据库发起查询数据的请求。

其次是大量计算的时候。一般涉及到大量计算，主要是在服务器端和数据库端，服务器端要进行计算这个很好理解，数据库要根据服务器发送过来的查询命令查询到对应的数据，这也是比较耗时的一项工作。

因此，单论缓存的话，我们其实在很多地方都可以做缓存。例如：

- 数据库缓存
- *CDN* 缓存
- 代理服务器缓存
- 浏览器缓存
- 应用层缓存

针对各个地方做出适当的缓存，都能够很大程度的优化整个 *Web* 应用的性能。但是要逐一讨论的话，是一个非常大的工程量，所以本文我们主要来看一下浏览器缓存，这也是和我们前端开发息息相关的。

整个浏览器的缓存过程如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063613.png" alt="image-20211203143612695" style="zoom:50%;" />



从上图我们可以看到，整个浏览器端的缓存其实没有想象的那么复杂。其最基本的原理就是：

- 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识

- 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中

以上两点结论就是浏览器缓存机制的关键，它确保了每个请求的缓存存入与读取，只要我们再理解浏览器缓存的使用规则，那么所有的问题就迎刃而解了。

接下来，我将从两个维度来介绍浏览器缓存：

- 缓存的存储位置

- 缓存的类型

### 按照缓存位置分类

从缓存位置上来说分为四种，并且各自有优先级，当依次查找缓存且都没有命中的时候，才会去请求网络。这四种依次为：

- *Service Worker*
- *Memory Cache*
- *Disk Cache*
- *Push Cache*

#### Service Worker

*Service Worker* 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。

使用 *Service Worker* 的话，传输协议必须为 *HTTPS*。因为 *Service Worker* 中涉及到请求拦截，所以必须使用 *HTTPS* 协议来保障安全。

*Service Worker* 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

*Service Worker* 实现缓存功能一般分为三个步骤：首先需要先注册 *Service Worker*，然后监听到 *install* 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。.

当 *Service Worker* 没有命中缓存的时候，我们需要去调用 *fetch* 函数获取数据。也就是说，如果我们没有在 *Service Worker* 命中缓存的话，会根据缓存查找优先级去查找数据。



![image-20211203143635717](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063636.png)



但是不管我们是从 *Memory Cache* 中还是从网络请求中获取的数据，浏览器都会显示我们是从 *Service Worker* 中获取的内容。

#### Memory Cash

*Memory Cache* 也就是内存中的缓存，主要包含的是当前中页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等。

读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。一旦我们关闭 *Tab* 页面，内存中的缓存也就被释放了。

那么既然内存缓存这么高效，我们是不是能让数据都存放在内存中呢？

这是不可能的。计算机中的内存一定比硬盘容量小得多，操作系统需要精打细算内存的使用，所以能让我们使用的内存必然不多。

当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存缓存。

![image-20211203143700033](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063700.png)



*Memory Cache* 机制保证了一个页面中如果有两个相同的请求。

例如两个 *src* 相同的 \<*img*>，两个 *href* 相同的 \<*link*>，都实际只会被请求最多一次，避免浪费。



#### Disk Cache

*Disk Cache* 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 *Memory Cache* 胜在容量和存储时效性上。

在所有浏览器缓存中，*Disk Cache* 覆盖面基本是最大的。它会根据 *HTTP Herder* 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。

并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。绝大部分的缓存都来自 *Disk Cache*。

凡是持久性存储都会面临容量增长的问题，*Disk Cache* 也不例外。

在浏览器自动清理时，会有特殊的算法去把“最老的”或者“最可能过时的”资源删除，因此是一个一个删除的。不过每个浏览器识别“最老的”和“最可能过时的”资源的算法不尽相同，这也可以看作是各个浏览器差异性的体现。



#### Push Cache

*Push Cache* 翻译成中文叫做“推送缓存”，是属于 *HTTP/2* 中新增的内容。

当以上三种缓存都没有命中时，它才会被使用。它只在会话（*Session*）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在 *Chrome* 浏览器中只有 *5* 分钟左右，同时它也并非严格执行 *HTTP/2* 头中的缓存指令。

*Push Cache* 在国内能够查到的资料很少，也是因为 *HTTP2* 在国内还不够普及。

这里推荐阅读 *Jake Archibald* 的 [*HTTP/2 push is tougher than I thought*](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/) 这篇文章。

文章中的几个结论：

- 所有的资源都能被推送，并且能够被缓存，但是 *Edge* 和 *Safari* 浏览器支持相对比较差

- 可以推送 *no-cache* 和 *no-store* 的资源

- 一旦连接被关闭，*Push Cache* 就被释放

- 多个页面可以使用同一个 *HTTP/2* 的连接，也就可以使用同一个 *Push Cache*。这主要还是依赖浏览器的实现而定，出于对性能的考虑，有的浏览器会对相同域名但不同的 *tab* 标签使用同一个 *HTTP* 连接。

- *Push Cache* 中的缓存只能被使用一次

- 浏览器可以拒绝接受已经存在的资源推送

- 你可以给其他域名推送资源


-------

如果一个请求在上述几个位置都没有找到缓存，那么浏览器会正式发送网络请求去获取内容。之后为了提升之后请求的缓存命中率，自然要把这个资源添加到缓存中去。具体来说：

- 根据 *Service Worker* 中的 *handler* 决定是否存入 *Cache Storage* (额外的缓存位置)。*Service Worker* 是由开发者编写的额外的脚本，且缓存位置独立，出现也较晚，使用还不算太广泛。

- *Memory Cache* 保存一份资源的引用，以备下次使用。*Memory Cache* 是浏览器为了加快读取缓存速度而进行的自身的优化行为，不受开发者控制，也不受 *HTTP* 协议头的约束，算是一个黑盒。

- 根据 *HTTP* 头部的相关字段（ *Cache-control、Pragma* 等 ）决定是否存入 *Disk Cache*。*Disk Cache* 也是平时我们最熟悉的一种缓存机制，也叫 *HTTP Cache* (因为不像 *Memory Cache*，它遵守 *HTTP* 协议头中的字段)。平时所说的强制缓存，协商缓存，以及 *Cache-Control* 等，也都归于此类。

### 按照缓存类型分类

按照缓存类型来进行分类，可以分为**强制缓存**和**协商缓存**。需要注意的是，无论是强制缓存还是协商缓存，都是属于 *Disk Cache* 或者叫做 *HTTP Cache* 里面的一种。

#### 强制缓存

强制缓存的含义是，当客户端请求后，会先访问缓存数据库看缓存是否存在。如果存在则直接返回；不存在则请求真的服务器，响应后再写入缓存数据库。

强制缓存直接减少请求数，是提升最大的缓存策略。如果考虑使用缓存来优化网页性能的话，强制缓存应该是首先被考虑的。

可以造成强制缓存的字段是 *Cache-control* 和 *Expires*。

**Expires**

这是 *HTTP 1.0* 的字段，表示缓存到期时间，是一个绝对的时间 (当前时间+缓存时间)，如：

```
Expires: Thu, 10 Nov 2017 08:45:11 GMT
```

在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。

但是，这个字段设置时有两个缺点：

- 由于是绝对时间，用户可能会将客户端本地的时间进行修改，而导致浏览器判断缓存失效，重新请求该资源。此外，即使不考虑自行修改的因素，时差或者误差等因素也可能造成客户端与服务端的时间不一致，致使缓存失效。

- 写法太复杂了。表示时间的字符串多个空格，少个字母，都会导致变为非法属性从而设置失效。

**Cache-control**

已知 *Expires* 的缺点之后，在 *HTTP/1.1* 中，增加了一个字段 *Cache-control*，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求

这两者的区别就是前者是绝对时间，而后者是相对时间。如下：

```
Cache-control: max-age=2592000
```

下面列举一些 *Cache-control* 字段常用的值：(完整的列表可以查看 [*MDN*](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control))

- *max-age*：即最大有效时间，在上面的例子中我们可以看到

- *must-revalidate*：如果超过了 *max-age* 的时间，浏览器必须向服务器发送请求，验证资源是否还有效。

- *no-cache*：虽然字面意思是“不要缓存”，但实际上还是要求客户端缓存内容的，只是是否使用这个内容由后续的协商缓存来决定。

- *no-store*：真正意义上的“不要缓存”。所有内容都不走缓存，包括强制缓存和协商缓存。

- *public*：所有的内容都可以被缓存（包括客户端和代理服务器， 如 *CDN* ）

- *private*：所有的内容只有客户端才可以缓存，代理服务器不能缓存。默认值。

这些值可以混合使用，例如 *Cache-control:public, max-age=2592000*。在混合使用时，它们的优先级如下图：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063734.png" alt="image-20211203143733448" style="zoom:50%;" />



>*max-age=0* 和 *no-cache* 等价吗？
>从规范的字面意思来说，*max-age* 到期是 应该（ *SHOULD* ）重新验证，而 *no-cache* 是 必须（ *MUST* ）重新验证。但实际情况以浏览器实现为准，大部分情况他们俩的行为还是一致的。（如果是 *max-age=0, must-revalidate* 就和 *no-cache* 等价了）

在 *HTTP/1.1* 之前，如果想使用 *no-cache*，通常是使用 *Pragma* 字段，如 *Pragma: no-cache*（这也是 *Pragma* 字段唯一的取值）。

但是这个字段只是浏览器约定俗成的实现，并没有确切规范，因此缺乏可靠性。它应该只作为一个兼容字段出现，在当前的网络环境下其实用处已经很小。

总结一下，自从 *HTTP/1.1* 开始，*Expires* 逐渐被 *Cache-control* 取代。

*Cache-control* 是一个相对时间，即使客户端时间发生改变，相对时间也不会随之改变，这样可以保持服务器和客户端的时间一致性。而且 *Cache-control* 的可配置性比较强大。*Cache-control* 的优先级高于 *Expires*。

为了兼容 *HTTP/1.0* 和 *HTTP/1.1*，实际项目中两个字段我们都会设置。

#### 协商缓存

当强制缓存失效（超过规定时间）时，就需要使用协商缓存，由服务器决定缓存内容是否失效。

流程上说，浏览器先请求缓存数据库，返回一个缓存标识。之后浏览器拿这个标识和服务器通讯。如果缓存未失效，则返回 *HTTP* 状态码 *304* 表示继续使用，于是客户端继续使用缓存；

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063801.png" alt="image-20211203143800447" style="zoom:50%;" />



如果失效，则返回新的数据和缓存规则，浏览器响应数据后，再把规则写入到缓存数据库。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063821.png" alt="image-20211203143820739" style="zoom:50%;" />



协商缓存在请求数上和没有缓存是一致的，但如果是 *304* 的话，返回的仅仅是一个状态码而已，并没有实际的文件内容，因此 在响应体体积上的节省是它的优化点。

它的优化主要体现在“响应”上面通过减少响应体体积，来缩短网络传输时间。所以和强制缓存相比提升幅度较小，但总比没有缓存好。

协商缓存是可以和强制缓存一起使用的，作为在强制缓存失效后的一种后备方案。实际项目中他们也的确经常一同出现。

对比缓存有 *2* 组字段（不是两个）：

- *Last-Modified & If-Modified-Since*

- *Etag & If-None-Match*

***Last-Modified & If-Modified-Since***

1. 服务器通过 *Last-Modified* 字段告知客户端，资源最后一次被修改的时间，例如：

    ```
    Last-Modified: Mon, 10 Nov 2018 09:10:11 GMT
    ```

2. 浏览器将这个值和内容一起记录在缓存数据库中。


3. 下一次请求相同资源时时，浏览器从自己的缓存中找出“不确定是否过期的”缓存。因此在请求头中将上次的 *Last-Modified* 的值写入到请求头的 *If-Modified-Since* 字段


4. 服务器会将 *If-Modified-Since* 的值与 *Last-Modified* 字段进行对比。如果相等，则表示未修改，响应 *304*；反之，则表示修改了，响应 *200* 状态码，并返回数据。

但是他还是有一定缺陷的：

- 如果资源更新的速度是秒以下单位，那么该缓存是不能被使用的，因为它的时间单位最低是秒。

- 如果文件是通过服务器动态生成的，那么该方法的更新时间永远是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

因此在 *HTTP/1.1* 出现了 *ETag* 和 *If-None-Match*

***Etag & If-None-Match***

为了解决上述问题，出现了一组新的字段 *Etag* 和 *If-None-Match*。

*Etag* 存储的是文件的特殊标识（一般都是一个 *Hash* 值），服务器存储着文件的 *Etag* 字段。

之后的流程和 *Last-Modified* 一致，只是 *Last-Modified* 字段和它所表示的更新时间改变成了 *Etag* 字段和它所表示的文件 *hash*，把 *If-Modified-Since* 变成了 *If-None-Match*。

浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的 Etag 值放到请求头里的 *If-None-Match* 里，服务器只需要比较客户端传来的 *If-None-Match* 跟自己服务器上该资源的 *ETag* 是否一致，就能很好地判断资源相对客户端而言是否被修改过了。

如果服务器发现 *ETag* 匹配不上，那么直接以常规 *GET 200* 回包形式将新的资源（当然也包括了新的 *ETag*）发给客户端；如果 *ETag* 是一致的，则直接返回 *304* 告诉客户端直接使用本地缓存即可。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063851.png" alt="image-20211203143850009" style="zoom:50%;" />



两者之间的简单对比：

- 首先在精确度上，*Etag* 要优于 *Last-Modified*。

   *Last-Modified* 的时间单位是秒，如果某个文件在 *1* 秒内改变了多次，那么 *Last-Modified* 其实并没有体现出来修改，但是 *Etag* 是一个 *Hash* 值，每次都会改变从而确保了精度。

- 第二在性能上，*Etag* 要逊于 *Last-Modified*，毕竟 *Last-Modified* 只需要记录时间，而 *Etag* 需要服务器通过算法来计算出一个 *Hash* 值。

- 第三在优先级上，服务器校验优先考虑 *Etag*，也就是说 *Etag* 的优先级高于 *Last-Modified*。



### 缓存读取规则

接下来我们来对上面所讲的缓存做一个总结。

当浏览器要请求资源时：

1. 从 *Service Worker* 中获取内容（ 如果设置了 *Service Worker* ）

2. 查看 *Memory Cache*

3. 查看 *Disk Cache*。这里又细分：

    - 如果有强制缓存且未失效，则使用强制缓存，不请求服务器。这时的状态码全部是 *200*

    - 如果有强制缓存但已失效，使用协商缓存，比较后确定 *304* 还是 *200*

4. 发送网络请求，等待网络响应

5. 把响应内容存入 *Disk Cache* (如果 *HTTP* 响应头信息有相应配置的话)

6. 把响应内容的引用存入 *Memory Cache* (无视 *HTTP* 头信息的配置)

7. 把响应内容存入 *Service Worker* 的 *Cache Storage*（ 如果设置了 *Service Worker* ）

其中针对第 *3* 步，具体的流程图如下：

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063919.png" alt="image-20211203143918845" style="zoom:50%;" />

### 浏览器行为

在了解了整个缓存策略或者说缓存读取流程后，我们还需要了解一个东西，那就是用户对浏览器的不同操作，会触发不同的缓存读取策略。

对应主要有 *3* 种不同的浏览器行为：

- 打开网页，地址栏输入地址：查找 *Disk Cache* 中是否有匹配。如有则使用；如没有则发送网络请求。

- 普通刷新 (F5)：因为 TAB 并没有关闭，因此 *Memory Cache* 是可用的，会被优先使用(如果匹配的话)。其次才是 *Disk Cache*。

- 强制刷新 ( *Ctrl + F5* )：浏览器不使用缓存，因此发送的请求头部均带有 *Cache-control: no-cache*（为了兼容，还带了 *Pragma: no-cache* ）。服务器直接返回 *200* 和最新内容。

### 实操案例

实践才是检验真理的唯一标准。上面已经将理论部分讲解完毕了，接下来我们就来用实际代码验证一下上面所讲的验证规则。

下面是使用 *Node.js* 搭建的服务器：

```js
const http = require('http');
const path = require('path');
const fs = require('fs');

var hashStr = "A hash string.";
var hash = require("crypto").createHash('sha1').update(hashStr).digest('base64');

http.createServer(function (req, res) {
    const url = req.url; // 获取到请求的路径
    let fullPath; // 用于拼接完整的路径
    if (req.headers['if-none-match'] == hash) {
        res.writeHead(304);
        res.end();
        return;
    }
    if (url === '/') {
        // 代表请求的是主页
        fullPath = path.join(__dirname, 'static/html') + '/index.html';
    } else {
        fullPath = path.join(__dirname, "static", url);
        res.writeHead(200, {
            'Cache-Control': 'max-age=5',
            "Etag": hash
        });
    }
    // 根据完整的路径 使用fs模块来进行文件内容的读取 读取内容后将内容返回
    fs.readFile(fullPath, function (err, data) {
        if (err) {
            res.end(err.message);
        } else {
            // 读取文件成功，返回读取的内容，让浏览器进行解析
            res.end(data);
        }
    });
}).listen(3000, function () {
    console.log("服务器已启动，监听 3000 端口...");
})
```

在上面的代码中，我们使用 *Node.js* 创建了一个服务器，根据请求头的 *if-none-match* 字段接收从客户端传递过来的 *Etag* 值，如果和当前的 *Hash* 值相同，则返回 *304* 的状态码。

在资源方面，我们除了主页没有设置缓存，其他静态资源我们设置了 *5* 秒的缓存，并且设置了 *Etag* 值。

>注：上面的代码只是服务器部分代码，完整代码请参阅本章节所对应的代码。

效果如下：

![2021-12-03 14.02.26](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-03-063950.gif)



可以看到，第一次请求时因为没有缓存，所以全部都是从服务器上面获取资源，之后我们刷新页面，是从 *memory cache* 中获取的资源，但是由于我们的强缓存只设置了 *5* 秒，所以之后再次刷新页面，走的就是协商缓存，返回 *304* 状态码。

但是在这个示例中，如果我们修改了服务器的静态资源，客户端是没办法实时的更新的，因为静态资源是直接返回的文件，只要静态资源的文件名没变，即使该资源的内容已经发生了变化，服务器也会认为资源没有变化。

那怎么解决呢？

解决办法也就是我们在做静态资源构建时，在打包完成的静态资源文件名上根据它内容 *Hash* 值添加上一串 *Hash* 码，这样在 *CSS* 或者 *JS* 文件内容没有变化时，生成的文件名也就没有变化，反映到页面上的话就是 *url* 没有变化。

如果你的文件内容有变化，那么对应生成的文件名后面的 *Hash* 值也会发生变化，那么嵌入到页面的文件 *url* 也就会发生变化，从而可以达到一个更新缓存的目的。这也是为什么在使用 *webpack* 等一些打包工具时，打包后的文件名后面会添加上一串 *Hash* 码的原因。

目前来讲，这在前端开发中比较常见的一个静态资源缓存方案。

### 缓存最佳实践

#### 频繁变动的资源

```
Cache-Control: no-cache
```

对于频繁变动的资源，首先需要使用 *Cache-Control: no-cache* 使浏览器每次都请求服务器，然后配合 *ETag* 或者 *Last-Modified* 来验证资源是否有效。

这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小。

#### 不常变化的资源

```
Cache-Control: max-age=31536000
```

通常在处理这类资源时，给它们的 *Cache-Control* 配置一个很大的 *max-age=31536000* (一年)，这样浏览器之后请求相同的 *URL* 会命中强制缓存。

而为了解决更新的问题，就需要在文件名（或者路径）中添加 *Hash*， 版本号等动态字符，之后更改动态字符，从而达到更改引用 *URL* 的目的，让之前的强制缓存失效 (其实并未立即失效，只是不再使用了而已)。

在线提供的类库（如 *jquery-3.3.1.min.js、lodash.min.js* 等）均采用这个模式。

## 跨标签页通信

### 什么是跨标签页通信

面试的时候经常会被问到的一个关于浏览器的问题：

>浏览器中如何实现跨标签页通信？

要回答这个问题，首先需要搞懂什么叫做跨标签通信。

其实这个概念也不难理解，现在几乎所有的浏览器都支持多标签页的，我们可以在一个浏览器中打开多个标签页，每个标签页访问不同的网站内容。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-04-052442.png" alt="image-20211204132442156" style="zoom:50%;" />



因此，跨标签页通信也就非常好理解了，简单来讲就是一个标签页能够发送信息给另一个标签页。

常见的跨标签页方案如下：

- *BroadCast Channel*

- *Service Worker*

- *LocalStorage window.onstorage* 监听

- *Shared Worker* 定时器轮询（ *setInterval* ）

- *IndexedDB* 定时器轮询（ *setInterval* ）

- *cookie* 定时器轮询（ *setInterval* ）

- *window.open、window.postMessage*

- *Websocket*



### 跨标签页通信常见方案

#### *BroadCast Channel*

*BroadCast Channel* 可以帮我们创建一个**用于广播的通信频道**。当所有页面都监听同一频道的消息时，其中某一个页面通过它发送的消息就会被其他所有页面收到。但是前提是同源页面。

*index.html*

```html
<body>
    <input type="text" name="" id="content">
    <button id="btn">发送数据</button>
    <script>
        const content = document.querySelector("#content");
        const btn = document.querySelector("#btn");

        // 创建一个名字是 load1 的 BroadcastChannel 对象
        var BroadcastChanne1 = new BroadcastChannel('load1');

        btn.onclick = function () {
            BroadcastChanne1.postMessage({
                value: content.value
            });
        }

    </script>
</body>
```

*index2.html*

```html
<body>
    <script>
        var BroadcastChanne1 = new BroadcastChannel('load1');//要接收到数据，BroadcastChannel对象的名字必须相同
        BroadcastChanne1.onmessage = function (e) {
            console.log(e.data);//发送的数据
        };
    </script>
</body>
```

在上面的代码中，我们在页面一注册了一个名为 *load1* 的 *BroadcastChannel* 对象，之后所有的页面也创建同名的 *BroadcastChannel* 对象，然后就可以通过 *postMessage* 和 *onmessage* 方法进行相互通信了。

#### Service Worker

*Service Worker* 实际上是浏览器和服务器之间的代理服务器，它最大的特点是在页面中注册并安装成功后，运行于浏览器后台，不受页面刷新的影响，可以监听和截拦作用域范围内所有页面的 *HTTP* 请求。

*Service Worker* 的目的在于离线缓存，转发请求和网络代理。

*index.html*

```html
<body>
    <h1>页面一</h1>
    <button>发送</button>
    <script>
        navigator.serviceWorker.register('sw.js')
            .then(() => {
                console.log("service worker 注册成功");
            });
        document.querySelector("button").onclick = function () {
            navigator.serviceWorker.controller.postMessage('hello');
        }
    </script>
</body>
```

*index2.html*

```html
<body>
    <h1>页面二</h1>
    <script>
        navigator.serviceWorker.register('sw.js')
            .then(() => {
                console.log("service worker 注册成功");
            });
        navigator.serviceWorker.onmessage = function ({ data }) {
            console.log(data);
        }
    </script>
</body>
```

*sw.js*

```js
self.addEventListener("message",async event=>{
    const clients = await self.clients.matchAll();
    clients.forEach(function(client){
        client.postMessage(event.data)
    });
});
```

#### *LocalStorage window.onstorage* 监听

在 *Web Storage* 中，每次将一个值存储到本地存储时，就会触发一个 *storage* 事件。

由事件监听器发送给回调函数的事件对象有几个自动填充的属性如下：

- *key*：告诉我们被修改的条目的键。

- *newValue*：告诉我们被修改后的新值。

- *oldValue*：告诉我们修改前的值。

- *storageArea*：指向事件监听对应的 *Storage* 对象。

- *url*：原始触发 *storage* 事件的那个网页的地址。

>注意：这个事件只在同一域下的任何窗口或者标签上触发，并且只在被存储的条目改变时触发。

示例如下：这里我们需要打开服务器进行演示，本地文件无法触发 *storage* 事件

*index.html*

```html
<body>
    <script>
        localStorage.name = "谢杰";
        localStorage.age = 20;
        console.log("信息已经设置!");
    </script>
</body>
```

在上面的代码中，我们在该页面下设置了两个 *localStorage* 本地数据。

*index2.html*

```html
<body>
    <script>
        let name = localStorage.getItem("name");
        let age = localStorage.age;
        console.log(`姓名为${name},年龄为${age}`);
        window.addEventListener("storage", (e) => {
            console.log(`${e.key}从${e.oldValue}修改为${e.newValue}`);
            console.log(e.storageArea);
            console.log(`被改变的url为${e.url}`);
        }, true);
    </script>
</body>
```

在该页面中我们安装了一个 *storage* 的事件监听器，安装之后只要是同一域下面的其他 *storage* 值发生改变，该页面下面的 *storage* 事件就会被触发。

#### *Shared Worker* 定时器轮询（ *setInterval* ）

下面是 *MDN* 关于 *SharedWorker* 的说明：

>*SharedWorker* 接口代表一种特定类型的 *worker*，可以从几个浏览上下文中访问，例如几个窗口、*iframe* 或其他 *worker*。它们实现一个不同于普通 *worker* 的接口，具有不同的全局作用域，如果要使 *SharedWorker* 连接到多个不同的页面，这些页面必须是同源的（相同的协议、*host* 以及端口）。

*index.html*

```html
<body>
    <input type="text" name="" id="content" placeholder="请输入要发送的信息">
    <button id="btn">发送</button>
    <script>
        const content = document.querySelector("#content");
        const btn = document.querySelector("#btn");
        const worker = new SharedWorker('worker.js')
        btn.onclick = function () {
            worker.port.postMessage(content.value);
        }
    </script>
</body>
```

*index2.html*

```html
<body>
    <script>
        const btn = document.querySelector("#btn");
        var worker = new SharedWorker('worker.js');
        worker.port.start()
        worker.port.addEventListener('message', (e) => {
            if(e.data){
                console.log('来自worker的数据：', e.data)
            }
        }, false);

        setInterval(function(){
            // 获取和发送消息都是调用 postMessage 方法，我这里约定的是传递'get'表示获取数据。
            worker.port.postMessage('get')
        },1000);
    </script>
</body>
```

*worker.js*

```js
var data = '';
onconnect = function (e) {
    var port = e.ports[0]
    port.onmessage = function (e) {
        // 如果是 get 则返回数据给客户端
        if (e.data === 'get') {       
            port.postMessage(data);
            data = "";
        } else {    
            // 否则把数据保存                  
            data = e.data
        }
    }
}
```

#### *IndexedDB* 定时器轮询（ *setInterval* ）

*IndexedDB* 是一种底层 *API*，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（*blobs*））。该 *API* 使用索引实现对数据的高性能搜索。

通过对 *IndexedDB* 进行定时器轮询的方式，我们也能够实现跨标签页的通信。

*index.html*

```html
<body>
    <h1>新增学生</h1>
    <div>
        <span>学生学号：</span>
        <input type="text" name="stuId" id="stuId">
    </div>
    <div>
        <span>学生姓名：</span>
        <input type="text" name="stuName" id="stuName">
    </div>
    <div>
        <span>学生年龄：</span>
        <input type="text" name="stuAge" id="stuAge">
    </div>
    <button id="addBtn">新增学生</button>
    <script src="./db.js"></script>
    <script>
        openDB('stuDB', 1)
            .then((db) => {
                document.getElementById("addBtn").onclick = function () {
                    addData(db, "stu", { "stuId": stuId.value, "stuName": stuName.value, "stuAge": stuAge.value });
                    stuId.value = stuName.value = stuAge.value = "";
                }
            })

    </script>
</body>
```

*index2.html*

```html
<body>
    <h1>学生表</h1>
    <table id="tab"></table>
    <script src="./db.js"></script>
    <script>
        function render(arr) {
            let tab = document.querySelector("#tab");
            tab.innerHTML = `
                <tr>
                    <td>学号</td>
                    <td>姓名</td>
                    <td>年龄</td>
                </tr>
            `;
            var str = arr.map((item) => {
                return `
                    <tr>
                        <td>${item.stuId}</td>
                        <td>${item.stuName}</td>
                        <td>${item.stuAge}</td>
                    </tr>
                `
            }).join("");
            tab.innerHTML += str;
        }

        async function renderTable() {
            let db = await openDB('stuDB', 1);
            let stuInfo = await getDataByKey(db, "stu");
            render(stuInfo);

            setInterval(async function () {
                let stuInfo2 = await getDataByKey(db, "stu");
                if (stuInfo2.length !== stuInfo.length) {
                    stuInfo = stuInfo2;
                    render(stuInfo);
                }
            }, 1000);
        }
        renderTable();
    </script>
</body>
```

*db.js*

```js
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
function openDB(dbName, version = 1) {
    return new Promise((resolve, reject) => {
        var db; // 存储创建的数据库
        // 打开数据库，若没有则会创建
        const request = indexedDB.open(dbName, version);

        // 数据库打开成功回调
        request.onsuccess = function (event) {
            db = event.target.result; // 存储数据库对象
            console.log("数据库打开成功");
            resolve(db);
        };

        // 数据库打开失败的回调
        request.onerror = function (event) {
            console.log("数据库打开报错");
        };

        // 数据库有更新时候的回调
        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            console.log("onupgradeneeded");
            db = event.target.result; // 存储数据库对象
            var objectStore;
            // 创建存储库
            objectStore = db.createObjectStore("stu", {
                keyPath: "stuId", // 这是主键
                autoIncrement: true // 实现自增
            });
            // 创建索引，在后面查询数据的时候可以根据索引查
            objectStore.createIndex("stuId", "stuId", { unique: true });
            objectStore.createIndex("stuName", "stuName", { unique: false });
            objectStore.createIndex("stuAge", "stuAge", { unique: false });
        };
    });
}

/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
function addData(db, storeName, data) {
    var request = db
        .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(data);

    request.onsuccess = function (event) {
        console.log("数据写入成功");
    };

    request.onerror = function (event) {
        console.log("数据写入失败");
    };
}

/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        var transaction = db.transaction([storeName]); // 事务
        var objectStore = transaction.objectStore(storeName); // 仓库对象
        var request = objectStore.getAll(); // 通过主键获取数据

        request.onerror = function (event) {
            console.log("事务失败");
        };

        request.onsuccess = function (event) {
            // console.log("主键查询结果: ", request.result);
            resolve(request.result);
        };
    });
}
```

#### *cookie* 定时器轮询（ *setInterval* ）

我们同样可以通过定时器轮询的方式来监听 *Cookie* 的变化，从而达到一个多标签页通信的目的。

*index.html*

```html
<body>
    <script>
        // 设置 cookie
        document.cookie = "name=zhangsan";
        console.log("cookie 已经设置");
    </script>
</body>
```

*index2.html*

```html
<body>
    <script>
        // 获取当前的 cookie
        var cookie = document.cookie;
        console.log(`当前的 cookie 值为 ${document.cookie}`);
        setInterval(function(){
            if(cookie !== document.cookie){
                console.log(`cookie 信息已经改变，最新的 cookie 值为${document.cookie}`);
                cookie = document.cookie;
                console.log("最新的 cookie 值已经保存");
            }
        },1000);
    </script>
</body>
```

在上面的代码中，我们为 *index2.html* 设置了一个定时器，之后每过一秒钟都会重新去读取本地的 *Cookie* 信息，并比较和之前获取到的 *Cookie* 信息有没有变化，如果有变化就进行更新操作。

#### *window.open、window.postMessage*

*MDN* 上是这样介绍 *window.postMessage* 的：

>window.postMessage( ) 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为https），端口号（443为https的默认值），以及主机  (两个页面的模数 Document.domain设置为相同的值) 时，这两个脚本才能相互通信。window.postMessage( ) 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

>从广义上讲，一个窗口可以获得对另一个窗口的引用（比如 targetWindow = window.opener），然后在窗口上调用 targetWindow.postMessage( ) 方法分发一个  MessageEvent 消息。接收消息的窗口可以根据需要自由处理此事件 (en-US)。传递给 window.postMessage( ) 的参数（比如 message ）将通过消息事件对象暴露给接收消息的窗口。

*index.html*

```html
<body>
    <button id="popBtn">弹出新的窗口</button>
    <input type="text" name="" id="content">
    <button id="btn">发送数据</button>
    <script>
        const popBtn = document.querySelector('#popBtn');
        const content = document.querySelector("#content");
        const btn = document.querySelector("#btn");
        let opener = null; // 保存打开窗口的引用
        popBtn.onclick = function () {
            opener = window.open("index2.html", "123", "height=400,width=400,top=10,resizable=yes");
        }
        btn.onclick = function () {
            let data = {
                value: content.value
            }
            // data 代表的是发送是数据，origin 用来限制访问来源，也可以用 * 代替
            opener.postMessage(data, "*");
        }
    </script>
</body>
```

*index2.html*

```html
<body>
    <p>这是弹出页面</p>
    <script>
        window.addEventListener('message', function (e) {
            console.log(e.data);
        }, false);//事件监听

    </script>
</body>
```

在上面的代码中，我们在页面一通过 *open* 方法打开页面二，然后通过 *postMessage* 的方式向页面二传递信息。页面二通过监听 *message* 事件来接收信息。

#### Websocket

*WebSocket* 协议在 *2008* 年诞生，*2011* 年成为国际标准。所有浏览器都已经支持了。

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

*server.js*

```js
// 初始化一个 node 项目 npm init -y
// 安装依赖 npm i -save ws

// 获得 WebSocketServer 类型
var WebSocketServer = require('ws').Server;

// 创建 WebSocketServer 对象实例，监听指定端口
var wss = new WebSocketServer({
    port: 8080
});

// 创建保存所有已连接到服务器的客户端对象的数组
var clients = [];

// 为服务器添加 connection 事件监听，当有客户端连接到服务端时，立刻将客户端对象保存进数组中
wss.on('connection', function (client) {
    // 如果是首次连接
    if (clients.indexOf(client) === -1) {
        // 就将当前连接保存到数组备用
        clients.push(client)
        console.log("有" + clients.length + "客户端在线");

        // 为每个 client 对象绑定 message 事件，当某个客户端发来消息时，自动触发
        client.on('message', function (msg) {
            console.log(msg, typeof msg);
            console.log('收到消息' + msg)
            // 遍历 clients 数组中每个其他客户端对象，并发送消息给其他客户端
            for (var c of clients) {
                // 排除自己这个客户端连接
                if (c !== client) {
                    // 把消息发给别人
                    c.send(msg.toString());
                }
            }
        });

        // 当客户端断开连接时触发该事件
        client.onclose = function () {
            var index = clients.indexOf(this);
            clients.splice(index, 1);
            console.log("有" + clients.length + "客户端在线")
        }
    }
});

console.log("服务器已启动...");
```

在上面的代码中，我们创建了一个 *Websocket* 服务器，监听 *8080* 端口。每一个连接到该服务器的客户端，都会触发服务器的 *connection* 事件，并且会将此客户端连接实例作为回调函数的参数传入。

我们将所有的客户端连接实例保存到一个数组里面。为该实例绑定了 *message* 和 *close* 事件，当某个客户端发来消息时，自动触发 *message* 事件，然后遍历 *clients* 数组中每个其他客户端对象，并发送消息给其他客户端。

*close* 事件在客户端断开连接时会触发，我们要做的事情就是从数组中删除该连接。

*index.html*

```html
<body>
  <!-- 这个页面是用来发送信息的 -->
  <input type="text" id="msg">
  <button id="send">发送</button>
  <script>
    // 建立到服务端 webSoket 连接
    var ws = new WebSocket("ws://localhost:8080");
    send.onclick = function () {
      // 如果 msg 输入框内容不是空的
      if (msg.value.trim() != '') {
        // 将 msg 输入框中的内容发送给服务器
        ws.send(msg.value.trim())
      }
    }
    // 断开 websoket 连接
    window.onbeforeunload = function () {
      ws.close()
    }
  </script>
</body>
```

*index2.html*

```html
<body>
  <script>
    //建立到服务端webSoket连接
    var ws = new WebSocket("ws://localhost:8080");
    var count = 1;
    ws.onopen = function (event) {
          // 当有消息发过来时，就将消息放到显示元素上
          ws.onmessage = function (event) {
                var oP = document.createElement("p");
                oP.innerHTML = `第${count}次接收到的消息：${event.data}`;
                document.body.appendChild(oP);
                count++;
          }
    }
    // 断开 websoket 连接
    window.onbeforeunload = function () {
          ws.close()
    }
  </script>
</body>
```



## Web Worker

在运行大型或者复杂的 *JavaScript* 脚本的时候经常会出现浏览器假死的现象，这是由于 *JavaScript* 这个语言在执行的时候是采用单线程来执行而导致的。采用同步执行的方式进行运行，如果出现阻塞，那么后面的代码将不会执行。例如：

```js
while(true){}
```

那么能不能让这些代码在后台运行，或者让 *JavaScript* 函数在多个进程中同时运行呢？

*HTML5* 所提出的 *Web Worker* 正是为了解决这个问题而出现的。

*HTML5* 的 *Web Worker* 可以让 *Web* 应用程序具备后台的处理能力。它支持多线程处理功能，因此可以充分利用多核 *CPU* 带来的优势，将耗时长的任务分配给 *HTML5* 的 *Web Worker* 运行，从而避免了有时页面反应迟缓，甚至假死的现象。

本文将分为以下几个部分来介绍 *web worker*：

- *web worker* 概述
- *web Worker* 使用示例
- 使用 *web Worker* 实现跨标签页通信

### *web worker* 概述

在 *Web* 应用程序中，*web Worker* 是一项后台处理技术。

在此之前，*JavaScript* 创建的 *Web* 应用程序中，因为所有的处理都是在单线程内执行的，所以如果脚本所需运行时间太长，程序界面就会长时间处于停止状态，甚至当等待时间超出一定的限度，浏览器就会进入假死的状态。

为了解决这个问题，*HTML5* 新增加了一个 *web Worker API*。

使用这个 *API*，用户可以很容易的创建在后台运行的线程，这个线程被称之为 *Worker*。如果将可能耗费较长时间的处理交给后台来执行，则对用户在前台页面中执行的操作没有影响。

*web Worker* 的特点如下：

- 通过加载一个 *JS* 文件来进行大量复杂的计算，而不挂起主进程。通过 *postMessage* 和 *onMessage* 进行通信。

- 可以在 *Worker* 中通过 *importScripts(url)* 方法来加载 *JavaScript* 脚本文件。

- 可以使用 *setTimeout( )，clearTimeout( )，setInterval( ) 和 clearInterval( )* 等方法。

- 可以使用 *XMLHttpRequest* 进行异步请求。

- 可以访问 *navigator* 的部分属性。

- 可以使用 *JavaScript* 核心对象。

除了上述的优点，*web Worker* 本身也具有一定局限性的，具体如下：

- 不能跨域加载 *JavaScript*

- *Worker* 内代码不能访问 *DOM*

- 使用 *Web Worker* 加载数据没有 *JSONP* 和 *Ajax* 加载数据高效。

目前来看，*web Worker* 的浏览器兼容性还是很不错的，基本得到了主流浏览器的一致支持。

![image-20211206154023963](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2021-12-06-074024.png)



在开始使用 *web Worker* 之前，我们先来看一下使用 *Worker* 时会遇到的属性和方法，如下：

- *self*：*self* 关键值用来表示本线程范围内的作用域。

- *postMessage( )*：向创建线程的源窗口发送信息。

- *onMessage*：获取接收消息的事件句柄。

- *importScripts(urls)*：*Worker* 内部如果要加载其他脚本，可以使用该方法来导入其它 *JavaScript* 脚本文件。参数为该脚本文件的 *URL* 地址，导入的脚本文件必须与使用该线程文件的页面在同一个域中，并在同一个端口中。

例如：

```js
// 导入了 3 个 JavaScript 脚本
importScripts("worker1.js","worker2.js","worker3.js"); 
```

### *web Worker* 使用示例

接下来我们来看一下 *web Worker* 的具体使用方式。

*web Worker* 的使用方法非常简单，只需要创建一个 *web Worker* 对象，并传入希望执行的 *JavaScript* 文件即可。

之后在页面中设置一个事件监听器，用来监听由 *web Worker* 对象发来的消息。

如果想要在页面与 *web Worker* 之间建立通信，数据需要通过 *postMessage( )* 方法来进行传递。

创建 *web Worker*。步骤十分简单，只要在 *Worker* 类的构造器中，将需要在后台线程中执行的脚本文件的 *URL* 地址作为参数传入，就可以创建 *Worker* 对象，如下：

```js
var worker = new Worker("./worker.js");
```

>注意：在后台线程中是不能访问页面或者窗口对象的，此时如果在后台线程的脚本文件中使用 *window* 或者 *document* 对象，则会引发错误。

这里传入的 *JavaScript* 的 *URL* 可以是相对或者绝对路径，只要是相同的协议，主机和端口即可。

如果想获取 *Worker* 进程的返回值，可以通过 *onmessage* 属性来绑定一个事件处理程序。如下：

```js
var worker = new Worker("./worker.js");
worker.onmessage = function(){
   console.log("the message is back!");
}
```

这里第一行代码用来创建和运行 *Worker* 进程，第 *2* 行设置了 *Worker* 的 *message* 事件，当后台 Worker 的 *postMessage( )* 方法被调用时，该事件就会被触发。

使用 *Worker* 对象的 *postMessage( )* 方法可以给后台线程发送消息。发送的消息需要为文本数据，如果要发送任何 *JavaScript* 对象，需要通过 *JSON.stringify( )* 方法将其转换成文本数据。

```js
worker.postMessage(message);
```

通过获取 *Worker* 对象的 *onmessage* 事件以及 *Worker* 对象的 *postMessage( )* 方法就可以实现线程之间的消息接收和发送。

*Web Worker* 不能自行终止，但是能够被启用它们的页面所终止。

调用 *terminate( )* 函数可以终止后台进程。被终止的 *Web Workers* 将不再响应任何消息或者执行任何其他运算。

终止之后，*Worker* 不能被重新启动，但是可以使用同样的 *URL* 创建一个新的 *Worker*。

下面是 *web Worker* 的一个具体使用示例。

*index.html*

```html
<p>计数：<output id="result"></output></p>
<button id="startBtn">开始工作</button>
<button id="stopBtn">停止工作</button>
```

```js
var startBtn = document.getElementById("startBtn");
var stopBtn = document.getElementById("stopBtn");
var worker; // 用于存储 Worker 进程
// 开始 Worker 的代码
startBtn.onclick = function () {
    // 第一次进来没有 Worker 进程 , 创建一个新的 Worker 进程
    worker = new Worker("worker.js");
    // 接收来自于后台的数据
    worker.onmessage = function (event) {
        document.getElementById("result").innerHTML = event.data;
    };
}
// 停止 Worker 的代码
stopBtn.onclick = function () {
    worker.terminate();
    worker = undefined;
}
```

*worker.js*

```js
var i = 0;
function timedCount() {
    i++;
    // 每次得到的结果都通过 postMessage 方法返回给前台
    postMessage(i);
    setTimeout("timedCount()", 1000);
}
timedCount();
```

在上面的代码中，当用户点击"开始工作"时，会创建一个 *Web Worker* 在后台进行计数。每次计的数都会通过 *postMessage( )* 方法返回给前台。

当用户点击"停止工作"时，则会调用 *terminate( )* 方法来终止 *Web Worker* 的运行。



### 使用 *web Worker* 实现跨标签页通信

*web Worker* 可分为两种类型：

- 专用线程 *dedicated web worker*

- 共享线程 *shared web worker*

*Dedicated web worker* 随当前页面的关闭而结束，这意味着 *Dedicated web worker* 只能被创建它的页面访问。

与之相对应的 *Shared web worker* 共享线程可以同时有多个页面的线程链接。

前面我们示例 *web Worker* 时，实例化的是一个 Worker 类，这就代表是一个 *Dedicated web worker*，而要创建 *SharedWorker* 则需要实例化 *SharedWorker* 类。

```js
var worker = new SharedWorker("sharedworker.js");
```

下面我们就使用 *Shared web worker* 共享线程来实现跨标签页通信。

*index.html*

```html
<body>
    <input type="text" name="" id="content" placeholder="请输入要发送的信息">
    <button id="btn">发送</button>
    <script>
        const content = document.querySelector("#content");
        const btn = document.querySelector("#btn");
        const worker = new SharedWorker('worker.js')
        btn.onclick = function () {
            worker.port.postMessage(content.value);
        }
    </script>
</body>
```

*index2.html*

```html
<body>
    <script>
        const btn = document.querySelector("#btn");
        var worker = new SharedWorker('worker.js');
        worker.port.start()
        worker.port.addEventListener('message', (e) => {
            if(e.data){
                console.log('来自worker的数据：', e.data)
            }
        }, false);

        setInterval(function(){
            // 获取和发送消息都是调用 postMessage 方法，我这里约定的是传递'get'表示获取数据。
            worker.port.postMessage('get')
        },1000);
    </script>
</body>
```

*worker.js*

```js
var data = '';
onconnect = function (e) {
    var port = e.ports[0]
    port.onmessage = function (e) {
        // 如果是 get 则返回数据给客户端
        if (e.data === 'get') {       
            port.postMessage(data);
            data = "";
        } else {    
            // 否则把数据保存                  
            data = e.data
        }
    }
}
```