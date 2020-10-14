学习笔记 

Week14 组件化

# 1 手势与动画 | 手势的基本知

gesture 

之前轮播图的问题：

1. 有些不稳定，总是容易触发

怎么区分点击和拖拽的行为。

把鼠标的 down move up 统一到 start move end 模型里面。

start --(end) --> tap

start --(移动10px) --> pan start  --(move) --> pan --(end) --> pan end

pan --(move) --> pan

pan --(end且有一定速度) --> flick (清扫，也就 swipe)

// 10px 是容错范围，在 Retina 屏上是10px, 一倍屏是 5px; 三倍屏是 15px;

// 有一些框架，比如 swipejs 就是处理手势和轮播的。

start --(0.5s) --> press start （按压，而不是 tap)

press start --(移动10px) --> pan start

press start --(end) --> press end (停留的一段时间再松开)

这里没有做双指手势。

# 2 | 实现鼠标操作

gesture.js

gesture.html

移动端没有 Mouse，就是 touch 系列的操作。

touch 系列一旦 start 就一定会触发 Move 操作。

touch 事件比鼠标事件多了 touchcancel

### touchend vs touchcancel

cancel 是以异常的模式结束的。

比如，你正在touch-move，结果页面突然弹窗，就产生了 cancel 事件。

系统事件可能打断 touch move 就产生了 cancel 事件。

### 统一用处理手势和鼠标事件

start, move, end

# 3 | 实现手势的逻辑

![image-20201011160716687](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20201011160716687.png)

在 start 时进行三个判断：

1. 是否 end
2. 是否移动 10px
3. 是否停了 0.5s 

# 4 | 处理鼠标事件

在浏览器里，至少支持5个键的 Mouse Up/Down

通过 isListeningMouse 区分多个键。

# 5 | 派发事件

整体功能差不多了。

# 6 | 实现一个 flick 事件

flick 如何判断速度？

# 7 | 封装

实现封装。