var Box, Grid, Server, active, canvasOffset, canvas_xlimits, distrib, grid, heartbeats, line, rhclusters, server, serverJson, servers, web_app, x, y, _i, _j, _len, _len2;
window.Grid = Grid = (function() {
  function Grid(options) {
    if (options == null) {
      options = {};
    }
    this.options = options;
  }
  Grid.prototype.distribute_horizontally = function(num, step, min, max) {
    var a, bary, first_pos, first_to_bary, n;
    a = (function() {
      var _results;
      _results = [];
      for (n = 1; 1 <= num ? n <= num : n >= num; 1 <= num ? n++ : n--) {
        _results.push(n);
      }
      return _results;
    })();
    a = a.map(function(n) {
      return n * step;
    });
    bary = (max + min) / 2;
    first_to_bary = step * (num - 1) / 2;
    first_pos = bary - first_to_bary;
    a = a.map(function(n) {
      return first_pos - step + n;
    });
    return a;
  };
  return Grid;
})();
window.Box = Box = (function() {
  function Box(coords) {
    this.coords = coords;
  }
  Box.prototype.center = function() {
    return this.barycenter(this.coords[0], this.coords[2]);
  };
  Box.prototype.barycenter = function(p1, p2) {
    var x, y;
    x = (p1[0] + p2[0]) / 2;
    y = (p1[1] + p2[1]) / 2;
    return [x, y];
  };
  return Box;
})();
window.Server = Server = (function() {
  function Server(serverName, serverAttributes) {
    var key, value;
    if (serverAttributes == null) {
      serverAttributes = {};
    }
    this.name = serverName;
    for (key in serverAttributes) {
      value = serverAttributes[key];
      this[key] = value;
    }
  }
  Server.prototype.toHtml = function() {
    var html, rel;
    html = '<div class="draggable server ' + this.css_class + '" id="srv_' + this.name + '" ';
    if (this.targets() && this.targets().length > 0) {
      rel = this.targets().map(function(x) {
        return "srv_" + x;
      }).join(",");
      html += 'rel="' + rel + '" ';
    }
    html += 'style="left:' + this.pos_x + 'px; top:' + this.pos_y + 'px">';
    html += '<h5>' + this.name + '<span class="port">:' + this.port + '</span></h5>';
    if (this.desc) {
      html += '<div>' + this.desc + '</div>';
    }
    html += '</div>';
    return html;
  };
  Server.prototype.targets = function() {
    if (this.link_to && this.link_to.length > 1) {
      return this.link_to.split(",").map(function(x) {
        return x.trim();
      });
    } else {
      return [];
    }
  };
  return Server;
})();
Raphael.fn.connection = function(obj1, obj2, line) {
  var bb1, bb2, color, d, dis, dx, dy, i, j, p, path, res, x1, x2, x3, x4, y1, y2, y3, y4;
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
  path = ["M", x1.toFixed(3), y1.toFixed(3), x4.toFixed(3), y4.toFixed(3)].join(",");
  if (line && line.line) {
    return line.line.attr({
      path: path
    });
  } else {
    color = (typeof line === "string" ? line : "#000");
    return {
      line: this.path(path).attr({
        stroke: color,
        fill: "none"
      }),
      from: obj1,
      to: obj2
    };
  }
};
web_app = [
  [
    {
      name: "lb-intra-01",
      port: 80,
      css_class: "server-lb",
      link_to: "apache-01, apache-02"
    }, {
      name: "lb-intra-02",
      port: 80,
      css_class: "server-lb server-passive"
    }
  ], [
    {
      name: "apache-01",
      port: 80,
      desc: "Apache 2.2.3",
      css_class: "server-rp",
      link_to: "lb-j2ee-01"
    }, {
      name: "apache-02",
      port: 80,
      desc: "Apache 2.2.3",
      css_class: "server-rp",
      link_to: "lb-j2ee-01"
    }
  ], [
    {
      name: "lb-j2ee-01",
      port: 80,
      css_class: "server-lb",
      link_to: "tomcat-01, tomcat-02, tomcat-03"
    }, {
      name: "lb-j2ee-02",
      port: 80,
      css_class: "server-lb server-passive"
    }
  ], [
    {
      name: "tomcat-01",
      port: 80,
      desc: "Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m",
      css_class: "server-j2ee",
      link_to: "postgres-01"
    }, {
      name: "tomcat-02",
      port: 80,
      desc: "Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m",
      css_class: "server-j2ee",
      link_to: "postgres-01"
    }, {
      name: "tomcat-03",
      port: 80,
      desc: "Tomcat 6.0.18 - JDK 1.6.0<br>128m &rarr; 512m",
      css_class: "server-j2ee",
      link_to: "postgres-01"
    }
  ], [
    {
      name: "postgres-01",
      port: 5432,
      desc: "Postgresql 9.0<br>user-01@app-01(5G)",
      css_class: "server-postgres"
    }, {
      name: "postgres-02",
      port: 5432,
      desc: "Postgresql 9.0<br>user-01@app-01(5G)",
      css_class: "server-postgres server-passive"
    }
  ]
];
rhclusters = [["postgres-01", "postgres-02"]];
heartbeats = [["lb-intra-01", "lb-intra-02"], ["lb-j2ee-01", "lb-j2ee-02"]];
servers = [];
grid = new Grid({
  x_start: 100,
  x_step: 170,
  y_start: 30,
  y_step: 110
});
canvas_xlimits = [0, 400];
canvasOffset = 8;
y = grid.options.y_start;
for (_i = 0, _len = web_app.length; _i < _len; _i++) {
  line = web_app[_i];
  active = $.grep(line, function(x) {
    return !x.css_class.match(/passive/);
  });
  distrib = grid.distribute_horizontally(active.length, grid.options.x_step, canvas_xlimits[0], canvas_xlimits[1]);
  x = distrib[0];
  for (_j = 0, _len2 = line.length; _j < _len2; _j++) {
    serverJson = line[_j];
    server = new Server(serverJson.name, serverJson);
    server.pos_x = x;
    server.pos_y = y;
    x += grid.options.x_step;
    servers.push(server);
  }
  y += grid.options.y_step;
  if (line[0].css_class.match(/server-lb/)) {
    y -= 50;
  }
}
jQuery(function() {
  $.each(servers, function() {
    return $(this.toHtml()).insertBefore($("#canvas"));
  });
  prepareDraggableBoxes();
  updateCanvas($("#canvas"), $(".draggable"));
  $.each(rhclusters, function() {
    return drawRhclusters(this[0], this[1]);
  });
  return $.each(heartbeats, function() {
    return drawHeartbeats(this[0], this[1]);
  });
});
$(function() {
  var boxsize, color, connections, dragger, move, paper, rect_index, server, shape, shapes, target, up, _k, _l, _len3, _len4, _results;
  paper = Raphael("map", 550, 450);
  boxsize = {
    width: 150,
    minheight: 20,
    maxheight: 46
  };
  shapes = [];
  rect_index = {};
  $.each(servers, function() {
    var desc, height, label, rect;
    server = $("#srv_" + this.name);
    height = this.css_class.match(/server-lb/) ? boxsize.minheight : boxsize.maxheight;
    rect = paper.rect(this.pos_x - canvasOffset, this.pos_y - canvasOffset, boxsize.width, height);
    label = paper.text(this.pos_x - canvasOffset + boxsize.width / 2, this.pos_y - canvasOffset + boxsize.minheight / 2 - 1, this.name);
    label.attr({
      "font-size": 12
    });
    rect.pairs = [];
    rect.pairs.push(label);
    if (this.desc) {
      desc = paper.text(this.pos_x - canvasOffset + boxsize.width / 2, this.pos_y - canvasOffset + boxsize.maxheight / 4 + 18, this.desc.replace("<br>", "\n"));
      rect.pairs.push(desc);
    }
    shapes.push(rect);
    return rect_index[this.name] = rect;
  });
  dragger = function() {
    var pair, _k, _len3, _ref;
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    _ref = this.pairs;
    for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
      pair = _ref[_k];
      pair.ox = pair.attr("x");
      pair.oy = pair.attr("y");
    }
    return this.animate({
      "fill-opacity": 0.2
    }, 500);
  };
  move = function(dx, dy) {
    var conn, pair, _k, _l, _len3, _len4, _ref;
    this.attr({
      x: this.ox + dx,
      y: this.oy + dy
    });
    _ref = this.pairs;
    for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
      pair = _ref[_k];
      pair.attr({
        x: pair.ox + dx,
        y: pair.oy + dy
      });
    }
    for (_l = 0, _len4 = connections.length; _l < _len4; _l++) {
      conn = connections[_l];
      paper.connection(conn);
    }
    return paper.safari();
  };
  up = function() {
    return this.animate({
      "fill-opacity": 0
    }, 500);
  };
  for (_k = 0, _len3 = shapes.length; _k < _len3; _k++) {
    shape = shapes[_k];
    color = Raphael.getColor();
    shape.attr({
      fill: color,
      stroke: color,
      "fill-opacity": 0,
      "stroke-width": 2,
      cursor: "move"
    });
    shape.drag(move, dragger, up);
  }
  connections = [];
  window.servers = servers;
  window.ri = rect_index;
  _results = [];
  for (_l = 0, _len4 = servers.length; _l < _len4; _l++) {
    server = servers[_l];
    _results.push((function() {
      var _len5, _m, _ref, _results2;
      _ref = server.targets();
      _results2 = [];
      for (_m = 0, _len5 = _ref.length; _m < _len5; _m++) {
        target = _ref[_m];
        _results2.push(rect_index[target] ? connections.push(paper.connection(rect_index[server.name], rect_index[target], "#444")) : void 0);
      }
      return _results2;
    })());
  }
  return _results;
});