学习笔记 -- Week 06

# 1. CSS 总论 | CSS 的语法研究

CSS 当前的标准特别复杂，没有标准能囊括。不像 HTML.

找到一个良好的线索。用语法做第一步。

CSS 完整的语法是很容易的。

## CSS 2.1 的语法

它的产生式 (Productions)

import 在其它规则之前

CDC / CDO 可以忽略，是老的浏览器。

Media Query 是什么鬼？

总体结构

* @charset -- 一般不需要声明 charset (一般都是 utf-8)
* @import
* rules
  * @media
  * @page
  * rule

平时写 rule 比较多。

at-rule, rule

## CSS 的整体结构

CSS (2.1)

* at-rules 
  * @charset
  * @import
  * @media (重要)
  * @page
  * @counter-style
  * @keyframes (重要)
  * @fontface (重要)
  * @supports
  * @namespace
* rule
  * selector
    * selector_group
    * selector
      * \>
      * <space>
      * +
      * ~
    * simple_selector
      * type
      * \*
      * \.
      * #
      * []
      * : - 伪类
      * :: - 伪元素
      * :not()
  * Declaration
    * key
      * variables
      * properties
    * value
      * calc
      * number
      * length





# 2. | CSS @ 规则的研究

At-Rule 

* @charset -- 声明字符集
* @import
* @media -- css 3 conditional, media Query
* @page -- css page 3 与打印相关，分页媒体（打印机）
* @counter--style -- bullet
* @keyframes -- 定义动画用的
* @fontface -- 就是著名的 Web Font，可以用 @fontface 定义一切字体，比如 icon font
* @supports --  和 @media 一样，也是来自 conditional 的标准，用来检查某些 CSS 的功能是否存在
* @namespace -- 用于处理 SVG, Math ML 等其它的命名空间的标记的标签



# 3. | CSS 规则的结构

CSS 规则：

* 选择器
* 声明
  * key
  * value

## selector 标准

​	有两个标准，一个是 Level 3，一个是 Level 4(标准制定中)

### Selector Level 3



## key 标准

* properties
* variables  -- 以双减号开关的变量值
  https://w3.org/TR/css-variables/

```
:root {
	--main-color: #06c;
	--accent-color: #006;
	--accent-background: linear-gradient(to top, var(--main-color), white);
}
/* the rest of the CSS file */
#foo h1 {
	color: var(--main-color);
}
```

可以作用在任何局部，也可以和其它函数嵌套使用。

比如，和 calc 函数连用：

```
:root {
	--one: calc(var(--two) + 20px);
	--two: calc(var(--one) - 20px);
}
```

使用 var()函数调用 variable 时，可以指定默认值，如果变量没有定义，就用默认值。

```
.component .text {
	color: var(--text-color, blue);
}
```

变量可以用作 value，也可以用作 key

## Value 标准

https://w3.org/TR/css-values-4

长度单位有一堆。

重要的是定义了 calc 函数。可以进行简单计算

```
:root {
	font-size: calc(100vw / 35);
}
.type {
	font-size: max(10*(1vw+1vh)/2, 12px)
}
```

### Atrribute Reference

attr()

让CSS 的值和元素上的某个属性上的值相绑定。==不太明白==







# 4. | 收集标准

需要从零散的标准里面，收集内容。

117/1223 of css

Array.prototype.slice.call(document.querySelector("#container").children).filter(e => e.getAttribute("data-tag").match(/css/)).map(e => ({name:e.children[1].innerText, url:e.children[1].children[0].href}))



# 5. | CSS 总论总结

* CSS 语法
* at-rule
* selector
* variables
* value
* 实验--爬虫



# 6.  CSS 选择器 | 选择器语法

## 简单选择器

七类简单选择器

* \* -- 通用选择器
* div svg|a -- 选择 tagName
  * HTML 是有命名空间的，有三个  html, svg, mathml
  * 如果你想选 MathML 或 SVG 里面的元素，就必须要用单竖线 -- 是css命名空间分隔符
  * 在 html 里面，它的命名空间的分隔符是冒号。
  * 前面的 namespace 要用 @namespace 这个 at-rule 来声明一下
  * 实际上，html 与svg 重叠的元素也就一个 a
* .cls
  * class 可用空白符分隔，指定多个 class
* #id
  * 必须是严格匹配
* [attr=value]
  * 包括了 class 属性选择器和 id 属性选择器
  * 等号前面可以 ~=，代表像 class 一样，拿空格分隔的值的序列
* :hover
  * 元素的特殊状态，与 HTML 属性没有关系，多半与交互有关
* ::before
  * 写单冒号也对
  * 伪元素 -- 选中一些原本不存在的元素

==伪类与伪元素有什么区别？？==

## 复合选择器

Combined

* <简单选择器> <简单选择器> <简单选择器>
  * 把简单选择器紧挨着写，就成了复合选择器
  * 要求元素必须同时 Match 这几个简单选择器，它是一个与的关系
* \* 或 div 必须写在最前面
* 伪类、伪元素一定要写在最后在m

## 复杂选择器

<复合选择器> 中间用连接符连接就成为复杂选择器。

* <复合选择器> <space><复合选择器>

  * 子孙选择器  offspring

* <复合选择器> ">" <复合选择器>

  * 父子选择器 - children 必须是直接上下级

* <复合选择器> "~" <复合选择器>

  * 兄弟选择器
  * p~ul选择前面有<p>元素的每个<ul>元素，即选择p之后出现的所有ul，两种元素必须拥有相同的父元素，但ul不必紧随p

* <复合选择器> "+" <复合选择器>

  * 兄弟选择器 -- 紧邻关系

  * 　h1 + p {margin-top:50px;}

    　　这个选择器读作：“选择紧接在 h1 元素后出现的段落，h1 和 p 元素拥有共同的父元素”。｝

* <复合选择器> "||" <复合选择器>  Selector Level 4 才有，选中表格的一列

复杂选择器还可用逗号连接，是或的关系，相当于两个选择器。

# 7. | 选择器的优先级

## 简单选择器计数

```css
1     2
#id div.a#id {
...
}
```

选择器优先级是对其中包含的所有简单选择器进行计数。

看上面的例子：里面包含了两个id选择器，一个div选择器，一个class选择器。

[0, 2, 1, 1]

程序处理为N进制的4位数。

IE 的老版本，N取得不够大（255），就很好玩。256个 class 相当于一个id，有人做过实验。

后来大部分的浏览器 N 都选65536。

## 练习1

编写一个 match 函数。它接受两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。（不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）以下是一个调用的例子。

function match(selector, element) {
    return true;
}

match("div #id.class", document.getElementById("id"));

// 思路：

先解析选择器，形成选择器树，

再处理 DOM 元素，形成上级到本结点的dom树

## 练习2

写出下面选择器的 Specificity

* div#a.b .c[id=x]
  * 一个id
  * 两个class 和一个attribute
  * 一个元素选择器
  * [0,1,3,1]
* #a:not(#b)
  * 两个id
  * [0,2,0,0]
* *.a
  * 一个类选择器
  * universal selector 不算
  * [0,0,1,0]
* div.a
  * 一个类选择器
  * 一个元素选择器
  * [0,0,1,1]



# 8. | 伪类

伪类也是一种简单选择器。

最早的伪类是和链接和行为相关

* :any-link -- 匹配任何超链接
* :link -- 匹配还没有访问过的超链接；:visited -- 匹配访问过的超链接
  * 一旦你使用了 :link 或者 :visited 之后你就没有办法更改文字颜色之外的属性了。为了安全？
* :hover
  * 现在好多元素支持 hover
* :active
  * 激活状态
* :focus
  * focus-within 什么鬼？
* :target
  * 链接到当前的目标，是给作为锚点的 a 标签使用的 ？？

## 树结构伪类

* :empty
* :nth-child()
* :nth-last-child()
* :first-child :last-child :only-child

# 9. | 伪元素



