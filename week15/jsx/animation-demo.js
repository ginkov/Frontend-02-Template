import {Timeline, Animation} from "./animation.js"
import {ease, easeIn} from "./ease.js"
let tl = new Timeline();

tl.start();

//500px 的动画
tl.add(new Animation(document.querySelector("#el").style, 'transform', 0, 500, 2000,0, easeIn, v=>`translateX(${v}px)`));

document.querySelector('#el2').style.transition = 'transform ease-in 2s';
document.querySelector('#el2').style.transform = 'translateX(500px)';

document.querySelector('#pause-btn').addEventListener('click', ()=>{tl.pause();
    document.getElementById('pause-btn').disabled = true;
    document.getElementById('resume-btn').disabled = false;
});
document.querySelector('#resume-btn').addEventListener('click', ()=>{tl.resume();
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('resume-btn').disabled = true;
});
// window.tl = tl;
// window.animation = new Animation({set a(v) {console.log(v)}}, 'a', 0, 100, 1000, 200, null);

