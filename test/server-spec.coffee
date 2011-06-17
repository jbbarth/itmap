describe "Server", ->

  beforeEach ->
    @server = new Server 'server-01', {desc: 'Main web server'}
  
  it "extracts name", ->
    (expect @server.name).toEqual 'server-01'

  it "extracts server's attributes", ->
    (expect @server.attributes["desc"]).toEqual 'Main web server'
    (expect @server.attributes["nonexistent"]).toBeUndefined

  it "works even if no attributes' hash is given", ->
    @router = new Server 'router-01'
    (expect @router.attributes).toEqual {}
