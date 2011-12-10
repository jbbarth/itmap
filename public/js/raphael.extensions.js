(function() {
  Raphael.fn.connection = function(obj1, obj2, line) {
    var angle, arrowPath, arrow_length, arrow_size, bb1, bb2, color, d, dis, dx, dy, i, j, p, path, res, x1, x2, x3, x4, y1, y2, y3, y4;
    if (obj1.line && obj1.from && obj1.to) {
      line = obj1;
      obj1 = line.from;
      obj2 = line.to;
    }
    bb1 = obj1.getBBox();
    bb2 = obj2.getBBox();
    p = [
      {
        x: bb1.x + bb1.width / 2,
        y: bb1.y - 1
      }, {
        x: bb1.x + bb1.width / 2,
        y: bb1.y + bb1.height + 1
      }, {
        x: bb1.x - 1,
        y: bb1.y + bb1.height / 2
      }, {
        x: bb1.x + bb1.width + 1,
        y: bb1.y + bb1.height / 2
      }, {
        x: bb2.x + bb2.width / 2,
        y: bb2.y - 1
      }, {
        x: bb2.x + bb2.width / 2,
        y: bb2.y + bb2.height + 1
      }, {
        x: bb2.x - 1,
        y: bb2.y + bb2.height / 2
      }, {
        x: bb2.x + bb2.width + 1,
        y: bb2.y + bb2.height / 2
      }
    ];
    p = [p[0], p[1], p[0], p[1], p[4], p[5], p[4], p[5]];
    d = {};
    dis = [];
    for (i = 0; i <= 3; i++) {
      for (j = 4; j <= 7; j++) {
        dx = Math.abs(p[i].x - p[j].x);
        dy = Math.abs(p[i].y - p[j].y);
        if ((i === j - 4) || ((i !== 3 && j !== 6) || p[i].x < p[j].x) && ((i !== 2 && j !== 7) || p[i].x > p[j].x) && ((i !== 0 && j !== 5) || p[i].y > p[j].y) && ((i !== 1 && j !== 4) || p[i].y < p[j].y)) {
          dis.push(dx + dy);
          d[dis[dis.length - 1]] = [i, j];
        }
      }
    }
    if (dis.length === 0) {
      res = [0, 4];
    } else {
      res = d[Math.min.apply(Math, dis)];
    }
    x1 = p[res[0]].x;
    y1 = p[res[0]].y;
    x4 = p[res[1]].x;
    y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3);
    y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
    x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3);
    y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    arrow_length = 9;
    arrow_size = 4;
    angle = Math.atan2(x1 - x4, y4 - y1);
    angle = (angle / (2 * Math.PI)) * 360;
    arrowPath = ["M", x4, y4, "L", x4 - arrow_length, y4 - arrow_size, "L", x4 - arrow_length, y4 + arrow_size, "L", x4, y4].join(",");
    path = ["M", x1, y1, x4, y4].join(",");
    color = "#444";
    if (line && line.line) {
      line.line.attr({
        path: path
      });
      line.arrow.remove();
      return line.arrow = this.path(arrowPath).attr({
        stroke: color,
        fill: color
      }).rotate(90 + angle, x4, y4);
    } else {
      return {
        line: this.path(path).attr({
          stroke: color,
          fill: "none"
        }),
        arrow: this.path(arrowPath).attr({
          stroke: color,
          fill: color
        }).rotate(90 + angle, x4, y4),
        from: obj1,
        to: obj2
      };
    }
  };
}).call(this);
