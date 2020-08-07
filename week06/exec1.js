const jsdom = require('jsdom')
const {JSDOM} = jsdom

const doc =
`
<html>
<head>
</head>
<body>
<div id="myid">
hello world!
</div>
</body>
</html>
`
const dom = new JSDOM(doc)
let a = dom.window.document.getElementById('myid')
console.log(a.innerHTML)