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
    it("exports to HTML", function() {
      (expect(this.server.toHtml())).toBeDefined;
      (expect(this.server.toHtml().indexOf("rel="))).toEqual(-1);
      this.server.link_to = "blah";
      return (expect(this.server.toHtml().indexOf("rel="))).toBeGreaterThan(0);
    });
    return it("returns an array with dependent server ids", function() {
      (expect(this.server.targets())).toBeDefined;
      this.server.link_to = "blah,bleh";
      return (expect(this.server.targets())).toEqual(["blah", "bleh"]);
    });
  });
}).call(this);
