function finda(str) {
    if (!str || typeof str !== 'string') {
        console.log('error, please give me a non-empty string')
        return
    }


    for (const c of str) {
        if (c==='a') {
            console.log('found a ');
            break;
        }
    }
}

str = 'hello world'
finda(str)   // nothing

str = 'give me give me a man after midnight'
finda(str)   // found a

