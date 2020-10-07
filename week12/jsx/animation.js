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