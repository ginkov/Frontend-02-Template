function kmp (src, pat) {
    // 计算回退表
    let table = new Array(pat.length).fill(0)
    {
        // 查 pat 里面有没有自重复
        let i = 1, j = 0;  // j 是重复次数
        while(i < pat.length) {
            if(pat[i] === pat[j]) {
                ++i, ++j;
                table[i] = j
            } else {
                if(j > 0)
                j = table[j];
                else {
                    ++i;
                }
            }
        }
    }
    // 因为我们还要用到 i, j，就会大括号搞一下。
    {
        let i = 0, j =0;
        while(i < src.length) {
            // if(j === pat.length) return true;
            if(pat[j] === src[i]) {
                ++i, ++j;
            } else {
                if( j > 0) j = table[j]
                else ++i;
            }
            if(j === pat.length) return true
        }
        return false
    }

    console.log(table)

    // 匹配
}
// kmp('', 'abcdabce')
// kmp('', 'ababefababc')
r = kmp('Helxlo', 'll')
// r = kmp('abcdabcdabcex', 'abcdabce')
// r = kmp('abc', 'abc')
console.log(r)
// Let code 问题 28