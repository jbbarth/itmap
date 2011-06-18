(function() {
  var Server;
  window.Server = Server = (function() {
    function Server(serverName, serverAttributes) {
      if (serverAttributes == null) {
        serverAttributes = {};
      }
      this.name = serverName;
      this.attributes = serverAttributes;
    }
    Server.prototype.toHtml = function() {
      var html, rel;
      html = '<div class="draggable server ' + this.attributes.css_class + '" id="srv_' + this.attributes.name + '" ';
      if (this.attributes.link_to && this.attributes.link_to.length > 1) {
        rel = this.attributes.link_to.split(",").map(function(x) {
          return "srv_" + $.trim(x);
        }).join(",");
        html += 'rel="' + rel + '" ';
      }
      html += 'style="left:' + this.attributes.pos_x + 'px; top:' + this.attributes.pos_y + 'px">';
      html += '<h5>' + this.attributes.name + '<span class="port">:' + this.attributes.port + '</span></h5>';
      if (this.attributes.desc) {
        html += '<div>' + this.attributes.desc + '</div>';
      }
      html += '</div>';
      return html;
    };
    return Server;
  })();
}).call(this);
