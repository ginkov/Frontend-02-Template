// find substring abcabx with FSM

// 看了老师的例子，发现自己果然写错了。
// 没有考虑到 abcabcabx 的情况。
// 增加了回撤逻辑，搞定了。

// 另外，我注意到， return start 是返回一个函数
// 而  return start(c) 实际发起了一个调用，当然这个调用的结果，最终还是返回函数

function start(c) {
    // start 就相当于 fa1
    if (c === 'a')
        return fb1
    else
        return start
}

function end(c) {
    return end
}

/*
function fa1(c) {
    if (c === 'a')
        return fb1
    else
        return start(c)
}
*/

function fb1(c) {
    if (c === 'b')
        return fc
    else
        return start(c)
}

function fc(c) {
    if (c === 'c')
        return fa2
    else 
        return start(c)
}

function fa2(c) {
    if (c === 'a')
        return fb2
    else
        return start(c)
}

function fb2(c) {
    if (c === 'b')
        return fx
    else
        return start(c)
}

function fx(c) {
    if (c === 'x')
        return end
    else
        // return start(c)
        return fc(c)
}

function find3(str) {
    console.log('your input = ', str)
    let state = start
    for (let c of str) {
        state = state(c)
    }
    return state === end
}

str = 'ababcabx'
console.log(find3(str)) // true

str = 'abddcadx'
console.log(find3(str)) // false 

str = 'abcabcabx'
console.log(find3(str)) // true
