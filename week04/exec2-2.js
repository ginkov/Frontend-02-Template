// find substring abababx with FSM

function start(c) {
    if (c === 'a')
        return fa1
    else
        return start
}

function end(c) {
    return end
}

function fa1(c) {
    if (c === 'b')
        return fb1
    else
        return start(c)
}

function fb1(c) {
    if (c === 'a')
        return fa2
    else
        return start(c)
}

function fa2(c) {
    if (c === 'b')
        return fb2
    else
        return fa1(c)
}

function fb2(c) {
    if (c === 'a')
        return fa3
    else
        return fb1(c)
}

function fa3(c) {
    if (c === 'b')
        return fb3
    else
        return fa2(c)
}

function fb3(c) {
    if (c === 'x')
        return end(c)
    else
        return fb1(c)
}

function find3(str) {
    console.log('your input = ', str)
    let state = start
    for (let c of str) {
        state = state(c)
    }
    return state === end
}

str = 'abababababx'
console.log(find3(str)) // true

str = 'abddcaabdx'
console.log(find3(str)) // false 

str = 'aaabababx'
console.log(find3(str)) // true