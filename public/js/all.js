var Box, Grid, Server, active, canvas_xlimits, distrib, grid, heartbeats, line, rhclusters, server, serverJson, servers, web_app, x, y, _i, _j, _len, _len2;
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
    if (this.link_to && this.link_to.length > 1) {
      rel = this.link_to.split(",").map(function(x) {
        return "srv_" + $.trim(x);
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
  return Server;
})();
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
  var boxsize, color, dragger, move, paper, shape, shapes, up, _k, _len3, _results;
  paper = Raphael("map", 550, 450);
  boxsize = {
    width: 150,
    height: 40
  };
  shapes = [];
  $.each(servers, function() {
    var desc, height, label, rect;
    server = $("#srv_" + this.name);
    height = this.css_class.match(/server-lb/) ? boxsize.height / 2 : boxsize.height;
    rect = paper.rect(this.pos_x, this.pos_y, boxsize.width, height);
    label = paper.text(this.pos_x + boxsize.width / 2, this.pos_y + boxsize.height / 4 - 1, this.name);
    label.attr({
      "font-size": 12
    });
    rect.pairs = [];
    rect.pairs.push(label);
    if (this.desc) {
      desc = paper.text(this.pos_x + boxsize.width / 2, this.pos_y + boxsize.height / 4 + 15, this.desc.replace("<br>", "\n"));
      rect.pairs.push(desc);
    }
    paper.set(rect, label);
    return shapes.push(rect);
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
    var pair, _k, _len3, _ref, _results;
    this.attr({
      x: this.ox + dx,
      y: this.oy + dy
    });
    _ref = this.pairs;
    _results = [];
    for (_k = 0, _len3 = _ref.length; _k < _len3; _k++) {
      pair = _ref[_k];
      _results.push(pair.attr({
        x: pair.ox + dx,
        y: pair.oy + dy
      }));
    }
    return _results;
  };
  up = function() {
    return this.animate({
      "fill-opacity": 0
    }, 500);
  };
  _results = [];
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
    _results.push(shape.drag(move, dragger, up));
  }
  return _results;
});