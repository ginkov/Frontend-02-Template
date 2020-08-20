学习笔记 Week 07



# 1. CSS 排版 | 盒

* 源代码 - 标签 -Tag
* 语义 - 元素 - Element
* 表现 - 盒 - Box

HTML 代码可以书写开始 <u>标签</u>，结束  <u>标签</u>，和自封闭 <u>标签</u>

一对起止 <u>标签</u>，表示一个 <u>元素</u>。

DOM 树中存储的是 元素 和其它类型的节点（Node）

​	其它还有文本节点，注释节点

CSS 选择器选中的是 元素

​	或伪元素

CSS 选择器选中的元素，在排版时可能产生多个 盒。

**排版和渲染的基本单位是 <u>盒</u>**

## 盒模型

box-sizing:

* content-box
* border-box: width - 包含了 padding 和 border 本身的宽度

# 2. | 正常流

第一代排版是就正常流

第二代： Flex (当前主流)

第三代： Grid

3.5 代：CSS Houdini

Layout -- 布局 / 排版

一切的 CSS 都是排盒和文字。

早期 HTML 正常流的排版都是文字排版专家过来设计的。

## 排版过程

* 收集盒进行
* 计算盒在行中的排布
* 计算行的排布

## 排版规则

当盒在同一行里（inline-box)，从左向右排

文字与盒有一个对齐规则，block-box

块级的，叫BFC - Block Formatting Context

行级的，叫 IFC - Inline Formatting Context



# 3.| 正常流的行级排布

IFC 的基线 - 中英文混排时，中文基线有偏移

以原点，定义基线

## 行模型

5条线

* line-top
* text-top
* base-line
* text-bottom
* line-bottom

但是不同的盒排在一起，盒的先后顺序，盒的大小，都会影响 line-top 和 line-bottom 的这个位置。

盒不会影响 text-top 和 text-bottom

盒默认是基线对齐。

**行内盒的基线是随着自己里面文字的基线而变化的**

可以强制设置：

* vertical-align: top  // 和 top-line 对齐

# 4. | 正常流的块级排布

## 特殊元素 - float 与 clear

严格来讲 float 已经脱离了正常流，但它依附于正常流去定义的。

### float

先把元素排到正常的位置，然后向 float 指定的方向挤一下。然后，根据 float 占据的区域，调整行中其它元素的位置。

float 的显著特性：**它会影响生成的行盒的尺寸。**

实际上 float 并不只影响一行，它影响它高度所在的所有行的宽度。

两个 float 元素排列时，下一个元素的行宽也会受到上一个 float 元素的影响。如果高度方向，两个元素有重叠，则下一个行宽，会受上一个元素的影响。

而后面行盒会受到这两个元素的影响。

**float是不认换行，可以用 clear 进行换行**

### clear 

找一个干净的空间，比如 clear: right ，我们要找到右边这样一块干净的空间。

加了 clear 的元素会调整自己的高度方向上的位置。

clear 和 float 可以一起使用。

### float 导致的重排现象

### margin 折叠 （margin collapse)

把上下 Margin 堆叠在一起。

margin collapse 只会发生在 BFC 、正常流里面。Flex、Grid 都没有 margin collapse 现象。



# 5. | BFC 合并

正常流里面最困难的部分。

BFC - Block Formatting Context

另外一种是 IFC - Inline Formatting Context

## Block

来了一个盒，要么把它放到里层的 IFC 里面，要么把它放到外层的 BFC 里面。

如果里层没有 IFC，就创建一个 IFC。

* Block container: 里面有 BFC 的
  * 能容纳正常流的盒，里面就有 BFC
  * 比如 DIV,P,H1~H5
* Block-Level Box: 外面有 BFC 的，它能被放进 BFC 里面。
* Block Box = Block Container + Block-level Box: 里外都有 BFC 的。
  * 我觉得 Div 就是 Block Box 啊。

## Block Container

作为 block 的 container

* block
* inline-block
* table-cell
* flex item  // display 为 flex 元素的子元素
* grid cell
* table-caption

table-row 就不是。它里面是 table-cell，不算是正常流。

display 为 flex 这样的元素，它不是 Block Container。但是它的子元素，叫 Flex Item，它是 Flex Container。

Grid 的 Cell 默认都是 Block Container

## Block-level-box

大多数元素的 display 值都有两种选项，一个是 Block Level 的，一个是 Inline Level 的。

### block level

* display: block
* display: flex
* display: table
* display: grid

### Inline level

* display: inline-block
* display: inline-flex
* display: inline-table
* display: inline-grid

还有一种特殊的 display 叫 Run-in，跟着自己的上一个元素来。

它有的时候是 inline level 的，有的时候是 Block level 的。

### 设立 BFC （Establish BFC)

什么样的盒会创建 BFC 呢？

* floats
* absolutely positioned elements
* block containers (such as inline-blocks, table-cells, and table captions) that are not block boxes
  // 是 block container, 但不是 block box
  * flex items
  * grid cell
* and block boxes with 'overlfow' other than 'visible'

### BFC 合并

* block box && overlfow: visible
  * BFC 合并与 float
  * BFC 合并与边距折叠

看老师的例子，创建 BFC 与否，对边距折叠的影响，有意思。

#### 对 float 的影响

float 对里面的行盒发生了影响。

边距折叠只会发生在同一个BFC里面。



# 6. | Flex 排版

* 把盒收集进行

* 计算盒在主轴方向的排布

* 计算盒在交叉轴方向的排布

分行：

根据主轴尺寸，把元素进行分行

如果设置了 no-wrap，则强行分配进第一行。

计算主轴方向：

找出所有 Flex 元素

flex-align, item-align

# 7. CSS 动画与绘制 | 动画

## Animation

* @keyframes
* animation 的使用

```html
<style>
@keyframes mykf
{
	from { background: red;}
	to {background: yellow;}
}

div {
	animation: mykf 5s infinite;
}
</style>
<div style="width: 100px; height: 100px;">
</div>
```

看看上面这段代码，挺有意思的。

* animation-name 时间曲线
* animation-duration 动画时长
* animation-timing-function 动画的时间曲线
* animation-delay 动画开始前的延迟
* animation-iteration-count 动画的播放次数
* animation-direction 动画的方向

# 8. | 颜色

# 9. | 绘制

