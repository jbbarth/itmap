describe "Box", ->

  beforeEach ->
    @box = new Box([[0, 0], [0, 100], [50, 100], [50, 0]])
  
  it "extracts coords", ->
    (expect @box.coords).toBeDefined

  it "gives us a barycenter (TODO: move it to a class function)", ->
    (expect @box.barycenter([0, 20], [51, 100])).toEqual [25.5, 60]
  
  it "gives us the center of a box", ->
    (expect @box.center()).toEqual [25, 50]
