学习笔记

week 12 组件化

# 1. 组件的基本知识 |组件的基本概念和组成部分

前端架构最重要的两部分：

* 组件化 -- 怎么扩展 HTML 标签
* 架构模式 -- MVC / MVVM 逻辑

Winter 认为 组件化比 MVVM 的架构更重要 -- 直接决定了复用率

## 组件与对象

### 对象

* Properties
* Methods
* Inherit

### 组件

* Properties
* Methods
* Inherit
* Attribute
* Config & State
* Event
* Lifecycle
* Children  -- 是树形结构的必要组成部分

组件是和 UI 强相关的内容，它既是对象，又是模块

组件既是对象，又是模块，在对象的基础上加了很多内容。

#### Property  VS Attribute

* Attribute 强调描述性

* Property 强调从属关系

在实际使用中，attribute 主要是 XML 里面的， property 主要是 JS 面向对象来处理

以 HTML 为例

Attribute:

```
<my-component attribute="v" />
myComponent.getAttribute('a')
myComponent.setAttribute('a', 1)
```

Property:

```js
myComponent.a = "value"
```

**但是这两种写法是有区别的！**

比如早期的 Javascript 里面，是不允许关键字作属性名的。比如 class 就是关键字。

```
<div class="cls1 cls2"></div>
<script>
var div = document.getElementsByTagName('div');
div.className // cls1 cls2
</script>
```

另外，Attribute 通常是字符串，而 Property 是字符串语义化之后的对象。比如：

```
<div class="cls1 cls2" style="color: blue"></div>
<script>
var div=document.getElementByTagName('div');
div.style // 对象，一个KV结构
</script>
```

或者如下例 -- https:// http:// 注意不要写死了！

```
<a href="//m.taobao.com">TB</a>
<script>
var a = document.getElementsByTagName('a');
a.href // 'http://m.taobao.com'， 这个 URL 是 resolve 过的结果
a.getAttribute('href') // '//m.taobao.com' 跟 HTML 代码一致
</script>
```

当然改了 Attribute, Property 跟着变。

最神奇的是 Input 的 Value : Attribute 相关于 Input 的默认值。Property 是 Input 的实际值。

以前用 jQuery，prop 和 attr 感觉差不多，其实有著名的 input 的坑。

```
<input value = "cute"/>
<script>
var input = document.getElementByTagName('input'); // 若 Property 没有设置，则结果是 attribute
input.value //cute
input.getAttribute('value'); // cute
input.value = 'hello'; // 若 value 属性已经设置，则 attribute 不变，property 变化，元素上实际的效果是 property 优先
input.value // hello
input.getAttribute('value'); // cute
</script>
```



### 组件图

![image-20200922224438424](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20200922224438424.png)



### 如何设计组件状态

| Markup set | JS set | JS Change | User Input Change |           |
| ---------- | ------ | --------- | ----------------- | --------- |
| X          | V      | V         | ?                 | property  |
| V          | V      | V         | ?                 | attribute |
| X          | X      | X         | V                 | state     |
| X          | V      | X         | X                 | config    |

property 不能被 Markup 去设置的。大部分是不能被 User Input 去改变的

state 只能从组件内部去改变，不能从外部改变。 state 是自己的控制变量。而是在state 根据用户输入的变化而改变。

Config 是一次性的结果，只有在组件被构造时改变。

## 生命周期

最容易想到的是 created 和 destroy，成住坏空。

mount / umount

JS set / User input --> render / update

## Children

Children 是构建组件树的最重要的组件特性。

#### 两种类型的 children

* Content 型 Children  -- 有几个 Children 就能显示出来几个 Children，组件树很简单，有就是有，没有就是没有
* Template 型 Children -- 充当模板的作用。比如一个 List，它可能有一个 list 的结构，但它的Children不能反应出来实际的数量，list 可以把里面的内容根据模板复制成多份。

```html
<my-button><img src="{{icon}}"/>{{title}}</my-button>
<my-list>
	<li><img src="{{icon}}"/>{{title}}</li>
</my-list>
```

下节课，从无到有地搭建组件系统。

# 2. |为组件添加 JSX 语法

组件系统：由 Markup 和 JS 代码，两者都可访问的环境。

这里展示两种：

* JSX
* VUE 类似的标记语法的 Parser

本节课讲 JsX。JSX实际不仅仅用于 React，还可以用于别的地方。

## 配置 JsX 环境

```bash
mkdir jsx; cd jsx
npm init  # 接受所有的默认选项
```

这样 npm 就创建好了。可以使用 npx 去直接使用 webpack，也可以使用全局安装 Webpack CLI 的形式。

```bash
npm install -g webpack webpack-cli  # 安装  webpack
webpack --version # 安装之后，查看 webpack 的版本
```

还需要安装  babel 系列：因为 JsX 是 babel 的一个插件。所以我们需要依次安装：

* webpack
* babel-loader, babel, 以及 babel 的 plugin

所以配置 JSX 是很麻烦的。

## 关于 Webpack

把一个普通的 JS 文件，以及它的 import, require 引入的依赖，打包到一起。

babel 可以把新版本的 JS 编译成老版本的 JS ，以便在老版本的环境中运行。

```bash
npm install --save-dev webpack babel-loader # 安装到本地目录   可以webpack 不是在全局已经装过了？
```

babel-loader 实际上是 webpack 的一个组件，是 webpack 的 babel-loader，纯粹的 babel-loader是跑不起来的。

接下来创建 webpack.config.js

```javascript
module.exports = {
	entry： ‘./main.js'
}
```

创建 main.js

然后运行 webpack，可以看到多了一个 dist 目录。

接下来安装  babel  -- 注意 babel-loader 本身并不依赖于 babel，所以 babel-loader 装了，也还要装  babel

安装 babel core 和 babel/preset-env

```bash
npm install --save-dev @babel/core @babel/preset-env
```

babel 如果只装一个 core它其实啥也不会干，所以我们还要安装一个它的 preset-env

使用 babel 可以看到原来写的 for .. of 被编译成普通的for 循环。这就是 babel/preset-env 的效果了。

在 webpack.config.js 中加入 mode 配置，指定其为 development 模式。再运行 webpack，可以看到生成的代码是没有压缩过的，特别长。

安装  babel-plugin



# 3. | JSX 的基本使用方法

JSX 相当于一代码的简化写法。它 Build 之后，转换成 React.createElement 这样的调用。

可在 webpack.config.js 的 JSX Plugin 里面增加一个配置。pragma:createElement

这样一改，JSX 就和 React 没有任何联系了。



给 createElement传了两个参数，第一个是 div, 第二个是 null

JSX 实际上是看起来比较像 HTML 的函数调用。有点像语法糖，但是影响了代码的结构。

树形结构的 createElement 是递归调用的。

对 class 的行为进行修改。

# 4. 轮播组件 | (一)

# 5. |(二)

使用鼠标拖动进行轮播。

# 6. |(三)

# 7. |(四)

