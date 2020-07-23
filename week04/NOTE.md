重学前端 第4周 浏览器工作原理

# 1. 浏览器总论

重绘，重排？ Toy Browser

以下五个步骤完成渲染：

1. 把 URL 打包成 HTTP 发出去
2. 得到 HTML 进行解析
3. 得到 DOM 并进行 CSS 计算
4. 得到带 CSS 的 DOM，计算 Layout // 布局，或者排版
5. 得到带 Position 的 DOM，生成 Bitmap  // 具体是指每个 CSS 生成的盒的位置。

**从一个 URL 得到一张 Bitmap**



# 2. 状态机 | 有限状态机

FSM 处理 String。是处理字符串的利器，是特别基本的工具。 有时候把“有限”两个字省略，就叫状态机。

## FSM 

* **每个状态都是一个机器** // 每个机器是解耦的
  * 每个机器里，可以计算，存储，输出
  * 所有的机器接受的输入是一致的
  * 每个机器本身没有状态，如果我们用函数表示的话，它是纯函数（无副作用）
* **每个机器知道下一个状态**
  * 每个机器都有确定的下一个状态（Moore)
  * 每个机器根据输入判定下一状态 (Mealy)



FSM 的应用： 在游戏里，主角是否跑入敌人范围（攻击状态，等待状态），状态机能为我们简化逻辑。

FSM 的特点：

* 各机器所能接受的输入类型是完全一致的
* 每个机器本身没有状态，如果我们用函数表示的话，它是纯函数（无副作用，即不再受外部的输入控制）

可以往外写，但不能再从外面读变量进来。

两种状态机

* Moore // 状态变化不受输入影响
* Mealy // 状态变化受输入影响

## JS 中实现 Mealy

```javascript
// 每个函数是一个状态
function state(input) //函数参数就是输入
{
	// 在函数中，可以自由地编写代码，处理每个状态的逻辑
	return next // 返回值作为下一状态
}

// 以下是调用
while (input {
	// 获取输入
	state = state(input)  // 把状态机的返回值作为下一状态
    // 这意味着返回值必须是一个函数，是一个状态函数
})
```

FSM -- 一系统 返回状态函数的状态函数

# 3.  | 不使用状态机处理字符串 (一)

先从一个问题开始： **在一个字符串中，找到字符 "a" **

这个算法是 O(n) 的，和长度成正比。



# 4.  | 不使用状态机处理字符串 (二)

再看一个问题，从一个串中找到字符”ab"，不能使用正则表达式（因为 FSM 是正则表达式的底层）

老师的思路和我的思路差不多。都是加了一个 Flag 来先记录找到 A

以前有很多场合，也有这个计算要求。我也是这么搞的。



# 5.  | 不使用状态机处理字符串 (三)

问题又升级了： **在一个串中，找到 "abcdef"**。 老师的判断逻辑比我的更简单一些，但差不多。



# 6.  | 使用状态机处理字符串 (一)

使用状态机，刚才的思路怎么实现？

**找到A之前，和找到A之后，for 循环的逻辑是完全不一样的**，每找到一个字符，我们就切换一个状态。

## 技巧一

老师用到了一个技巧：FSM 里的 Trap。像这样：

```javascript
function end(c) {
	return end; // 让 end 函数永远返回它自己，就是一个 trap
}
```

==但是，老师的代码会 Trap 在 end 函数里面，直到循环结束。是不是不够高效==

另外，我自己觉得 JS 能返回函数，对实现状态机是很好的。

## 技巧二

reConsume -- 相当于把自己已经消费掉的输入，又”吐“出来，给其它的状态用。

# 7.  | 使用状态机处理字符串(二)

在做练习中，发现 reConsume 的技巧很有意思。它实际上是调用了函数，最终返回函数。



# 8. HTTP 请求 | HTTP 协议解析

从 URL 到 HTML 代码的过程。包括 HTTP 状态和 Header。

在 Node 里。 TCP 层对应的是 net 包，HTTP 层对应的是 http 包。

做 toy browser 时，不要用 http 包。

要 require net 这一层。完成 HTTP 请求。

Node 底层调 libnet 和 libpcap  一个构造包，一个抓包。

## HTTP

* Request
* Response

必须由客户端先发起一个 Request，Server才有 Response.



# 9.  | 服务端环境准备

## HTTP 协议

### HTTP Request

文本型的协议（与二进制协议相对的），它的内容是字符串，不是二进制。

第一行叫 request line，先是 Method，然后是 Path，就是那个 / 

HTTP 的版本现在有 2.0 3.0了。

后面的叫 Headers,  Headers 以空行结束。是以key: value 分隔。

```
POST / HTTP/1.1
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded
```

空行后面是 Body, Body 取决于 Content-Type 的类型。

HTTP 里的换行都是 \r\n。是两个字符的换行。



# 10.  | 实现一个 HTTP 请求

设计一个 HTTP 请求的实现

Content-Type 是必须的，它指定了 Body 的格式，如何解析Body

另外， Content-Length 也很重要，如果 Content-Type不对， HTTP 请求就是非法的。



# 11. | send 函数的编写，了解 response 格式

send 函数是一个 Promise 形式。在 send 过程中，会逐步收到 response。直到最后，我们把 response 构造好后，再去让 Promise 得到 resolve。

**因为过程中是逐步收到信息，所以有必要设计一个 Response Parser，而不是一个 Response 类**  ==这怎么理解？==

Parse 可以逐步接收信息，构造 Response 对象的不同的部分。

## Send 函数总结

* 在 Request 的构造吕中收集必要的信息

* 设计一个 send 函数，把请求真实发到服务器。

* send 函数是异步的，所以返加 Promise

## Response 的格式

下面是 Response 的例子

```
HTTP/1.1 200 OK
Content-Type: text/html
Date: Mon, 23 Dec 2019 06:56:19 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```





# 12. |发送请求

要点：

* 设计支持已经有的 Connection 或者自己新建 connection
* 收到数据传给 Parser
* 根据 Parser 的状态 Resolve Promise



# 13. | Response 解析

Response 需要通过 Parse 来解析的，刚才也写好了 Parser 的架子。

* Response 分段构造，所以用一个 ResponseParser 来“装配”
* ResponseParser 分段处理 ResponseText，我们用状态机来分析文本的结构



# 14. | Response Body 解析

Response Body 不是一个固定格式的解析。

* Response 的 Body 可能根据 Content-Type 有不同的结构，因此，我们会采用子 Parser的结构来解决问题。
* 以 TrunkedBodyParser为例，我们同样用状态机来处理 Body 的格式



# 15. HTML 解析 | HTML parse 模块的文件拆分

之前是 URL 到 HTTP 请求。现在，要把 HTML 解析成 DOM

## 拆分文件

* 把 Parse 放到单独的文件中
* Parser 接受 HTML 文件作为参数，返回一颗 DOM 树

# 16.  | 用 FSM 实现 HTML 的分析

解析 HTML 一定要用到 FSM。

首要知道 HTML 语法。

HTML 的状态机已经设计好了。

https://html.spec.whatwg.org/multipage/

在它的 12.2.5 一章叫做 Tokenization。完全用状态机描述。

HTML 标准里面共有 80 个状态。但大部分用不到。最终用到10~个状态。

## 小结

* 用 FSM 实现 HTML 分析
* 在 HTML 标准中，已经规定了 HTML 的状态，省去了我们的工作
* Toy-Browser 只挑选其中的一部分状态，完成一个最简单的版本



# 17. | 解析标签

尝试把 HTML 里的 Tag 做解析

* 开始标签
* 结束标签
* 自封闭标签

# 18. | 创建元素

# 19. | 处理属性

# 20. | 用 token 构建  DOM 树

# 21. | 将文本节点加到 DOM 树

