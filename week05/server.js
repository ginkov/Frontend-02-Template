//不会写 Server，是照抄老师的代码完成的。

const http = require('http')

const server = http.createServer((req, res) => {
    console.log('request received')
    console.log(req.headers)
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('X-Foo', 'bar')
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(
`
<html maaa=a >
<head>
    <style>
#container {
    width: 500px;
    height: 300px;
    display: flex;
    background-color: rgb(255,255,255);
}
#container #myid {
    width: 200px;
    height: 100px;
    background-color: rgb(255,0,0);
}
#container .c1 {
    flex: 1;
    background-color: rgb(0,255,0);
}
    </style>
</head>
<body>
    <div id="container">
        <div id="myid"/>
        <div class="c1"/>
    </div>
</body>
</html>
`        
    )
})

server.listen(8088)

/*
http.createServer((request, response) => {
    let body = []
    request.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        // body.push(chunk.toString())   // 这样写会报错！为什么?
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        console.log('body:', body)
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.end(' Hello World\n')
    })
}).listen(8088)
*/
console.log('server started')