重学前端 第三周 学习笔记

# 1. JS 表达式 | 运算符和表达式

## Atom

### Grammar

### Tree vs Priority

优先级会影响语法树的构成。

JS 使用产生式来描述优先级

### Expressions

#### 最高优先级： Member 运算

* a.b

* a[b] // 运行时字符串动态访问

* foo\`string` // 函数名，相当于 foo(string) ??

* super.b // class 构造函数里用

* super['b']

* new.target  // 固定写法  

  new.target语法由一个关键字"new"，一个点，和一个属性名"target"组成。通常"new."的作用是提供属性访问的上下文，但这里"new."其实不是一个真正的对象。不过在构造方法调用中，new.target指向被new调用的构造函数，所以"new."成为了一个虚拟上下文。

  new.target属性适用于所有函数访问的元属性。在 arrow functions 中，new.target 指向最近的外层函数的new.target（An arrow function expression does not have its own this, arguments, super , or new.target) 。

* new Foo() // 带括号的 new，优先级很高

不带括号的 New

* new Foo  // 它是单独的优先级

#### Call  // 比如 foo()  优先级低于 Member,  new

* foo()
* super()
* foo()['b']
* foo().b
* foo()\`abc`

foo().a 这样在 call 后面加上 Membership 的 运算符，会使优先级降级为 call expression

**用优先级解释运算符并不严谨，应该用生成式**

比如：

```
new a()['b']  // new 出来一个对象，然后访问它的 b 属性
```

#### 左手 / 右手运算符

```
a.b = c // ok
a+b = c // wrong!
```

Expression 默认 right hand expression。Left hand expression 一定是 Right hand expression，在JS里没有例外。

* Update // 自增，自减
  * a++ / a--  / --a / ++a

#### 单目运算符  Unary

* delete a.b
* void foo()
* typeof a // 原来 typeof 可以不加括号，直接用
* \+a // 不会改变表达式的值，但可能有类型转换。
* -a
* ~a // 位运算，把整数按位取反 -- 如果不是整数，会强制转为整数
* !a // 取非，会进行 bool 类型转换 -- 有时候会用两个 !! 把任何类型的变更转成 boolean 的。
* await a // ==await 是什么鬼？== -- 后面讲

#### Exponential

* **

它是 Js 里面唯一一个右结合的运算符！！

#### 其它

* 乘除运算 / 加减运算 / 移位运算 / 关系运算

加号，两种运算

* 一种是把两个字符串拼接起来
* 另一种是把两个数字相加

#### 相等

* ==  //最好别用
* !=
* ===
* !===

#### 位运算

* & ^ |

#### 逻辑运算 //优先级最低

* && 
* || //注意逻辑运算的短路功能

#### 条件运算

* ? :  // 也是有短路逻辑的



### Reference

运行时的设施

a.b 访问了一个对象的属性。但是它从属性取出来的可不是属性的值。它取出来的是一个引用。

这个引用，Reference 并不是 Js 的7种基本类型之一。

但它确实存在于 Runtime 之中 -- 我们把它称为标准中的类型，而不是语言中的类型。

一个 Reference 分为两部分

* Object
* Key // 可以是 String，也可以是 Symbol

==delete / assign 这样的基础设施，就用到 Reference== 怎么理解？

如果我们做加、减法运算，我们就把这个 Reference 解引用，像普通的变理那样去使用。

**但是如果是 Member 这个表达式出来的，如果用于 delete，就使用 Reference，因为我们要知道删除的是哪一个对角的哪一个 key** -- 有点儿明白了。

assign 也是一样，当我们进行赋值的时候，也就当我们把 Member 运算放在等号左边，也需要知道，把表达式赋值给哪个对象的那个属性。 -- 有道理啊！

这就是引用类型的一个关键特征。

JS是在用引用类型，在 Runtime 来处理 delete , assign 这样的操作的。



# 2. JS 表达式 | 类型转换

**类型转换是重要的基础设施**

* a + b  // 作用于 number 或 string, 一旦 a, b 属于别的类型, 就进行转换
* 'false' == false // 不相等
* a[o] = 1  // Member Expression 的 Object Key 也会发生类型转换

总得来说, == 如果两边类型不同, 基本会把两边都转成 Number

尽量使用 ===

## 转换表

比较复杂,这里没有记.

## 拆箱转换

* ToPrimitive
* toString vs ValueOf  // 不同的运算会根据自己的情况,调用 toString 或者是 ValueOf
* Symbol.toPrimitive

加法会先调用 ValueOf

作为属性名时，优先调用 toString 方法。

## 装箱转换





# 3. JS 语句 | 运行时相关概念

语句 - Statement

* 简单语句
* 组合语句
* 声明 

运行时

* Completion Record
* Lexical Environment

## Completion Record

**用来存储语句完成状态的数据结构** -- 是否返回？返回值是啥？

* [[type]]: normal, break, continue, return, or throw
* [[value]]: 基本类型
* [[target]]: label

表达式语句，一定有一个返回值



# 4. 简单语句和复合语句

## 简单语句

里面不会容纳其它语句的语句

* ExpressionStatement  // 最基本的简单语句
* EmptyStmt // 单独一个分号，只是满足语言完备性
* DebuggerStmt // debugger;  专门给调试用的 -- 不知道咋用
* ThrowStmt //抛一个异常
* ContinueStmt  
* BreakStmt
* ReturnStmt // 一定在函数里用

还有与 generator 相关的 yield ... 在结构化里面讲。

## 复合语句

* BlockStmt  // {} 
* IfStmt 
* SwitchStmt // 不建议用 -- 性能没区别，易写错
* IterationStmt // for, do,  while
* WithStmt // 打开一个对象，把对象所有的属性放在一个作用域里 -- 很多编程规范里不建议用
* LabelledStmt // 在简单语句或复合语句前面加个标号
* TryStmt // try{} catch () finally {}

### Block

```{
{
	语句1
	语句2 
}
```

* [[type]] : normal 
* [[value]]: --
* [[target]]: --

### Iteration

```
while(语句) 语句
do 语句 while(语句);
for( var | const | let ; ; )
```

#### for (;;)

可以加 var , const, let 产生不同的效果 ==什么效果？==

for 语句会产生一个独立的 let 的声明的作用域。它和后面两个分号分隔的部分是两个作用域，但它是作用域的外层。

in 的使用的问题。for in 用掉了 in 关键字。

for 的结构里面，大部分不允许 in 出现。

### 标签、循环、break, continue

break 可以带 label, 能省很多判断 ==能不能给个例子？==

### try

try 必须要带 {} 

**即使中 try 里面 return 了， finally 里面的内容也会被执行。**



# 5. JS 语句 | 声明

一般认为  var 开头的变更声明，是一种语句。

而 const 和 let 被归为 LexicalDeclaration

> let是更完美的var
> let声明的变量拥有块级作用域。 也就是说用let声明的变量的作用域只是外层块，而不是整个外层函数。let 声明仍然保留了提升特性，但不会盲目提升，在示例一中，通过将var替换为let可以快速修复问题，如果你处处使用let进行声明，就不会遇到类似的bug。

> let声明的全局变量不是全局对象的属性。这就意味着，你不可以通过window.变量名的方式访问这些变量。它们只存在于一个不可见的块的作用域中，这个块理论上是Web页面中运行的所有JS代码的外层块。

> 形如for (let x...)的循环在每次迭代时都为x创建新的绑定。
> 这是一个非常微妙的区别，拿示例二来说，如果一个for (let...)循环执行多次并且循环保持了一个闭包，那么每个闭包将捕捉一个循环变量的不同值作为副本，而不是所有闭包都捕捉循环变量的同一个值。
> 所以示例二中，也以通过将var替换为let修复bug。
> 这种情况适用于现有的三种循环方式：for-of、for-in、以及传统的用分号分隔的类C循环。

> 用let重定义变量会抛出一个语法错误（SyntaxError）。
> 这个很好理解，用代码说话

> let a = 'a';
> let a = 'b';
> 上述写法是不允许的，浏览器会报错，因为重复定义了。

> ** 在这些不同之外，let和var几乎很相似了。举个例子，它们都支持使用逗号分隔声明多重变量，它们也都支持解构特性。 **

> **const 是定义常量的。**

> 作者：麻辣小隔壁
> 链接：https://www.jianshu.com/p/4e9cd99ecbf5
> 来源：简书
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

**凡是对后续产生影响的，就是声明**

## Function

Function 声明有4种形态 

* FunctionDeclaration  // function

* GeneratorDeclaration  // function * -- generator
* AsyncFunctionDeclaration // async function
* AsyncGeneratorDeclaration // async function * 

## Variable

* VariableStatement  // 既有声明作用 -- 又有实际的计算能力
* ClassDeclaration  // class
* LexicalDeclaration // const 和 let

## 声明

### 以前的声明

下面的5个声明，它们的作用范围只认 function body，块语句不好使。而且也没有先后关系，他们永远会被当作出现在函数的第一行一样去处理。 ==我用 node 试了一下，似乎不是这样==

* function
* function *
* async function
* async function *
* var 

所以 function 定义在文件尾也是没有关系的。

var 的声明作用相当于在函数头部。

### 新出现的声明

* class
* const
* let

这三个声明有共同的特点 -- 与声明的位置相关。

在没有声明之前去使用，会报错。

## 预处理机制 (pre-process)

在代码执行之前，JS 引擎本身会对代码做一段处理。

var 写的位置没有区别，都会被预处理挑出来，先进行定义。

```javascript
var a = 2;
void function() {
	a = 1;
	return ;
	var a;
}();
console.log(a)  // a=2
```

再来看看 const 

```
var a = 2;
void function() {
	a = 1;
	return ;
	const a;  // 局部变量 -- 不影响
}();
console.log(a)  // a=2
```

注意：

* 所有的声明都有预处理机制
* const 在声明之前使用会报错 -- 可以用 try {} catch() {} 来处理这种错误

## 作用域

作用域链  -- 过时了。

早期的 JS, var 和  function 是全局的。

**const 的作用域只在它所在的花括号。**

```
var a = 2;
void function() {
	a = 1;
	{
		var a;
	}
}();
console.log(a)  // a=2
```

**尽量使用新一代的声明 let, const 和 class**

# 6. JS 结构化 | 宏任务和微任务

## JS 执行粒度

* 宏任务  // 就是传给 JS 引擎的任务
* 微任务 （Promise)  // 在 JS 引擎内部的任务， 在 JS 里，只有 Promise 会产生微任务
* 函数调用 (Excution Context)
* 语句 / 声明 ( Completion Record)
* 表达式 (Reference)
* 直接量 / 变更  /this

## 宏任务和微任务

```javascript
var x = 1;
var p = new Promise(resolve => resolve());
p.then(()=> x = 3);
x = 2;
```

以上代码传给 JS 引擎，它不是一段完全顺序执行的代码。

这个代码里有 Promise 和 Then 的逻辑。Then 已经被 Resolve 掉了，所以会立即继续执行。

> 我在这里补了一下 Promise 和 Then 的用法  https://www.jianshu.com/p/063f7e490e9a

我们给 JS 引擎一段代码，但它产生了两个异步任务。

* 一个是 ：  x=1 p=...  x=2 
* 另一个是 x=3

这两个异步任务就属于微任务，Micro Task.  也叫 Job

最后的运行结果是我打印出来是2 ==老师说是3？？==

整个任务是一个宏任务 Macro Task，产生了两个 Micro Task.

## 事件循环

event loop 来自于 node

1. get code  ==》 2. execute ==》 3. wait （等待锁） 回到1





# 7. JS 结构化 | JS 函数调用

宏任务、微任务会决定代码的执行次序。

但是，在同一个微任务里面，代码也不一定是顺次执行的。因为有函数调用，可能改变执行次序。

## 函数调用

看下面的例子：

主代码

```
import {foo} from "foo.js"
var i = 0;
console.log(i);
foo()
console.log(i)
i++;
```

其中 foo 里面是这样的

```javascript
function foo() {
	console.log(i)
}
export foo;
```

**问题，这里面访问的 i 是同一个吗？**

> 在没有看继续讲解之前，我觉得是的。

老师的答案是否，我们调用的 foo 里面的这个代码，它访问的是 foo 环境里面的 i

函数调用形成了栈式的数据关系。Stack 结构。

==但是，如果是在一个文件里面的不同函数，就不太一样了，var 的作用域是全局的==

函数调用形成一个 Stack

每个函数调用都有自己的 Execution Context

形成的 Stack 称为 Execution Context Stack 执行上下文栈

栈有**栈顶元素**，就是当前能访问到的变量。

当前的执行上下文，叫 Running Execution Context，代码里所需的一切信息都从 Running Execution Context 里面去取。

## Execution Context 

EC 里面不止保存变更这么简单。它有七大件：

* code evaluation state  // 用于 async 和 Generator 函数的，保存代码执行到哪
* Function
* Script or Module
* Generator  // 只有 generator 函数需要，是 g 函数背后的 generator ==不太理解==
* Realm  // 所有保存内置对象的领域
* LexicalEnvironment
* VariableEnvironment  // var 声明的变量

**但是，没有任何一个 EC 是七件齐全的 **

EC 分为两大类：

* ECMAScript Code EC
* Generator EC

### ECMAScript Code Execution Context 

这里面没有 generator，所以，只有“六大件”

### Generator Execution Context

这里多了一个 generator 字段 

## LexicalEnvironment

* this
* new.target
* super
* 变量

## Variable Environment

历史遗留包袱。仅用于处理 var 声明。 ==看来尽量不要写 var==

## Environmnet Record (ER)

Environment 并不是单纯的一个池子，而是会形成一个链式结构。链式结构的每个结构称为一个ER。

ER 之间有继承关系。

ER // 基类，下面有三个子类

* Declarative ER  // 平时最常使用的
  * Function ER
  * Modudle ER
* Global ER  // 全局的，只有一个
* Object ER  // 给 with 用的。

## Function Closure

JS 里面，每个函数都会生成一个闭包。

闭包分成两部分：

* 代码部分 (Code)
* 环境部分 （Execution Record)

在 JS 里，每个函数都带一个在它定义时的 ER。会把这个ER保存到自己的函数对象身上，变成一个属性。

比如，下面的代码

```javascript
var y = 2
function foo2() {
	console.log(y)
}
export foo2
```

* 它的 ER 是：y:2
* 它的 code 是： console.log(y)

不管这个函数后来被传递到哪里，它都会带上 y=2 这个 ER。这就是我们的闭包。

**再看个更复杂的情况**

```javascript
var y = 2
function foo2 () {
	var z = 3
	return () => {
		console.log(y,z)
	}
}
var foo3 = foo2();
export foo3
```

对于 foo3 来说：

* 它的 ER 是： z: 3   this: global  // 为什么没有 y ??  -- 有y，通过链式的 ER 保留。
* 它的 Code 是： console.log(y,z)

而 foo2 所在的环境：

* ER: y: 2 

会作为 foo3 的上级 ER 保留下来。

这个就是 ER 的链式结构。（以前叫 scope chain，但现在不这么说了）

注意： 因为有箭头函数的引入，所以，不但 z=3 被保留了下来， 箭头函数的 this 也被保留了下，当时的  this 是 global。

# Realm

在 2018 以后 Realm 才作为标准化被定义了下来。

在 JS 中，函数表达式和对象直接量，均会创建对象 ==》比如 var x = {} 产生了一个对象。

而使用  .  做隐式转换也会创建对象。

这些对象也是有原型的，如果我们没有 Realm，就不知道它们的原型是什么。

1 .toString() ; // 装箱产生 Number 对象

这些对象的原型到底是什么呢？ 如果大家使用过 iframe的话，会发现，在不同的 iframe 里面创建的原型是不一样的。==我没使用过 iframe ..==

那么，我们需要一个设施来记录原型。

Js 设计了 Realm 对象，规定在 JS 引擎里面，它所有的内置对象会被放进一个  Realm 里面去。

不同的 Realm 实例之间，它们是完全互相独立的。也就是说我们用 instanceof 有可能会失效 ==这句话怎么理解？==

JS 可能根据不同的外部条件去创建不同的 Realm。

不同的 Realm 实例可以互相传递对象。

但是传递过来之后，它的 Prototype 是不一致的。

作业：尝试找出 JS Realm 里的所有对象。使用 JS 的数据可视化框架，比如蚂蚁前端的 G6。把 Realm 对象可视化出来。只做 JS 的 Realm 对象就可以了。





