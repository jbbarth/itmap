(function() {
  var Server;
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
      if (this.targets()) {
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
      }
    };
    return Server;
  })();
}).call(this);
