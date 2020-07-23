// const { stat } = require("fs")
let  currentToken = null
function emit(token) {
    console.log(token)
}
const EOF= Symbol("EOF")  // End Of File
// 利用 Symbol 的唯一性，创建了 EOF

function data(c) {
    if(c == '<') {
        return tagOpen
    }
    else if(c == EOF) {
        emit({
            type: 'EOF'
        })
    }
    else {
        // 除了 < 之外的所有字符都被理解为文本节点
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen(c) {
    if(c == '/') {
        // 结束标签的特点是左尖括号后面，有一个斜杠
        return endTagOpen
    }
    else if(c.match(/^[a-zA-Z]$/)) {
        // 如果是英文字母，这要么是一个开始标签，要么是一个自封闭标签
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    }
    else {
        return
    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) { // 以空白符结束的
        return beforeAttributeName
    }
    else if(c === '/') {
        return selfClosingStartTag
    }
    else if(c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c//.toLowerCase()
        return tagName
    }
    else if(c === '>') {
        emit(currentToken)
        return data
    }
    else {
        return tagName
    }
}

function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    }
    else if(c === '>') {
        return data
    }
    else if(c === '=') {
        return beforeAttributeName
    }
    else {
        return beforeAttributeName
    }
}
// <div />
function selfClosingStartTag(c) {
    if(c === '>') {
        currentToken.selfClosing = true
        return data
    }
    else if(c == "EOF") {
        // 报错
    }
    else {
        // 报错
    }
}

function endTagOpen(c) {
    // 结束标签的开始
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    }
    else if(c === '>') {
        // 报错
    }
    else if(c === EOF) {
        // 报错
    }
    else {

    }
}
module.exports.parseHTML = function parseHTML(html) {
    // console.log(html) // 简单的占位方法
    let state = data
    for(let c of html) {
        state = state(c)
    }
    state = state(EOF)
}