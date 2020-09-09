学习笔记

Week 10  编程与算法训练

# 1. 使用 LL 算法构建 AST | 四则运算

AST = Abstract Syntax Tree

分词 --> 语法树

语法分析

## LL/LR

* LL: 从左到右扫描，从左到右归约
* LR: 从左到右扫描，

## 四则运算

* TokenNumber
  * 1 2 3 4 5 6 7 8 9 0 的组合，以及小数点
* Operator: + - * / 之一
* Whitespace: <SP>
* LineTerminator: <LF><CR>

## 四则运算词法定义

用产生式定义加法和乘法定义

<Expression> ::=

​	<AE>==<EOF>==

<AE> :: =

​	<ME>

​	|<AE>==<+>==<ME>

​	|<AE>==<->==<ME>

<ME>::=

​	==<Number>==

​	|<ME>==<*><Number>==

​	|<ME>==</><Number>==

Terminor Symbol -- 相当于原子 Symbol，不能再拆成其它的组合

上面标典的就是Terminor Symbol

## LL 语法分析

<AE>::=

​	<ME>

​	|<AE><+><ME>

​	|<AE><-><ME>

这时，把<ME>根据定义再展开

<AE>::=

​	<Number>

​	|<ME><*><Number>

​	|<ME></><Number>

​	|<AE><+><ME>

​	|<AE><-><ME>

只看第一个输入元素是不够的，还要看后面的元素，是加号，是乘号。



# 2. 正则表达式



# 3. LL 词法分析



# 4. LL 语法分析 (一)



# 5. LL 语法分析 (二)



# 6. 字符串分析算法  | 总论



# 7. 字典树



# 8. KMP 模式匹配算法

# 9. Wildcard



