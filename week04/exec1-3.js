// find substring "abcdef"

function deepfind(str) {
    console.log('===========================')
    console.log('your input is ', str)
    if (!str || typeof str != 'string') {
        console.log('please in a non-empty string')
        return
    }
    a = false
    b = false
    c = false
    d = false
    e = false 
    for (let ch of str) {
        if (ch==='f' && a && b && c && d && e) {
            console.log('found substring abcdef')
            break
        }
        else if (ch==='e' && a && b && c && d) {
            e = true
        }
        else if (ch==='d' && a && b && c) {
            d = true
        }
        else if (ch==='c' && a && b) {
            c = true
        }
        else if (ch==='b' && a) {
            b = true
        }
        else if (ch==='a') {
            a = true
        }
        else {
            a = false
            b = false
            c = false
            d = false
            e = false
        }
    }
}


str = 'he said: abcdefg'
deepfind(str)

str = 'abdefacdg'
deepfind(str)
