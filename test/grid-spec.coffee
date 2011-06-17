describe "Grid", ->

  beforeEach ->
    @grid = new Grid {x_start: 100, x_step: 170, y_start: 50, y_step:110}
  
  it "extracts options", ->
    (expect @grid.options).toBeDefined
    (expect @grid.options["x_start"]).toEqual 100

  it "returns an horizontal distribution", ->
    distribution = @grid.distribute_horizontally(11, 1, 0, 10)
    (expect distribution).toEqual [0..10]
    distribution = @grid.distribute_horizontally(3, 2, 0, 100)
    (expect distribution).toEqual [48, 50, 52]
    distribution = @grid.distribute_horizontally(2, 1, 0, 100)
    (expect distribution).toEqual [49.5, 50.5]
