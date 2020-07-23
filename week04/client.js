const net = require('net')
const parser = require('./parser.js')

class ResponseParser {
    constructor () {
        // 下面是老师状态机的写法
        // 状态机有很多种写法，这是一种
        //
        // 因为 status line 有 \r\n 两个字符
        // 所以有 status_line 和 status_line_end 两个状态

        /*
         * 挑战，把老师用的常量的写法，改成函数的写法
         */
        this.WAITING_STATUS_LINE = 0   
        this.WAITING_STATUS_LINE_END = 1
        this.WAITING_HEADER_NAME = 2
        // header name 冒号后面等待空格的状态
        this.WAITING_HEADER_SPACE = 3
        this.WAITING_HEADER_VALUE = 4
        this.WAITING_HEADER_LINE_END = 5
        this.WAITING_HEADER_BLOCK_END = 6
        this.WAITING_BODY =7

        this.current = this.WAITING_STATUS_LINE
        this.statusLine = ''
        this.headers = {}
        this.headerName = ''
        this.headerValue = ''
        this.bodyParser = null
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive (string) {
        for(let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i))
        }
    }
    receiveChar (char) {
        // FSM code here.
        if(this.current === this.WAITING_STATUS_LINE) {
            if(char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END
            }
            else {
                this.statusLine += char
            }
        }
        else if(this.current === this.WAITING_STATUS_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME
            }
        }
        else if(this.current === this.WAITING_HEADER_NAME) {
            if(char === ':') {
                this.current = this.WAITING_HEADER_SPACE
            }
            else if(char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END
                if(this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new ChunkedBodyParser()
                }
            }
            else {
                this.headerName += char
            }
        }
        else if(this.current === this.WAITING_HEADER_SPACE) {
            if(char === ' ') {
                this.current = this.WAITING_HEADER_VALUE
            }
        }
        else if(this.current === this.WAITING_HEADER_VALUE) {
            if(char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ''
                this.headerValue = ''
            }
            else {
                this.headerValue += char
            }
        }
        else if(this.current === this.WAITING_HEADER_LINE_END) {
            if(char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        }
        else if(this.current === this.WAITING_HEADER_BLOCK_END) {
            if(char === '\n') {
                this.current = this.WAITING_BODY
            }
        }
        else if(this.current === this.WAITING_BODY) {
            // console.log(char)
            this.bodyParser.receiveChar(char)
        }
    }
}

class ChunkedBodyParser {
    constructor() {
        // 遇到长度为 0 的 chunk，就结了。
        this.WAITING_LENGTH = 0
        this.WAITING_LENGTH_LINE_END = 1
        // chunk 里面可以包含任何字符，只能用 length 来搞
        this.READING_TRUNK = 2
        this.WAITING_NEW_LINE = 3
        this.WAITING_NEW_LINE_END = 4
        this.length = 0
        this.content = []
        this._isFinished = false
        this.current = this.WAITING_LENGTH
    }

    get isFinished() {
        return this._isFinished
    }
    receiveChar(char) {
        if(this.current === this.WAITING_LENGTH) {
            if(char === '\r') {
                if(this.length === 0) {
                    this._isFinished = true
                }
                this.current = this.WAITING_LENGTH_LINE_END
            }
            else {
                this.length *= 16
                this.length += parseInt(char, 16)
            }
        }
        else if(this.current === this.WAITING_LENGTH_LINE_END) {
            if(char === '\n' && this._isFinished) {
                this.current = this.READING_TRUNK
            }
        }
        else if(this.current === this.READING_TRUNK) {
            this.content.push(char)
            this.length --
            // 这里实际超出了 Mealy 状态机的范围
            if(this.length === 0) {
                this.current = this.WAITING_NEW_LINE
            }
        }
        else if(this.current === this.WAITING_NEW_LINE) {
            if(char === '\r') {
                this.current = this.WAITING_NEW_LINE_END
            }
        }
        else if(this.current === this.WAITING_NEW_LINE_END) {
            if(char === '\n') {
                this.current = this.WAITING_LENGTH
            }
        }
    }
}

class Request {
    constructor(options) {
        this.method = options.method || 'GET'
        this.host = options.host
        this.port = options.port || 80
        this.path = options.path || '/'
        this.body = options.body || {}
        this.headers = options.headers || {}
        // Content-Type is mandatory, otherwise, the body can not be parsed.
        if(!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        if(this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body)
        }
        else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body)
                .map( (key) => `${key}=${encodeURIComponent(this.body[key])}`)
                .join('&')
        }

        // requst would be illegal if Content-Length is incorrect.
        this.headers['Content-Length'] = this.bodyText.length
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser
            if(connection) {
                connection.write(this.toString())
            }
            else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString())
                })
            }
            connection.on('data', (data) => {
                // console.log(data.toString())
                parser.receive(data.toString())
                if (parser.isFinished) {
                    resolve(parser.response)
                    connection.end()
                }
            })
            connection.on('error', (err) => {
                reject(err)
                connection.end()
            })
        })
    }
    toString () {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }
}
void async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8088',
        path: '/',
        headers: {
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'ginko'
        }
    })
    let response = await request.send()
    // 对真正的浏览器，必须能逐段返回包，然后逐段去解析
    console.log('============ Response Body ===============')
    console.log(response.body)
    let dom = parser.parseHTML(response.body)
}()