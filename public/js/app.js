(function() {
  var active, canvas_xlimits, distrib, grid, heartbeats, line, rhclusters, server, serverJson, servers, web_app, x, y, _i, _j, _len, _len2;
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
    var boxsize, color, connections, dragger, move, paper, rect_index, server, shape, shapes, target, up, _k, _l, _len3, _len4, _results;
    paper = Raphael("map", 550, 450);
    boxsize = {
      width: 150,
      height: 40
    };
    shapes = [];
    rect_index = {};
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
}).call(this);
