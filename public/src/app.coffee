#Map distribution (servers and clusters)
web_app = [
  [ {name:"lb-intra-01", port:80, css_class:"server-lb", link_to:"apache-01, apache-02"},
    {name:"lb-intra-02", port:80, css_class:"server-lb server-passive"} ],
  [ {name:"apache-01", port:80, desc:"Apache 2.2.3", css_class:"server-rp", link_to:"lb-j2ee-01"},
    {name:"apache-02", port:80, desc:"Apache 2.2.3", css_class:"server-rp", link_to:"lb-j2ee-01"} ],
  [ {name:"lb-j2ee-01", port:80, css_class:"server-lb", link_to:"tomcat-01, tomcat-02, tomcat-03"},
    {name:"lb-j2ee-02", port:80, css_class:"server-lb server-passive"} ],
  [ {name:"tomcat-01", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m", css_class:"server-j2ee", link_to:"postgres-01"},
    {name:"tomcat-02", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>256m &rarr; 1024m", css_class:"server-j2ee", link_to:"postgres-01"},
    {name:"tomcat-03", port:80, desc:"Tomcat 6.0.18 - JDK 1.6.0<br>128m &rarr; 512m", css_class:"server-j2ee", link_to:"postgres-01"} ],
  [ {name:"postgres-01", port:5432, desc:"Postgresql 9.0<br>user-01@app-01(5G)", css_class:"server-postgres"},
    {name:"postgres-02", port:5432, desc:"Postgresql 9.0<br>user-01@app-01(5G)", css_class:"server-postgres server-passive"} ]
]
rhclusters = [["postgres-01", "postgres-02"]]
heartbeats = [["lb-intra-01", "lb-intra-02"], ["lb-j2ee-01", "lb-j2ee-02"]]

servers = []
grid = new Grid {x_start: 100, x_step: 170, y_start: 30, y_step:110}
canvas_xlimits = [0, 400]

y = grid.options.y_start
for line in web_app
  active = $.grep(line, (x)-> ! x.css_class.match(/passive/))
  distrib = grid.distribute_horizontally(active.length, grid.options.x_step, canvas_xlimits[0], canvas_xlimits[1])
  x = distrib[0]
  for serverJson in line
    server = new Server(serverJson.name, serverJson)
    server.pos_x = x
    server.pos_y = y
    x += grid.options.x_step
    servers.push(server)
  y += grid.options.y_step
  y -= 50 if line[0].css_class.match(/server-lb/)

# OLD CODE WITH MANUAL CANVAS
jQuery ->
  $.each(servers, () -> $(@toHtml()).insertBefore($("#canvas")))
  prepareDraggableBoxes()
  updateCanvas($("#canvas"), $(".draggable"))
  $.each(rhclusters, () -> drawRhclusters(@[0], @[1]))
  $.each(heartbeats, () -> drawHeartbeats(@[0], @[1]))

# NEW CODE WITH RAPHAELJS
$ ->
  paper = Raphael("map", 550, 450)
  boxsize = {width: 150, height: 40}
  shapes = []
  rect_index = {}
  $.each servers, ->
    server  = $("#srv_"+@name)
    height = if @css_class.match(/server-lb/) then boxsize.height/2 else boxsize.height
    rect = paper.rect(@pos_x, @pos_y, boxsize.width, height)
    label = paper.text(@pos_x + boxsize.width/2, @pos_y + boxsize.height/4-1, @name)
    label.attr({"font-size":12})
    rect.pairs = []
    rect.pairs.push label
    if @desc
      desc = paper.text(@pos_x + boxsize.width/2, @pos_y + boxsize.height/4+15, @desc.replace("<br>","\n"))
      rect.pairs.push desc
    shapes.push(rect)
    rect_index[@name] = rect

  # make server draggable
  dragger = ->
    @ox = @attr("x")
    @oy = @attr("y")
    for pair in @pairs
      pair.ox = pair.attr("x")
      pair.oy = pair.attr("y")
    @animate({"fill-opacity": 0.2}, 500)
  move = (dx, dy) ->
    @attr({x: @ox + dx, y: @oy + dy})
    #move paired element if any
    for pair in @pairs
      pair.attr({x: pair.ox + dx, y: pair.oy + dy})
    for conn in connections
      paper.connection(conn)
    paper.safari()
  up = ->
    @animate({"fill-opacity": 0}, 500)
  for shape in shapes
    color = Raphael.getColor()
    shape.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"})
    shape.drag(move, dragger, up)
  connections = []
  window.servers = servers
  window.ri = rect_index
  for server in servers
    for target in server.targets()
      if rect_index[target]
        connections.push(paper.connection(rect_index[server.name], rect_index[target], "#444"))
