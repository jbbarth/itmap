(function() {
  describe("Grid", function() {
    beforeEach(function() {
      return this.grid = new Grid({
        x_start: 100,
        x_step: 170,
        y_start: 50,
        y_step: 110
      });
    });
    it("extracts options", function() {
      (expect(this.grid.options)).toBeDefined;
      return (expect(this.grid.options["x_start"])).toEqual(100);
    });
    return it("returns an horizontal distribution", function() {
      var distribution;
      distribution = this.grid.distribute_horizontally(11, 1, 0, 10);
      (expect(distribution)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      distribution = this.grid.distribute_horizontally(3, 2, 0, 100);
      (expect(distribution)).toEqual([48, 50, 52]);
      distribution = this.grid.distribute_horizontally(2, 1, 0, 100);
      return (expect(distribution)).toEqual([49.5, 50.5]);
    });
  });
}).call(this);
