// let element = document.documentElement;

export function dispatch(type, properties) {
    let event = new Event(type);
    for(let name in properties) {
        event[name] = properties[name]
    }
    element.dispatchEvent(event)
} 

export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;  // 已经在监听，就不再重复绑定
        let contexts = new Map();
        element.addEventListener('mousedown', event => {
        
            let context = Object.create(null) // 好习惯
            
            //统一用 start, move, end 处理鼠标事件
            recognizer.start(event, context);
        
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
                        recognizer.move(event, context)
                    }
                    button = button << 1;
                }
            };
            let mouseup = event => {
                // 双键一起按，可以看到 end 发生了两次
                console.log("end", event.button)
                let context = contexts.get("mouse" + (1<<event.button));
                recognizer.end(event, context)
                contexts.delete("mouse" + (1<<event.button))
                if(event.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }
            };
            if(!isListeningMouse){
                // 其实里面可以三个参数, capture, once, passive
                // capture -- capture 模式
                // once -- 执行一次清除掉
                // passive -- preventDefault
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
                isListeningMouse = true;
            }
        })
        // touch 系列的就这样去监听，因为你不可能越过 touch start 去 touch move
        // 不像鼠标一直可以 move
        // touch 事件里面有多个触点
        element.addEventListener("touchstart", event=>{
            for(let touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier, context)
                recognizer.start(touch, context);
            }
        })

        // 在 Move 的时候，要有 Id 去追踪，到底是哪个点在 Move
        element.addEventListener("touchmove", event=>{
            for(let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.move(touch, context)
            }
        })

        element.addEventListener("touchend", event=>{
            for(let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.end(touch, context)
                contexts.delete(touch.identifier)
            }
        })

        element.addEventListener("touchcancel", event=>{
            for(let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognizer.cancel(touch, context)
                contexts.delete(touch.identifier)
            }
        })
    }
}

export class Recognizer{
    constructor(dispatch) {
        this.dispatch = dispatch
    }
    // 触屏有多个 touch, 鼠标有左右键, 因此下面这些不适合作全局变量
    // 在函数调用时搞一个 context
    // let handler;
    // let startX, startY;
    // let isPan = false, isTap = true, isPress = false;
    start(point, context) {
        // console.log("start", point.clientX, point.clientY)
        context.startX = point.clientX, context.startY = point.clientY;
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        }];
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
    
        context.handler = setTimeout(()=>{
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null; // 避免多次 clear
            // console.log("press")
            this.dispatch("press", {});
        }, 500)
    }

    move(point, context) {
        // 是否移动 10px
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    
        // 距离大于10
        if(!context.isPan && dx ** 2 + dy **2 > 100) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            isVertical = Math.abs(dx) < Math.abs(dy)// 判断上下滑，还是左右滑
            // console.log("panstart");
            this.dispatch("panstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            });
            clearTimeout(context.handler)
        }
    
        if(context.isPan) {
            this.dispatch("pan", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
        }
    
        context.points = context.points.filter(point => Date.now() - point.t < 500);
        // 取多个点做平均
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
    }
    end(point, context) {
        if(context.isTap) {
            dispatch("tap",{})
            clearTimeout(context.handler)
        }
        if(context.isPan) {
            this.dispatch("panend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical
            })
        }
        if(context.isPress) {
            console.log("pressend")
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        let d,v;
        if(!context.points.length) {
            v = 0;
        }
        else {
            d = Math.sqrt((point.clientX - context.points[0].x) **2 + 
                    (point.clientY - context.points[0].y) **2);
            // 通过时间，计算 velocity 的速度
            v = d / (Date.now() -context.points[0].t);
        }
        // 如果 v > 1.5px/ms 就认为是比较快的，就是 flick
        if(v>1.5) {
            console.log("flick")
            context.isFlick = true
        } else {
            context.isFlick = false;
        }
    }
    
    cancel(point, context) {
        clearTimeout(context.handler)
        console.log("cancel", point.clientX, point.clientY)
    }
    
}

export function enableGesture(element) {

}