function getStyle(element) {
    if(!element.style)
        element.style = {};

    for(let prop in element.computedStyle) {
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value

        if(element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]) // parseInt 可以直接把后面的 px 吃掉
        }
        if(element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style
}

function layout(element) {
    if(!element.computedStyle)
        return;
    var elementStyle = getStyle(element);

    if(elementStyle.display !== 'flex')
        return;

    var items = element.children.filter(e => e.type === 'element');
    items.sort(function(a,b) {
        return (a.order || 0) - (b.order || 0)
    })

    var style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    })

    if(!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row';
    if(!style.alignItems || style.alignItems === 'auto')
    style.alignItems = 'stretch';
    if(!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start';
    if(!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap'
    if(!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'strech'

    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase

    if (style.flexDirection === 'row') {
        mainSize = 'width'
        mainStart = 'left'
        mainEnd = 'right'
        mainSign = +1;  // 从左开始去加
        mainBase = 0;   // 左边基准

        crossSize = 'height';
        crossStart = 'top'
        crossEnd = 'bottom'
    }

    if(style.flexDirection === 'row-reverse') {  // 从右往左
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1;   // 从右往左加，相当于减
        mainBase = style.width; // 右边基准

        crossSize = 'height';
        crossStart = 'top'
        crossEnd = 'bottom'

    }

    if(style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'bottom'
    }

    if(style.flexDirection === 'column-reverse') {
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1;
        mainBase = style.height

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'bottom'
    }

    if(style.flexWrap === 'wrap-reverse') { // 反向换行，十分奇葩
        var tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
    }
    else {
        crossBase = 0;
        crossSign = 1
    }

    var isAutoMainSize = false
    if(!style[mainSize])  { 
        // 特殊情况：父元素没有 width，任由子元素放，尺寸不会超。
        // 无论如何都能放到同一行中去
        elementStyle[mainSize] = 0
        for(var i=0; i < items.length; i++) {
            var item = items [i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {

                // 老师的代码不全，我猜得是要把所有元素的主轴尺寸加起来
                // elementStyle[mainSize] = elementStyle[mainSize] + ??? // TODO:
                elementStyle[mainSize] = elementStyle[mainSize] + getStyle(item)[mainSize]
            }
        }
        isAutoMainSize = true
    }

    // 把元素收进行
    var flexLine = []
    var flexLines = [flexLine]

    var mainSpace = elementStyle[mainSize]
    var crossSpace = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item)

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {  // 有 flex 属性，元素是可伸缩的。一定可以放进 flexLine
            flexLine.push(item);
        }
        else if (style.flexWrap === 'nowrap' && isAutoMainSize) { 
            mainSpace -= itemStyle[mainSize]
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                // 计算行高，一行的行高取决于最高的元素
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            flexLine.push(item)
        }
        else { // 换行的逻辑
            if (itemStyle[mainSize] > style[mainSize]) {
                // 如果元素的主轴尺寸超过了父元素的主轴尺寸，就把它压到和父元素一边大
                itemStyle[mainSize] = style[mainSize]
            }
            if (mainSpace < itemStyle[mainSize]) {
                //剩下的空间不足以容纳每一个元素
                flexLine.mainSpace = mainSpace  // 把主轴剩余空间存到这一行上，用于以后计算
                flexLine.crossSpace = crossSpace // 交叉轴的空间也存起来
                flexLine = [item] // 新建一行
                flexLines.push(flexLine)  // 放进行数组里
                mainSpace = style[mainSize] // 重置一下当前的
                crossSpace = 0
            }
            else {
                // 当前行能放下当前元素 -- 直接放就可以了
                flexLine.push(item)
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            mainSpace -= itemStyle[mainSize]
        }
    }
    flexLine.mainSpace = mainSpace;  // 最后一行的 flexLine 加上 mainSpace
    // console.log(items)

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    }
    else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        // overflow (happens only if container is single line), scale every time.
        // style[mainSize] 是容器的主尺寸，减去 mainSpace 就是期望的尺寸
        var scale = style[mainSize] / (style[mainSize] - mainSpace);  // 由于 mainSpace 小于0，所以 scale <1
        var curretMain = mainBase;
        for (var i = 0; i < items.length; i++ ) {
            var item = items[i];
            var itemStyle = getStyle(item);

            if (itemStyle.flex) {  // flex 是没有权利参加等比压缩的
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = curretMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            curretMain = itemStyle[mainEnd];
        }
    }
    else {
        // process each flex line
        flexLines.forEach(function (items) {

            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);

                if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                // There is flexible flex items
                var curretMain = mainBase;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = curretMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    curretMain = itemStyle[mainEnd]
                }
            }
            else {
                // 没有 flex 元素，就是平均分布
                if (style.justifyContent === 'flex-start') {  // 左对齐
                    var curretMain = mainBase;
                    var step = 0    // 每个元素之间没有间隔
                }
                if (style.justifyContent === 'flex-end') {  // 右对齐
                    var curretMain = mainSpace * mainSign + mainBase
                    var step = 0
                }
                if (style.justifyContent === 'center') {  // 在中间集中
                    var curretMain = mainSpace / 2 * mainSign + mainBase;
                    var step = 0
                }
                if (style .justifyContent === 'space-between') {
                    var step = mainSpace / (items.length - 1) * mainSign;  // 间隔是 items.length-1
                    var curretMain = mainBase
                }
                if (style.justifyContent === 'space-around') {
                    var step = mainSpace / items.length * mainSign;
                    var curretMain = step / 2 + mainBase;
                }
                for (var i = 0 ; i < items.length; i++) {
                    var item = items[i];
                    itemStyle[mainStart, curretMain];
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    curretMain = itemStyle[mainEnd] + step;
                }
            }
        }) // end foreEach(flexLines)
    }

    // compute the cross axis sizes
    // align-items, align-self
    var crossSpace;
    if (!style[crossSize]) { // auto sizing 父元素没有行高
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (var i = 0; i < flexLines.length; i++) {
            // 把所有行的总行高加起来 -- 我自己写得，不知道对不对。
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i][crossSize]
        }
    }
    else {
        crossSpace = style[crossSize]
        for (var i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    }
    if (style.flexWarp === 'wrap-reverse') {
        crossBase = style[crossSize]
    }
    else {
        crossBase = 0;
    }
    var lineSize = style[crossSize] /flexLines.length;

    var step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;  // 这个有什么意义吗?
        step = 0;
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace /2;
        step = 0
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossBase / (flexLines.length -1)
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);  // 带个括号是什么意思?
        crossBase += crossSign * step /2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(function(items) {

        // 先计算这一行的真实的交叉轴尺寸
        var lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length:
            items.crossSpace;
            
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var itemStyle = getStyle(item)

            var align = itemStyle.alignSelf || style.alignItems; // alignSelf 优先

            if (item === null)
                itemStyle[crossSize] = (align === 'stretch') ?
                lineCrossSize :0;

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
            }

            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) /2
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }

            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) ? itemStyle[crossSize] : lineCrossSize)
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
    console.log(items)
}

module.exports = layout;