import { linear } from "./ease.js"

const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick_handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')

const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

export class Timeline {
    constructor() {
        this.state = 'inited';
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    // 正常timeline，不需要 stop
    start() {
        if(this.state !== "inited")
            return;
        this.state = "started"
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            let now = Date.now()
            for(let animation of this[ANIMATIONS]){
                let t;
                if(this[START_TIME].get(animation) < startTime){
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                }
                else {
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                }
                if(animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if(t > 0) // delay 完成后再动
                    animation.receiveTime(t)
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK] ();
    }
    // 倍速播放或慢放，这个比较高级，就不做了。
    // set rate(){}
    // get rate(){}

    pause(){
        if(this.state !== "started")
            return;
        this.state = "paused";
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLER]);  // 彻底停下来了
    }

    resume(){
        if(this.state !== "paused")
            return;
        this.state = "started";
        this[PAUSE_TIME] +=  Date.now() - this[PAUSE_START]; // 暂停时间
        this[TICK] ();
    }

    // 可以复用或者清除

    reset(){
        this.pause();
        this.state = "inited"
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[PAUSE_START] = 0;
        this[TICK_HANDLER] = null;
    }
    add(animation, startTime) {
        if(arguments.length < 2) {
            startTime = Date.now()
        }
        this[ANIMATIONS].add(animation)
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    // 属性动画，把一个值变成另外一个值
    // 相对的有帧动画，每秒来一张图片
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.timingFunction = timingFunction || (v=>v)
        this.template = template || (v=>v)
        this.object = object
        this.property = property
        this.startValue = startValue
        this.endValue = endValue
        this.duration = duration
        this.delay = delay
        // this.timingFuction = timingFuction
        // this.template = template
    }
    receiveTime(time) {
        // console.log(time);
        let range = (this.endValue -this.startValue)
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}