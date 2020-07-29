// const { stat } = require("fs")
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{type: 'document', children: []}];  // 为栈添加初始结点

function emit(token) {
    // console.log(token)
    // if(token.type === 'text') {
    //     return
    // }
    let top = stack[stack.length - 1]

    if(token.type == 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName

        for(let p in token) {
            if(p != 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }
        top.children.push(element);
        element.parent = top;

        if(!token.isSelfClosing) {
            stack.push(element);
        }
        
        currentTextNode = null
    }
    else if(token.type == 'endTag') {
        if(top.tagName != token.tagName) {
            throw new Error('Tag start end does not match!');
        }
        else {
            stack.pop();
        }
        currentTextNode = null
    }
    else if(token.type == 'text') {
        if(currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

const EOF= Symbol("EOF")  // 利用 Symbol 的唯一性，创建了 EOF

function data(c) {
    if(c == '<') {
        return tagOpen
    }
    else if(c == EOF) {
        emit({
            type: 'EOF'
        });
        return;
    }
    else {
        // 除了 < 之外的所有字符都被理解为文本节点
        emit({
            type: 'text',
            content: c
        });
        return data
    }
}

function tagOpen(c) {
    if(c == '/') {
        return endTagOpen
    }
    else if(c.match(/^[a-zA-Z]$/)) {
        console.log(' --> tagName will be called!')
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
        console.log(' --> beforeAttributeName will be called')
        return beforeAttributeName
    }
    else if(c == '/') {
        return selfClosingStartTag
    }
    else if(c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c//.toLowerCase()
        return tagName
    }
    else if(c == '>') {
        emit(currentToken)
        return data
    }
    else {
        currentToken.tagName += c
        return tagName
    }
}

function beforeAttributeName(c) {
    // console.log('bforeAttribute is called!')
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    }
    else if(c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c)  //reconsume 当前蝗字符
        // return data
    }
    else if(c == '=') {
        // 报错
    }
    else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
        // return beforeAttributeName
    }
}

function attributeName(c) {
    if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return afterAttributeName(c)
    }
    else if(c == '=') {
        return beforeAttributeValue
    }
    else if(c == '\u0000') {

    }
    else if(c == '\"' || c == "'" || c == '<') {

    }
    else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue
    }
    else if(c == "\"") {
        return doubleQuotedAttributeValue
    }
    else if(c == "\'") {
        return singleQuotedAttributeValue
    }
    else if(c == ">") {
        // return data
    }
    else {
        return UnquotedAttributeValue(c)  //reconsume 
    }
}

function doubleQuotedAttributeValue(c) {
    if(c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    }
    else if(c == "\u0000") {

    }
    else if(c == EOF) {

    }
    else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue(c) {
    if(c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    }
    else if(c == "\u0000") {

    }
    else if(c == EOF) {

    }
    else {
        currentAttribute.value +=c
        return doubleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    }
    else if(c == '/') {
        return selfClosingStartTag
    }
    else if(c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }
    else if(c == EOF) {

    }
    else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    }
    else if(c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    }
    else if(c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }
    else if(c == "\u0000") {

    }
    else if(c == "\"" || c == "'" || c == '<' || c == '=' || c=='`') {

    }
    else if(c == EOF) {

    }
    else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}

function selfClosingStartTag(c) {
    // console.log('selfColsingStartTag is called')
    if(c == '>') {
        currentToken.isSelfClosing = true
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
    // console.log('endTagOpen is called')
    // 结束标签的开始
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    }
    else if(c == '>') {
        // 报错
    }
    else if(c == EOF) {
        // 报错
    }
    else {

    }
}

function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName
    }
    else if(c == '/') {
        return selfClosingStartTag
    }
    else if(c == '=') {
        return beforeAttributeValue
    }
    else if(c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }
    else if(c == EOF) {

    }
    else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c) //reconsume
    }
}

module.exports.parseHTML = function parseHTML(html) {
    // console.log(html) // 简单的占位方法
    let state = data
    for(let c of html) {
        // console.log('input = ', c)
        process.stdout.write(c)
        state = state(c)
    }
    state = state(EOF)
    console.log(stack[0])
}