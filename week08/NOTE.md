学习笔记 Week08



# 1. 重学 HTML | HTML的定义： XML 与 SGML

XML 与 SGML 都在某种意义上，是 HTML 的超集。

在 HTML 5 之后，渐成为一门独立的语言。



# 2. | HTML 标签语义

\<dfn>标签定义\</dfn>

\<pre>预定义格式\</pre>

\<samp>例子\</samp> 

\<code>代码\</code>

\<footer>脚注\</footer>



# 3. | HTML 语法

合法元素有6种

* Element: <tagname>...</tagname>
* Text: text
* Comment: <!--comments-->
* DocumentType: <!doctype html>
  html5 只有一个 doctype。更早有更多，后来都没用了。
* ProcessingInstruction: <?a1?>
  一种预处理的语法 ?后面的内容，是给预处理程序去使用。
  实际上也没什么用。
  *CDATA: <![CDATA[]]>
  它其实只是一种特殊语法，它产生的也是文本节点，只不过 CDATA 节点里支持的文本不需要考虑转义了。这是从 XML 继承而来的



# 4. 浏览器 API| DOM API

 浏览器 API != Dom API

Dom API 只是 浏览器 API 的一种重要类型

BOM -- Browser Object Model - 是一组很小的 API

## DOM API
分四部分：

* traversal 系统  可以访问 DOM 所有节点的自动工具 -- 废止了
* 节点 API -- 目前常用，最重要的。
* 事件 API -- 也相当重要
* Range API -- 更精确操纵 API，但很复杂

## DOM 树

Node 是所有节点的基类。挂在 DOM 树上的一定叫 Node，但不一定是 Element。

* Element: 元素型节点为，即标签对应

  * HTML Element

    * HTMLAnchorElement
    * HTMLAppletElement
    * HTMLAreaElement
    * HTMLBaseElement
    * HTMLBodyElement
    * ... 这些都是啥啊？-- 这些就是常见的 Tag 呀

    * SVGAElement
    * SVGAltGlyphElement

* Document：文档节点

* CharacterData 字符数据

  * Text: 文本节点 -- CDATASection: CDATA 节点
  * Comment 注释
  * ProcessingInstruction 处理信息

* DocumentFragment

* DocumentType 文档类型

## 导航类操作

//由于 html 里面空白字符也是 Node，因此，下面这组导航API很可以找到左右空白

* parentNode
* childNodes
* firstChild
* lastChild
* nexSibling
* previousSibling

// 下面只找元素，不管文本节点

* parentElement  // 一定等于 parentNode
* children
* firstElementChild
* lastElementChild
* nextElementSibling
* previousElementSibling

## 修改操作

* appendChild
* insertBefore  // 没有insertAfter，可以用 insertBefore + appendChild 代替
* removeChild
* replaceChild

最小化的 API 设计原则

## 高级操作

* compareDocumentPosition 是一个用于比较两个节点中关系的函数
* contains 检查 一个节点是否包含另一个节点
* isEqualNode 检查两个节点是否完全相同
* isSameNode 检查两个节点是否是同一个，实际上在 JS 中可以用 == 代替
* cloneNode 复制一个节点，如果传入参数为 true，则连同子元素一起深拷贝

# 5. | 事件 API

事件的对象模型

冒泡模式，还是捕获模式

https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

target.addEventListener(type, listener[, options]);

target.addEventListener(type, listener[])

事件的 passive 模式

## Capture 机制

任何一个事件都有一个先捕获，再冒泡的过程。

以鼠标单击为例：

捕获：鼠标点到一个地方，系统要判断你点得到底是什么，有一个从内到外的捕获过程。

冒泡：我们已经算出点了哪个元素，然后层层向外触发，让元素进行响应的过程。

通过例子可以看到冒泡和捕获的关系。





# 6. | Range API

有些情况需要操作半个节点和批量节点。

比节点 API 更强大，更细致，更难理解。对 DOM 操作的万能 API。

问题：把一个元素的所有子元素逆序

* DOM 的 collection 是一个 LiveCollection
* 子元素在 insert 的时候，要从原来的位置拿掉的

==看了老师的第二个例子，觉得主要是对 HTML Collection的Live 特性的使用==

查了一下 Live Collection

https://idiallo.com/javascript/magical-js-html-live-collection

"What they are is an HTML collection. The power and main difference between these and a regular array is that they are directly tied to the DOM. If you update the DOM, the collection is updated accordingly."

如果你动了 DOM，则这个 Collection 也变了。

看懂了 Live Collection，也就是说它是随着 DOM 变而变的。

但疑问是为什么，把一个子节点append到另外一个父节点之后？也就是 Append 不添加新节点？

老师的第二份代码很精巧。



首先是如何创建一个 Range。可以理解为HTML流中的起点和终点的这样一段范围。

起止点均由 Element + 偏移值决定，Element 的偏移值是 Children，对于 Text Node 来说，偏移值就是文字的个数。

Range 不一定包含了完整的结点，可以只包含半个结点。

* var range = new Range()
* range.setStart(element, 9)
* range.setEnd(element, 4)
* var range = document.getSelection().getRangeAt(0);

还有一种办法是从 Selection 来创建 Range. Selection 就是鼠标从屏幕上的选择范围。

其它的便捷方式

* range.setStartBefore
* range.setEndBefore
* range.setStartAfter
* range.setEndAfter
* range.selectNode
* range.selectNodeContents

创建 Range 之后

* var fragment = range.extractContents()
* range.insertNode(document.createTextNode('aaa'))

range 相当于一个容器，在 append 的时候，会把自己的子结点放上去。

可以选中半个标签，系统会自动补全标签。

通过 Range API 把内容取到 fragment 中，在 fragment 中做重排，效率比较高。中间过程不会引起 DOM 重排。效率比较高。

对 DOM 有高性能操作要求，就采用这种方法。

# 7. | CSSOM

DOM API 约等于 HTML 语言的对象化。

对 CSS 的文档抽象就是 CSS OM

CSSOM 也是要从 DOM API 访问的。

* document.styleSheets[0].cssRules
* document.styleSheets[0].insertRule("p{color:pink;}",0)
* document.styleSheets[0].removeRule(0)

CSS 规则分为 @Rule 和普通 的 StyleRule

window.getComputedStyle(elt, pseudoElt)

# 8. | CSSOM View

## window API

* window.innerHeight, window.innerWidth // 实际可显示的区域
* window.outWidth, window.outerHeight // 包域和 Window 的工具栏
* window.devicePixelRatio
* window.screen
  * window.screen.width
  * window.screen.height
  * window.screen.availWidth
  * window.screen.availHeight



# 9. | 其它 API



