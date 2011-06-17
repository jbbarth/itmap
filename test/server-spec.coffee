describe "Server", ->

  beforeEach ->
    @server = new Server 'server-01'
  
  it "extracts name", ->
    expect(@server.name).toEqual 'server-01'
