var Box, Grid, Server;
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