import {Component, createElement} from './framework.js'
import {Carousel} from './carousel.js'
import {Timeline} from './animation.js'
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

let tl = new Timeline();
tl.start();
