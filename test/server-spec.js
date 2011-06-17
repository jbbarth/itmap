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
      (expect(this.server.attributes["desc"])).toEqual('Main web server');
      return (expect(this.server.attributes["nonexistent"])).toBeUndefined;
    });
    return it("works even if no attributes' hash is given", function() {
      this.router = new Server('router-01');
      return (expect(this.router.attributes)).toEqual({});
    });
  });
}).call(this);
