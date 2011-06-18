# Connections between raphaeljs boxes
# Adapted from http://raphaeljs.com/graffle.html
Raphael.fn.connection = (obj1, obj2, line) ->
  if obj1.line and obj1.from and obj1.to
    line = obj1
    obj1 = line.from
    obj2 = line.to
  bb1 = obj1.getBBox()
  bb2 = obj2.getBBox()
  p = [
    x: bb1.x + bb1.width / 2
    y: bb1.y - 1
  ,
    x: bb1.x + bb1.width / 2
    y: bb1.y + bb1.height + 1
  ,
    x: bb1.x - 1
    y: bb1.y + bb1.height / 2
  ,
    x: bb1.x + bb1.width + 1
    y: bb1.y + bb1.height / 2
  ,
    x: bb2.x + bb2.width / 2
    y: bb2.y - 1
  ,
    x: bb2.x + bb2.width / 2
    y: bb2.y + bb2.height + 1
  ,
    x: bb2.x - 1
    y: bb2.y + bb2.height / 2
  ,
    x: bb2.x + bb2.width + 1
    y: bb2.y + bb2.height / 2
  ]
  # p == [ 1(top), 1(bottom), 1(right), 1(left), 2(top), 2(bottom), 2(left), 2(right) ]
  # the simplest way to remove some of those points is 
  # to do the following, since everything is hardcoded
  # in the algorithm to deal with 8 points exactly
  p = [ p[0], p[1], p[0], p[1], p[4], p[5], p[4], p[5] ]
  d = {}
  dis = []
  for i in [0..3]
    for j in [4..7]
      dx = Math.abs(p[i].x - p[j].x)
      dy = Math.abs(p[i].y - p[j].y)
      if (i == j - 4) or ((i != 3 and j != 6) or p[i].x < p[j].x) and ((i != 2 and j != 7) or p[i].x > p[j].x) and ((i != 0 and j != 5) or p[i].y > p[j].y) and ((i != 1 and j != 4) or p[i].y < p[j].y)
        dis.push dx + dy
        d[dis[dis.length - 1]] = [ i, j ]
  if dis.length == 0
    res = [ 0, 4 ]
  else
    res = d[Math.min.apply(Math, dis)]
  x1 = p[res[0]].x
  y1 = p[res[0]].y
  x4 = p[res[1]].x
  y4 = p[res[1]].y
  dx = Math.max(Math.abs(x1 - x4) / 2, 10)
  dy = Math.max(Math.abs(y1 - y4) / 2, 10)
  x2 = [ x1, x1, x1 - dx, x1 + dx ][res[0]].toFixed(3)
  y2 = [ y1 - dy, y1 + dy, y1, y1 ][res[0]].toFixed(3)
  x3 = [ 0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx ][res[1]].toFixed(3)
  y3 = [ 0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4 ][res[1]].toFixed(3)
  #curve line
  #path = [ "M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3) ].join(",")
  path = [ "M", x1.toFixed(3), y1.toFixed(3), x4.toFixed(3), y4.toFixed(3) ].join(",")
  if line and line.line
    line.line.attr path: path
  else
    color = (if typeof line == "string" then line else "#000")
    line: @path(path).attr(
      stroke: color
      fill: "none"
    )
    from: obj1
    to: obj2
