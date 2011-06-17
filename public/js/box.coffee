# The Box class gives various utility methods on drawn boxes
window.Box = class Box
  constructor: (coords) ->
    @coords = coords

  center: ->
    @barycenter @coords[0], @coords[2]

  # Returns the barycenter of 2 points
  barycenter: (p1, p2) ->
    x = (p1[0] + p2[0]) / 2
    y = (p1[1] + p2[1]) / 2
    [x, y]
