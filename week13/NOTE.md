学习笔记 week 13
# 1. 手势与动画 | 初步建立动画和时间线
之前的轮播，分别对两个手势进行响应。
能自动播放，就不能拖拽。

request animation frame, 浏览器执行下一帧时，执行代码。
cancel animation frame 去掉。

对于现代浏览器，用 setTimeout 比较保险。

# 2. | 设计时间线的更新

添加一些功能，让 Animation 真正可用。

在 add Animation 时添加 delay

接下来实现 Pause 和 Resume.

# 3. | 给动画添加暂停和重启功能

加暂停逻辑。

pause 很简单，但是 resume 并没有从原来的时间点启动。

我觉得还需要做一个 Pause 和 Resume 相互 排斥的功能

# 4. | 完善动画的其它功能

处理 dely 和 timingfunction 的问题。

# 5. | 对时间线进行管理

不能直接 Resume。要有状态管理。加入健壮性。



