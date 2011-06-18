(function() {
  describe("Server", function() {
    beforeEach(function() {
      return this.server = new Server('server-01', {
        desc: 'Main web server'
      });
    });
    it("extracts name", function() {
      return (expect(this.server.name)).toEqual('server-01');
    });
    it("extracts server's attributes", function() {
      (expect(this.server.desc)).toEqual('Main web server');
      return (expect(this.server.nonexistent)).toBeUndefined;
    });
    it("works even if no attributes' hash is given", function() {
      return this.router = new Server('router-01');
    });
    return it("exports to HTML", function() {
      return (expect(this.server.toHtml())).toBeDefined;
    });
  });
}).call(this);
