import {Component, createElement} from './framework.js'
class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
        // this.root = document.createElement('div');
    }
    setAttribute(name, value) {
        this.attributes[name] = value
    }
    render() {
        this.root = document.createElement('div')
        this.root.classList.add('carousel')
        for(let record of this.attributes.src) {
            // 不建议用 img，因为可拖拽。
            let child = document.createElement('div');
            child.style.backgroundImage=`url('${record}')`;

            // child.style.display='none';
            // child.src = record;
            this.root.appendChild(child)
        }
        let currentIndex = 0;

        setInterval(()=>{
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;
            // ++ current;
            // current = current % children.length;  // 从头开始，但是这种做法有一个明显的回拨过程，不爽
            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = "none";
            next.style.transform = `translateX(${100 - nextIndex*100}%)`

            setTimeout(()=>{
                next.style.transition = "";
                current.style.transform = `translateX(${-100-currentIndex*100}%)`;
                next.style.transform = `translateX(${- nextIndex*100}%)`;
                currentIndex = nextIndex
            },16) // 16ms 正好是 Browser 里的一帧
            // 不建议用 Request AnimationFrame，因为有很复杂的逻辑。

            // for(let child of children){
            //     child.style.transform = `translateX(-${current * 100}%)`;
            // }
        }, 600)
        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.render())
    }
}
// 如果是大写的 Div, 就不加引号，不成字符串了，认为你的 div 是个类 class
// let a = <Div id="a">
//     <span>a</span>
//     <span>b</span>
//     <span>c</span>
//     </Div>

let d = [
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
]
let a = <Carousel src={d}/>
// document.body.appendChild(a)
a.mountTo(document.body)