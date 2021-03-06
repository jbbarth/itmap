describe "Server", ->

  beforeEach ->
    @server = new Server 'server-01', {desc: 'Main web server'}
  
  it "extracts name", ->
    (expect @server.name).toEqual 'server-01'

  it "extracts server's attributes", ->
    (expect @server.desc).toEqual 'Main web server'
    (expect @server.nonexistent).toBeUndefined

  it "works even if no attributes' hash is given", ->
    @router = new Server 'router-01'

  it "exports to HTML", ->
    (expect @server.toHtml()).toBeDefined
    (expect @server.toHtml().indexOf("rel=")).toEqual -1
    @server.link_to = "blah"
    (expect @server.toHtml().indexOf("rel=")).toBeGreaterThan 0

  it "returns an array with dependent server ids", ->
    (expect @server.targets()).toEqual []
    @server.link_to = "blah,bleh"
    (expect @server.targets()).toEqual ["blah", "bleh"]

