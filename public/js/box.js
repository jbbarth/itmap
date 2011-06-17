(function() {
  var Box;
  window.Box = Box = (function() {
    function Box(coords) {
      this.coords = coords;
    }
    Box.prototype.center = function() {
      return this.barycenter(this.coords[0], this.coords[2]);
    };
    Box.prototype.barycenter = function(p1, p2) {
      var x, y;
      x = (p1[0] + p2[0]) / 2;
      y = (p1[1] + p2[1]) / 2;
      return [x, y];
    };
    return Box;
  })();
}).call(this);
