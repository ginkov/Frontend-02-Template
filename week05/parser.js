// const { stat } = require("fs")
const css = require('css')
const EOF= Symbol("EOF")  // 利用 Symbol 的唯一性，创建了 EOF
const layout = require("./layout.js")

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{type: 'document', children: []}];  // 为栈添加初始结点

let rules = []
function addCSSRules(text) {
    var ast = css.parse(text)  // 偷懒用了 npm 包
    // console.log(JSON.stringify(ast, null, "    "));
    rules.push(...ast.stylesheet.rules)   ///... 是什么鬼？ 展开，作为 push 的参数，要不然要调 apply
}
// ----- 假设这里只有三种简单选择器 -----
// .a  -- class 选择器  （我们仅考虑一个 class 的情况)
// #a  -- id 选择器
// div -- tagName 选择器
function match(element, selector) {
    if(!selector || !element.attributes) {
        return false
    }

    if(selector.charAt(0) == '#') {
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if(attr && attr.value === selector.replace('#', '')) {
            return true
        }
    }
    else if(selector.charAt[0] == '.') {
        var attr = element.attributes.filter(attr => attr.name === "class")[0]
        if(attr && attr.value === selector.replace('.', '')){
            return true
        }
    }
    else {
        if(element.tagName === selector) {
            return true
        }
    }
    return false
}

function specificity(selector) {
    var p = [0, 0, 0, 0]
    var selectorParts = selector.split(' ');
    for(var part of selectorParts) {
        if(part.charAt(0) == '#') {
            p[1] += 1
        }
        else if(part.charAt(0) == '.') {
            p[2] += 1
        }
        else {  // 什么都不带的，就是 tagname
            p[3] += 1
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if(sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if(sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if(sp1[2] - sp2[2])
        return sp1[2] - sp2[2];

    return sp1[3] - sp2[3];
}

function computeCSS(element) {
    var elements = stack.slice().reverse()
    // slice() 不传参数时默认把数据复制一遍
    // 之所以要 reverse() 是因为标签匹配是从当前元素开始的

    if(!element.computedStyle){
        element.computedStyle = {}
    }

    // 双循环选择器和元素的父元素，找到它们是否匹配
    for(let rule of rules) {
        var selectorParts = rule.selectors[0].split(' ').reverse() 
        // 不考虑带逗号的情况，直接取 selectors[0]

        if(!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false

        var j = 1; // 当前选择器的位置
        for(var i = 0; i < elements.length; i++) {  // i 表示当前元素的位置
            if(match(elements[i], selectorParts[j])) {
                j ++  // 一旦元素匹配到选择器，就让 j 自增
            }
        }
        if(j >= selectorParts.length) {
            // 如果所有的选择器都匹配到了，让为匹配成功
            matched = true;
        }
        if(matched) {
            // console.log('------------------')
            // console.log('Element ', element, '\n\nmatched rule: ', rule)
            var sp = specificity(rule.selectors[0])
            var computedStyle = element.computedStyle
            for(var declaration of rule.declarations) {
                if(!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {}

                if(!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
                else if(compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
                // computedStyle[declaration.property].value = declaration.value
            }
            console.log(element.computedStyle)

        }
    }
    // console.log(rules)
    // console.log('compute CSS for Element', element)
    let inlineStyle = element.attributes.filter(p => p.name == 'style')
    css.parse('* {' + inlineStyle + '}')
    sp = [1, 0, 0, 0]
    // for(...) {...}
}

function emit(token) {
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
        // 重点在于计算 CSS 入栈的时机，是在 startTag 入栈的时候。
        computeCSS(element)

        top.children.push(element);
        // element.parent = top;

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
            // ----------- 遇到 style 标签时，执行添加 CSS 规则的操作 ------------ //
            if(top.tagName === 'style') {  // 不去处理 link 标签了
                addCSSRules(top.children[0].content)
            }
            layout(top);  // Flex 要知道子元素，子元素发生在标签的结束标签之前
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
        // console.log(' --> tagName will be called!')
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
        // console.log(' --> beforeAttributeName will be called')
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
        emit(currentToken)  // added by yinxin
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
    // console.log(html) 
    let state = data
    for(let c of html) {
        // console.log('input = ', c)
        // process.stdout.write(c)
        state = state(c)
    }
    state = state(EOF)
    return stack[0]
    // console.log(stack[0])
    // console.log(rules)
}
