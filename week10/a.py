import turtle
i=int(input('你想要几边形？'))
angle = 360.0 / i
distance = 1000.0 /i

turtle.begin_fill()
turtle.color('red')
turtle.circle(distance, steps=i)
turtle.end_fill()
turtle.done()
