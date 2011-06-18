(function() {
  describe("Box", function() {
    beforeEach(function() {
      return this.box = new Box([[0, 0], [0, 100], [50, 100], [50, 0]]);
    });
    it("extracts coords", function() {
      return (expect(this.box.coords)).toBeDefined;
    });
    it("gives us a barycenter (TODO: move it to a class function)", function() {
      return (expect(this.box.barycenter([0, 20], [51, 100]))).toEqual([25.5, 60]);
    });
    return it("gives us the center of a box", function() {
      return (expect(this.box.center())).toEqual([25, 50]);
    });
  });
}).call(this);
