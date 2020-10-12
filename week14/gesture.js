let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener('mousedown', event => {

    let context = Object.create(null) // 好习惯
    
    //统一用 start, move, end 处理鼠标事件
    start(event, context);

    // mousemove 事件有一个 button 属性，是5位二进制，按掩码取的
    // 我们要把 mousedown 的这个按键，与 mousemove 的相对应
    contexts.set("mouse"+ (1 << event.button), context);

    let mousemove = event => {
        let button = 1;
        // event.buttons 用二进制掩码表示鼠标哪个键被按下来了
        // console.log("mouse move buttons: ", event.buttons)
        while(button <= event.buttons) {
            if(button & event.buttons) {
                // order of buttons vs button are not same.
                let key;
                if(button === 2)
                    key = 4;
                else if (button === 4)
                    key = 2;
                else
                    key = button
                // buttons 的顺序与 button 的定义不一样。
                // buttons 是左、中、右, 而不像 button 的定义是 左0, 右1, 中2
                let context = contexts.get("mouse"+ key)
                move(event, context)
            }
            button = button << 1;
        }
    };
    let mouseup = event => {
        let context = contexts.get("mouse" + (1<<event.button));
        end(event, context)
        contexts.delete("mouse" + (1<<event.button))
        element.removeEventListener('mousemove', mousemove);
        element.removeEventListener('mouseup', mouseup);
    };
    // 其实里面可以三个参数, capture, once, passive
    // capture -- capture 模式
    // once -- 执行一次清除掉
    // passive -- preventDefault
    element.addEventListener('mousemove', mousemove);
    element.addEventListener('mouseup', mouseup);
})

let contexts = new Map();

// touch 系列的就这样去监听，因为你不可能越过 touch start 去 touch move
// 不像鼠标一直可以 move
// touch 事件里面有多个触点
element.addEventListener("touchstart", event=>{
    for(let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context)
        start(touch, context);
    }
})

// 在 Move 的时候，要有 Id 去追踪，到底是哪个点在 Move
element.addEventListener("touchmove", event=>{
    for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier)
        move(touch, context)
    }
})

element.addEventListener("touchend", event=>{
    for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier)
        end(touch, context)
        contexts.delete(touch.identifier)
    }
})

element.addEventListener("touchcancel", event=>{
    for(let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier)
        cancel(touch, context)
        contexts.delete(touch.identifier)
    }
})

// 触屏有多个 touch, 鼠标有左右键, 因此下面这些不适合作全局变量
// 在函数调用时搞一个 context
let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;

let start = (point, context) => {
    // console.log("start", point.clientX, point.clientY)
    context.startX = point.clientX, context.startY = point.clientY;

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.handler = setTimeout(()=>{
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        context.handler = null; // 避免多次 clear
        console.log("press")
    }, 500)
}

let move = (point, context) => {
    // 是否移动 10px
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;

    // 距离大于10
    if(!context.isPan && dx ** 2 + dy **2 > 100) {
        context.isTap = false;
        context.isPan = true;
        context.isPress = false;
        console.log("panstart");
        clearTimeout(context.handler)
    }

    if(context.isPan) {
        console.log('dx, dy= ', dx, dy)
        console.log("pan")
    }
}

let end = (point, context) => {
    if(context.isTap) {
        console.log("tap")
        clearTimeout(context.handler)
    }
    if(context.isPan) {
        console.log("panend")
    }
    if(context.isPress) {
        console.log("pressend")
    }
    // console.log("end", point.clientX, point.clientY)
}

let cancel = (point, context) => {
    clearTimeout(context.handler)
    console.log("cancel", point.clientX, point.clientY)
}