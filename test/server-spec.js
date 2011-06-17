(function() {
  describe("Server", function() {
    beforeEach(function() {
      return this.server = new Server('server-01');
    });
    return it("extracts name", function() {
      return expect(this.server.name).toEqual('server-01');
    });
  });
}).call(this);
