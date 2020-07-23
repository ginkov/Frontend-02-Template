// find string ab in a string

function findab(str) {
    if (!str || typeof(str) !== 'string') {
        console.log('please input a non-empty string')
        return
    }

    aflag = false   // flag of previous string is a
    for (let c of str) {
        if (c === 'b') {
            if (aflag) {
                console.log('ab found')
            }
            else {
                aflag = false
            }
        }
        else if (c === 'a') {
            aflag = true
        }
        else {
            aflag = false
        }
    }
}

str = 'you are absolutely right!'
findab(str)

str = 'it is bullshit...'
findab(str)

