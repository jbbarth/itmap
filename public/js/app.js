(function() {
  var active, canvasOffset, canvas_xlimits, distrib, grid, heartbeats, line, rhclusters, server, serverJson, servers, web_app, x, y, _i, _j, _len, _len2;
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
  canvasOffset = 7.5;
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
  $(function() {
    var boxsize, color, connections, dragger, move, paper, rect_index, server, shape, shapes, target, up, _k, _l, _len3, _len4, _results;
    paper = Raphael("map", 550, 450);
    boxsize = {
      width: 153,
      minheight: 20,
      maxheight: 46
    };
    shapes = [];
    rect_index = {};
    $.each(servers, function() {
      var fo, h, height, newdiv, rect, w, _ref;
      $(this.toHtml()).insertBefore($("#map"));
      server = $("#srv_" + this.name)[0];
      height = $(server).outerHeight() + 1;
      _ref = [this.pos_x - canvasOffset, this.pos_y - canvasOffset, boxsize.width + 50, height], x = _ref[0], y = _ref[1], w = _ref[2], h = _ref[3];
      fo = document.createElementNS(paper.svgns, "foreignObject");
      fo.setAttribute("x", x);
      fo.setAttribute("y", y);
      fo.setAttribute("width", w);
      fo.setAttribute("height", h);
      newdiv = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
      server.setAttribute("style", "");
      newdiv.appendChild(server);
      fo.appendChild(newdiv);
      paper.canvas.appendChild(fo);
      rect = paper.rect(x, y, w, h);
      rect.foreign = fo;
      shapes.push(rect);
      return rect_index[this.name] = rect;
    });
    dragger = function() {
      this.ox = this.attr("x");
      this.oy = this.attr("y");
      if (this.foreign) {
        this.foreign.ox = this.foreign.getAttribute("x");
        return this.foreign.oy = this.foreign.getAttribute("y");
      }
    };
    move = function(dx, dy) {
      var conn, _k, _len3;
      this.attr({
        x: this.ox + dx,
        y: this.oy + dy
      });
      if (this.foreign) {
        this.foreign.setAttribute("x", parseFloat(this.foreign.ox) + dx);
        this.foreign.setAttribute("y", parseFloat(this.foreign.oy) + dy);
      }
      for (_k = 0, _len3 = connections.length; _k < _len3; _k++) {
        conn = connections[_k];
        paper.connection(conn);
      }
      return paper.safari();
    };
    up = function() {};
    for (_k = 0, _len3 = shapes.length; _k < _len3; _k++) {
      shape = shapes[_k];
      color = Raphael.getColor();
      shape.attr({
        fill: color,
        stroke: color,
        "fill-opacity": 0,
        "stroke-opacity": 0,
        "stroke-width": 0,
        cursor: "move"
      });
      shape.drag(move, dragger, up);
    }
    connections = [];
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
}).call(this);
