// for(let i of [1,2,3]) {
//     console.log(i)
// }
function createElement(type, atrributes, ...children) {
    // 根据生成的代码，猜测 createElement 的参数结构
    // 这里的 ... 是 javascript 的新的语法，表示把后面的所有的参数，不定个数的参数，变成
    // children 数组
    let element;
    if(typeof type==="string") 
        // element= document.createElement(type);
        element = new ElementWrapper(type)
    else
        element = new type;

    for(let name in atrributes) {
        element.setAttribute(name, atrributes[name]);
    }
    for(let child of children) {
        // 文本节点怎么办？ -- 判断类型
        if( typeof child === 'string') {
            // child = document.createTextNode(child)
            child = new TextWrapper(child)
        }
        element.appendChild(child);
    }
    return element;
}

// 正常的 div 是没有 mountTo，所以我们要有一个documentCreateElement wrapper
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        // this.root.appendChild(child)
        child.mountTo(this.root);
    }
    mountTo(parent) {
        // this.root = document.createElement("div");
        parent.appendChild(this.root)
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        // this.root.appendChild(child)
        child.mountTo(this.root);
    }
    mountTo(parent) {
        // this.root = document.createElement("div");
        parent.appendChild(this.root)
    }
}
class Div {
    constructor() {
        this.root = document.createElement('div');
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child) {
        child.mountTo(this.root)
        // this.root.appendChild(child)
    }
    mountTo(parent) {
        // this.root = document.createElement("div");
        parent.appendChild(this.root)
    }
}
// 如果是大写的 Div, 就不加引号，不成字符串了，认为你的 div 是个类 class
let a = <Div id="a">
    <span>a</span>
    <span>b</span>
    <span>c</span>
    </Div>

// document.body.appendChild(a)
a.mountTo(document.body)