重学前端 第三周 学习笔记

# 1. JS 表达式 | 运算符和表达式

Atom

## Grammar

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



# JS 语句 | 运行时相关概念

# 单语句和复合语句



# JS 语句 | 声明



# JS 结构化 | 宏任务和微任务



# JS 结构化 | JS 函数调用





# 简单语句和复合语句



### Iteration

* while ( ) { }
* do { } while (); -- 这个分号是必要的吗？
* for ( 表达式 ; 表达式; 条件) { }
* for (  in ) {}

