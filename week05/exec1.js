//
// 首先要明确什么是复合选择器
// 1. div p span
// 2. h1#myid
// 3. div div.myclass > p
// 4. div h1#myid
// 
// 如果只是 1. 现有的代码就可以。
// 如果要做成通用的，还需要一些状态解析
// 原理和老师之前讲得状态机的原理类似，但是我还没有写。
//
 
function calSpec(selector) {
    // 仅能处理简单的逻辑
    var p = [0, 0, 0, 0]
    var selectorParts = selector.split(' ');
    for(var part of selectorParts) {
        if(part.charAt(0) == '#') {
            p[1] += 1
        }
        else if(part.charAt(0) == '.') {
            p[2] += 1
        }
        else {  // 什么都不带的，就是 tagname
            p[3] += 1
        }
    }
    return p;
}
