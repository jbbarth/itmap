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
    return Server;
  })();
}).call(this);
