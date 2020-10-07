const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick_handler')

export class Timeline {
    constructor() {
        this[TICK] = () => {
            console.log('tick')
            requestAnimationFrame(this[TICK]);
        }
    }
    // 正常timeline，不需要 stop
    start() {
        this[TICK]()
    }
    // 倍速播放或慢放，这个比较高级，就不做了。
    // set rate(){}
    // get rate(){}

    pause(){

    }

    resume(){

    }

    // 可以复用或者清除

    reset(){

    }
}

export class Animation {
    // 属性动画，把一个值变成另外一个值
    // 相对的有帧动画，每秒来一张图片
    constructor(object, property, startValue, endValue, duration, timingFuction) {

    }
}