/*
 * 目标：完成 StringToNumber 和 NumberToString 两个函数
 *
 * ====================================================
 * 准备：
 * 
 * Number 有四个形式
 * 
 * 1. 十进制
 *    0, 0., 0.2, 1e3
 * 2. 二进制整数
 *    0b11
 * 3. 八进制整数
 *    0o72
 * 4. 十六进制整数
 *    0xfc
 *
 * ====================================================
 * 思路：
 *
 * StringToNumber
 * 
 *  使用正则表达式进行匹配，然后计划，然后转换
 *
 * NumberToString
 *  计算出各个位来，然后拼起来
 */

function get_digit(char) {
   if(char === '0') {
      return 0
   }
   else if (char === '1') {
      return 1
   }
   else if (char === '2') {
      return 2
   }
   else if (char === '3') {
      return 3
   }
   else if (char === '4') {
      return 4
   }
   else if (char === '5') {
      return 5
   }
   else if (char === '6') {
      return 6
   }
   else if (char === '7') {
      return 7
   }
   else if (char === '8') {
      return 8
   }
   else if (char === '9') {
      return 9
   }
   else if (char === 'a' || char === 'A') {
      return 10
   }
   else if (char === 'b' || char === 'B') {
      return 11
   }
   else if (char === 'c' || char === 'C') {
      return 12
   }
   else if (char === 'd' || char === 'D') {
      return 13
   }
   else if (char === 'e' || char === 'E') {
      return 14
   }
   else if (char === 'f' || char === 'F') {
      return 15
   }
}

function cal_int(str, prefix, order) {
   neg = (str.charAt(0) === '-')
   if (neg) {
      prefix += 1
   }
   str = str.substring(prefix)

   idx = str.length
   num = 0
   for(let i=0; i < idx; i++) {
      digit = get_digit(str.charAt(i))      
      num += digit * (order**(idx-i-1))
   }
   return neg ? -1*num : num
}

function s2n (str) {
   console.log('====================')
   console.log('your input is ', str)
   /*
    * return:
    *   undefined -- 如果输入的不是个字符串
    *   NaN -- 如果字符串不能转成数字
    *   具体结果 -- 如果正常
    */
   
   if(typeof(str) != 'string') {
      return  undefined
   }

   let decIntPat  = /^-?[1-9]\d*$/  //十进制整数
   let decIntPat0 = /^0$/           //专门匹配整数0
   let decFltPat1 = /^-?[1-9]\d*\.\d*$/       //十进制浮点数
   let decFltPat2 = /^-?0?\.\d+$/       //十进制浮点数
   let decSciPat = /^-?[1-9]\.e-?[1-9]\d*$/  //十进制科学计数法
   let binIntPat = /^-?0[bB][01]+$/         
   let octIntPat = /^-?0[oO][0-7]+$/
   let hexIntPat = /^-?0[xX][0-9a-fA-F]+$/

   if(decIntPat0.test(str)) {
      return 0
   }
   else if(decIntPat.test(str)) {
      console.log(str, ' is a decimal integer')
      return cal_int(str, 0, 10)
   }
   else if(decFltPat1.test(str)) {
      console.log(str, ' is a float')
      return df2n_1(str)
   }
   else if(decFltPat2.test(str)) {
      console.log(str, ' is a float')
      return df2n_2(str)
   }
   else if(binIntPat.test(str)) {
      console.log(str, ' is a binary')
      return cal_int(str, 2, 2) 
   }
   else if(octIntPat.test(str)) {
      console.log(str, ' is an oct')
      return cal_int(str, 2, 8)
   }
   else if(hexIntPat.test(str)) {
      console.log(str, ' is a hex')
      return cal_int(str, 2, 16)
   }
   else {
      console.log('Oops, ', str, ' is not a number')
      return NaN
   }
}

str = '0'
console.log(s2n(str)) // should print 0
str = '52'
console.log(s2n(str)) // 52
str = '-98'
console.log(s2n(str)) // -98
str = '0086'
console.log(s2n(str)) // NaN
str = '-0'
console.log(s2n(str)) // NaN
str = '-0o76'
console.log(s2n(str)) // -62
str = '0o35'
console.log(s2n(str)) // 29
str = '-0B111101'
console.log(s2n(str)) //-61
