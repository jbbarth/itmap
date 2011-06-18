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
}).call(this);
