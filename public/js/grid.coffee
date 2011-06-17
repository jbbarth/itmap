# The Grid class distributes boxes along the canvas
window.Grid = class Grid
  constructor: (options = {}) ->
    @options = options

  distribute_horizontally: (num,step,min,max) ->
    # if min = 0 and no center
    a = (n for n in [1..num])
    a = a.map((n) -> n * step)
    # barycenter
    bary = (max + min) / 2
    # center
    first_to_bary = step * (num - 1) / 2
    first_pos = bary - first_to_bary
    a = a.map((n) -> first_pos - step + n)
    #return
    a
