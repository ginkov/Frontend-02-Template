// function that return utf
function UTF8_Encoding(string) {
    return Buffer.from(string, 'utf8')
}

// test the function

var str='hello world'
console.log(UTF8_Encoding(str));
