export function createElement(type, atrributes, ...children) {
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
export class Component {
    constructor(type) {
        this.attributes = Object.create(null);

    }
    setAttribute(name, value) {
        // this.root.setAttribute(name, value);
        this.attributes[name] = value
    }
    appendChild(child) {
        child.mountTo(this.root);
    }
    mountTo(parent) {
        if(!this.root) {
            this.render();
        }
        parent.appendChild(this.root)
    }
}
// 正常的 div 是没有 mountTo，所以我们要有一个documentCreateElement wrapper
class ElementWrapper extends Component {
    constructor(type) {
        this.root = document.createElement(type)
    }
}
class TextWrapper extends Component{
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}