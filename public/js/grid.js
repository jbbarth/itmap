(function() {
  var Grid;
  window.Grid = Grid = (function() {
    function Grid(options) {
      if (options == null) {
        options = {};
      }
      this.options = options;
    }
    Grid.prototype.distribute_horizontally = function(num, step, min, max) {
      var a, bary, first_pos, first_to_bary, n;
      a = (function() {
        var _results;
        _results = [];
        for (n = 1; 1 <= num ? n <= num : n >= num; 1 <= num ? n++ : n--) {
          _results.push(n);
        }
        return _results;
      })();
      a = a.map(function(n) {
        return n * step;
      });
      bary = (max + min) / 2;
      first_to_bary = step * (num - 1) / 2;
      first_pos = bary - first_to_bary;
      a = a.map(function(n) {
        return first_pos - step + n;
      });
      return a;
    };
    return Grid;
  })();
}).call(this);
